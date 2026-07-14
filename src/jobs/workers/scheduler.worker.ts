import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { publishQueue } from "../queues";

export const schedulerWorker = new Worker(
  "scheduler",
  async () => {
    // Find posts that are scheduled and due
    const duePosts = await db.query.posts.findMany({
      where: and(
        eq(posts.status, "scheduled"),
        lte(posts.scheduledAt, new Date())
      ),
    });

    for (const post of duePosts) {
      // Add to publish queue with retry
      await publishQueue.add(
        "publish",
        { postId: post.id },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
        }
      );

      // Update status
      await db
        .update(posts)
        .set({ status: "publishing", updatedAt: new Date() })
        .where(eq(posts.id, post.id));
    }

    return { processed: duePosts.length };
  },
  {
    connection: redis,
  }
);

schedulerWorker.on("completed", (job) => {
  console.log(`Scheduler processed ${job.returnvalue?.processed} posts`);
});

schedulerWorker.on("failed", (job, err) => {
  console.error("Scheduler failed:", err.message);
});
