import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { postSchema } from "@/features/posts/schemas";
import { createPost } from "@/services/post/create";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const offset = (page - 1) * limit;

    const whereCondition = status
      ? and(
          eq(posts.userId, session.user.id),
          eq(
            posts.status,
            status as "draft" | "scheduled" | "publishing" | "published" | "failed"
          )
        )
      : eq(posts.userId, session.user.id);

    const userPosts = await db.query.posts.findMany({
      where: whereCondition,
      with: {
        postAccounts: {
          with: {
            twitterAccount: true,
          },
        },
      },
      orderBy: [desc(posts.createdAt)],
      limit,
      offset,
    });

    // Strip tokens from nested accounts
    const sanitized = userPosts.map((p) => ({
      ...p,
      postAccounts: p.postAccounts?.map((pa) => ({
        ...pa,
        twitterAccount: pa.twitterAccount
          ? {
              id: pa.twitterAccount.id,
              username: pa.twitterAccount.username,
              displayName: pa.twitterAccount.displayName,
              avatar: pa.twitterAccount.avatar,
              isActive: pa.twitterAccount.isActive,
            }
          : null,
      })),
    }));

    return NextResponse.json({ data: sanitized });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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
    const validated = postSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { content, accountIds, scheduledAt, mode } = validated.data;

    const newPost = await createPost({
      userId: session.user.id,
      content,
      accountIds,
      scheduledAt: scheduledAt ?? null,
      mode: mode ?? (scheduledAt ? "schedule" : "now"),
    });

    return NextResponse.json({ data: newPost }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
