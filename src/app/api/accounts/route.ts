import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { twitterAccounts, oauthStates, auditLogs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  generatePKCEChallenge,
  getAuthorizationUrl,
} from "@/services/twitter/auth";
import { ensureRedis } from "@/lib/redis";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await db.query.twitterAccounts.findMany({
      where: and(
        eq(twitterAccounts.userId, session.user.id),
        eq(twitterAccounts.isActive, true)
      ),
    });

    const safeAccounts = accounts.map(
      ({ accessToken, refreshToken, ...rest }) => rest
    );

    return NextResponse.json({ data: safeAccounts });
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.X_CLIENT_ID || !process.env.X_REDIRECT_URI) {
      return NextResponse.json(
        { error: "X API credentials are not configured" },
        { status: 503 }
      );
    }

    const { verifier, challenge, state } = generatePKCEChallenge();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Prefer Redis; always persist to DB as durable fallback
    try {
      const r = await ensureRedis();
      await r.set(
        `oauth:pkce:${state}`,
        JSON.stringify({ verifier, userId: session.user.id }),
        "EX",
        600
      );
    } catch {
      // Redis optional for connect flow
    }

    await db.insert(oauthStates).values({
      state,
      userId: session.user.id,
      verifier,
      expiresAt,
    });

    const authUrl = getAuthorizationUrl(challenge, state);

    return NextResponse.json({ data: { authUrl, state } });
  } catch (error) {
    console.error("Failed to initiate connection:", error);
    return NextResponse.json(
      { error: "Failed to initiate connection" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = new URL(request.url).searchParams.get("id");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    const existing = await db.query.twitterAccounts.findFirst({
      where: and(
        eq(twitterAccounts.id, accountId),
        eq(twitterAccounts.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    await db
      .update(twitterAccounts)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(twitterAccounts.id, accountId));

    await db.insert(auditLogs).values({
      userId: session.user.id,
      action: "account.disconnect",
      metadata: { accountId, username: existing.username },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
