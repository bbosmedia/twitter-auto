import IORedis from "ioredis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redis: any = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  }
);
