import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { enqueuePublish } from "../queues";

export const schedulerWorker = new Worker(
  "scheduler",
  async () => {
    const duePosts = await db.query.posts.findMany({
      where: and(
        eq(posts.status, "scheduled"),
        lte(posts.scheduledAt, new Date())
      ),
    });

    for (const post of duePosts) {
      await db
        .update(posts)
        .set({ status: "publishing", updatedAt: new Date() })
        .where(eq(posts.id, post.id));

      await enqueuePublish(post.id);
    }

    return { processed: duePosts.length };
  },
  {
    connection: redis,
  }
);

schedulerWorker.on("completed", (job) => {
  const n = job.returnvalue?.processed ?? 0;
  if (n > 0) console.log(`[scheduler] enqueued ${n} due posts`);
});

schedulerWorker.on("failed", (_job, err) => {
  console.error("[scheduler] failed:", err.message);
});
