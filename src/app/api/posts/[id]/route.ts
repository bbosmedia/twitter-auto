import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { posts, postAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { updatePostSchema } from "@/features/posts/schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, id), eq(posts.userId, session.user.id)),
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postAccountData = await db.query.postAccounts.findMany({
      where: eq(postAccounts.postId, id),
    });

    return NextResponse.json({ data: { ...post, accounts: postAccountData } });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updatePostSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.id, id), eq(posts.userId, session.user.id)),
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (validated.data.content) updateData.content = validated.data.content;
    if (validated.data.scheduledAt)
      updateData.scheduledAt = new Date(validated.data.scheduledAt);

    await db.update(posts).set(updateData).where(eq(posts.id, id));

    // Update account associations if provided
    if (validated.data.accountIds) {
      // Remove existing
      await db
        .delete(postAccounts)
        .where(eq(postAccounts.postId, id));

      // Add new
      const newEntries = validated.data.accountIds.map((accountId) => ({
        postId: id,
        twitterAccountId: accountId,
        status: "pending" as const,
      }));

      await db.insert(postAccounts).values(newEntries);
    }

    const updatedPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    });

    return NextResponse.json({ data: updatedPost });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.id, id), eq(posts.userId, session.user.id)),
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only allow deleting drafts
    if (existingPost.status !== "draft") {
      return NextResponse.json(
        { error: "Only draft posts can be deleted" },
        { status: 400 }
      );
    }

    await db.delete(postAccounts).where(eq(postAccounts.postId, id));
    await db.delete(posts).where(eq(posts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
