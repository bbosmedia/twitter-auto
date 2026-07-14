import type { ConnectionOptions } from "bullmq";

export function getRedisConnection(): ConnectionOptions {
  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  return {
    url,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  } as ConnectionOptions;
}

/** Shared connection options for BullMQ queues/workers */
export const redis = getRedisConnection();

export async function ensureRedis() {
  // Lazy IORedis only for PKCE helpers (optional)
  const IORedis = (await import("ioredis")).default;
  const client = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });
  try {
    if (client.status === "wait") await client.connect();
  } catch {
    // optional
  }
  return client;
}
