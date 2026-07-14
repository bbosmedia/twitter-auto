import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { twitterAccounts, oauthStates, auditLogs } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import {
  exchangeCodeForTokens,
  fetchXUser,
} from "@/services/twitter/auth";
import { encrypt } from "@/lib/crypto";
import { ensureRedis } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/accounts?error=missing_params", request.url)
    );
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    let verifier: string | null = null;

    try {
      const r = await ensureRedis();
      const raw = await r.get(`oauth:pkce:${state}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { verifier: string; userId: string };
        if (parsed.userId === session.user.id) {
          verifier = parsed.verifier;
        }
        await r.del(`oauth:pkce:${state}`);
      }
    } catch {
      // fall through to DB
    }

    if (!verifier) {
      const rows = await db
        .select()
        .from(oauthStates)
        .where(
          and(
            eq(oauthStates.state, state),
            eq(oauthStates.userId, session.user.id),
            gt(oauthStates.expiresAt, new Date())
          )
        )
        .limit(1);
      const row = rows[0];
      if (row) {
        verifier = row.verifier;
        await db.delete(oauthStates).where(eq(oauthStates.state, state));
      }
    }

    if (!verifier) {
      return NextResponse.redirect(
        new URL("/accounts?error=invalid_state", request.url)
      );
    }

    const tokens = await exchangeCodeForTokens(code, verifier);
    const xUser = await fetchXUser(tokens.access_token);

    const existing = await db.query.twitterAccounts.findFirst({
      where: and(
        eq(twitterAccounts.userId, session.user.id),
        eq(twitterAccounts.xUserId, xUser.id)
      ),
    });

    if (existing) {
      await db
        .update(twitterAccounts)
        .set({
          username: xUser.username,
          displayName: xUser.name,
          avatar: xUser.profile_image_url ?? null,
          accessToken: encrypt(tokens.access_token),
          refreshToken: encrypt(tokens.refresh_token),
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(twitterAccounts.id, existing.id));
    } else {
      await db.insert(twitterAccounts).values({
        userId: session.user.id,
        xUserId: xUser.id,
        username: xUser.username,
        displayName: xUser.name,
        avatar: xUser.profile_image_url ?? null,
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        isActive: true,
      });
    }

    await db.insert(auditLogs).values({
      userId: session.user.id,
      action: "account.connect",
      metadata: { username: xUser.username, xUserId: xUser.id },
    });

    return NextResponse.redirect(
      new URL("/accounts?success=connected", request.url)
    );
  } catch (err) {
    console.error("Twitter OAuth error:", err);
    return NextResponse.redirect(
      new URL("/accounts?error=connection_failed", request.url)
    );
  }
}
