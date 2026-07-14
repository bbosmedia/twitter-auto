import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { posts, postAccounts, twitterAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { publishTweet } from "@/services/twitter/publish";

export const publishWorker = new Worker(
  "publish-post",
  async (job) => {
    const { postId } = job.data;

    // Get the post
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    // Update post status to publishing
    await db.update(posts).set({ status: "publishing" }).where(eq(posts.id, postId));

    // Get all pending post_accounts
    const pendingAccounts = await db.query.postAccounts.findMany({
      where: eq(postAccounts.postId, postId),
    });

    let allPublished = true;
    let anyFailed = false;

    for (const pa of pendingAccounts) {
      // Get the twitter account to get the user_id
      const twitterAccount = await db.query.twitterAccounts.findFirst({
        where: eq(twitterAccounts.id, pa.twitterAccountId),
      });

      if (!twitterAccount) {
        await db
          .update(postAccounts)
          .set({ status: "failed", error: "Twitter account not found" })
          .where(eq(postAccounts.id, pa.id));
        anyFailed = true;
        allPublished = false;
        continue;
      }

      const result = await publishTweet(
        post.content,
        pa.twitterAccountId,
        twitterAccount.userId
      );

      if (result.success) {
        await db
          .update(postAccounts)
          .set({ status: "published", tweetId: result.tweetId })
          .where(eq(postAccounts.id, pa.id));
      } else {
        await db
          .update(postAccounts)
          .set({ status: "failed", error: result.error })
          .where(eq(postAccounts.id, pa.id));
        anyFailed = true;
        allPublished = false;
      }
    }

    // Update post status
    const finalStatus = allPublished ? "published" : anyFailed ? "failed" : "publishing";
    await db
      .update(posts)
      .set({
        status: finalStatus,
        publishedAt: allPublished ? new Date() : null,
        error: anyFailed ? "Some accounts failed to publish" : null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    return { postId, allPublished, anyFailed };
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

publishWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed for post ${job.data.postId}`);
});

publishWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});
