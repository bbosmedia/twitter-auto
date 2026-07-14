import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { posts, postAccounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { updatePostSchema } from "@/features/posts/schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, id), eq(posts.userId, session.user.id)),
      with: {
        postAccounts: {
          with: { twitterAccount: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.query.posts.findFirst({
      where: and(eq(posts.id, id), eq(posts.userId, session.user.id)),
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!["draft", "scheduled", "failed"].includes(existing.status)) {
      return NextResponse.json(
        { error: "Only draft, scheduled, or failed posts can be edited" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = updatePostSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { content, scheduledAt } = validated.data;

    const [updated] = await db
      .update(posts)
      .set({
        ...(content !== undefined ? { content } : {}),
        ...(scheduledAt !== undefined
          ? {
              scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
              status: scheduledAt ? "scheduled" : existing.status,
            }
          : {}),
        error: null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.query.posts.findFirst({
      where: and(eq(posts.id, id), eq(posts.userId, session.user.id)),
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.status === "publishing") {
      return NextResponse.json(
        { error: "Cannot delete a post that is currently publishing" },
        { status: 400 }
      );
    }

    await db.delete(postAccounts).where(eq(postAccounts.postId, id));
    await db.delete(posts).where(eq(posts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
