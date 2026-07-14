import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { posts, postAccounts, twitterAccounts } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get posts that are scheduled or publishing
    const queuedPosts = await db.query.posts.findMany({
      where: and(
        eq(posts.userId, session.user.id),
        or(
          eq(posts.status, "scheduled"),
          eq(posts.status, "publishing"),
          eq(posts.status, "failed")
        )
      ),
      orderBy: [posts.scheduledAt],
    });

    return NextResponse.json({ data: queuedPosts });
  } catch (error) {
    console.error("Failed to fetch queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue" },
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

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Verify post belongs to user and is failed
    const post = await db.query.posts.findFirst({
      where: and(
        eq(posts.id, postId),
        eq(posts.userId, session.user.id),
        eq(posts.status, "failed")
      ),
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or not in failed state" },
        { status: 404 }
      );
    }

    // Reset post and its accounts to pending
    await db
      .update(posts)
      .set({ status: "scheduled", error: null, updatedAt: new Date() })
      .where(eq(posts.id, postId));

    await db
      .update(postAccounts)
      .set({ status: "pending", error: null })
      .where(eq(postAccounts.postId, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to retry post:", error);
    return NextResponse.json(
      { error: "Failed to retry post" },
      { status: 500 }
    );
  }
}
