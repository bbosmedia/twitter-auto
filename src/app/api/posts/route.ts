import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { posts, postAccounts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { postSchema } from "@/features/posts/schemas";

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const whereCondition = status
      ? and(eq(posts.userId, session.user.id), eq(posts.status, status as any))
      : eq(posts.userId, session.user.id);

    const userPosts = await db.query.posts.findMany({
      where: whereCondition,
      orderBy: [desc(posts.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({ data: userPosts });
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
        { error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { content, accountIds, scheduledAt } = validated.data;

    // Create the post
    const [newPost] = await db
      .insert(posts)
      .values({
        userId: session.user.id,
        content,
        status: scheduledAt ? "scheduled" : "draft",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      })
      .returning();

    // Create post_accounts entries
    const postAccountEntries = accountIds.map((accountId) => ({
      postId: newPost.id,
      twitterAccountId: accountId,
      status: "pending" as const,
    }));

    await db.insert(postAccounts).values(postAccountEntries);

    return NextResponse.json({ data: newPost }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
