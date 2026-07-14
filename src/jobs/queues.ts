import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const publishQueue = new Queue("publish-post", { connection: redis });
export const retryQueue = new Queue("retry-failed-post", { connection: redis });
export const cleanupQueue = new Queue("cleanup-jobs", { connection: redis });
