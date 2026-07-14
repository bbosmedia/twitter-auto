import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createLimiter(requests: number, window: `${number} s` | `${number} m`) {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return {
      limit: async () => ({
        success: true,
        remaining: requests,
        limit: requests,
        reset: Date.now() + 10_000,
      }),
    };
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
  });
}

export const ratelimit = createLimiter(10, "10 s");
export const authRatelimit = createLimiter(5, "10 m");
