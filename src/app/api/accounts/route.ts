import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generatePKCEChallenge, getAuthorizationUrl } from "@/services/twitter/auth";

const pendingVerifiers = new Map<string, PKCEChallenge>();

interface PKCEChallenge {
  verifier: string;
  challenge: string;
  state: string;
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await db.query.twitterAccounts.findMany({
      where: eq(twitterAccounts.userId, session.user.id),
    });

    // Don't expose tokens to client
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { verifier, challenge, state } = generatePKCEChallenge();

    // Store verifier temporarily (in production, use Redis or session)
    pendingVerifiers.set(state, { verifier, challenge, state });

    const authUrl = getAuthorizationUrl(verifier, challenge, state);

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

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    await db
      .update(twitterAccounts)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        eq(twitterAccounts.id, accountId)
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
