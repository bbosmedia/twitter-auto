import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const publishQueue = new Queue("publish-post", { connection: redis });
export const schedulerQueue = new Queue("scheduler", { connection: redis });
export const retryQueue = new Queue("retry-failed-post", { connection: redis });
export const cleanupQueue = new Queue("cleanup-jobs", { connection: redis });

export async function enqueuePublish(postId: string) {
  return publishQueue.add(
    "publish",
    { postId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 200,
    }
  );
}
