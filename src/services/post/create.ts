import { db } from "@/lib/db";
import { posts, postAccounts, auditLogs, twitterAccounts } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { publishQueue } from "@/jobs/queues";

export type CreatePostInput = {
  userId: string;
  content: string;
  accountIds: string[];
  scheduledAt?: string | null;
  mode?: "draft" | "schedule" | "now";
};

export async function createPost(input: CreatePostInput) {
  const { userId, content, accountIds, scheduledAt, mode } = input;

  const owned = await db.query.twitterAccounts.findMany({
    where: and(
      eq(twitterAccounts.userId, userId),
      eq(twitterAccounts.isActive, true),
      inArray(twitterAccounts.id, accountIds)
    ),
  });

  if (owned.length !== accountIds.length) {
    throw new Error("One or more accounts are invalid or inactive");
  }

  let status: "draft" | "scheduled" | "publishing" = "draft";
  if (mode === "now") status = "publishing";
  else if (mode === "schedule" || scheduledAt) status = "scheduled";
  else if (mode === "draft") status = "draft";

  if (status === "scheduled" && !scheduledAt) {
    throw new Error("scheduledAt is required when scheduling");
  }

  if (status === "scheduled" && scheduledAt) {
    const when = new Date(scheduledAt);
    if (when.getTime() <= Date.now() + 30_000) {
      throw new Error("Schedule time must be at least 30 seconds in the future");
    }
  }

  const [newPost] = await db
    .insert(posts)
    .values({
      userId,
      content,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    })
    .returning();

  await db.insert(postAccounts).values(
    accountIds.map((accountId) => ({
      postId: newPost.id,
      twitterAccountId: accountId,
      status: "pending" as const,
    }))
  );

  await db.insert(auditLogs).values({
    userId,
    action: `post.${status === "publishing" ? "publish_queued" : status}`,
    metadata: { postId: newPost.id, accountIds },
  });

  if (status === "publishing") {
    await publishQueue.add(
      "publish",
      { postId: newPost.id },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      }
    );
  }

  return newPost;
}
