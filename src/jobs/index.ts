import "./workers/publish-post.worker";
import "./workers/scheduler.worker";
import { schedulerQueue } from "./queues";

async function bootstrap() {
  // Poll for due scheduled posts every minute
  await schedulerQueue.add(
    "tick",
    {},
    {
      repeat: { every: 60_000 },
      removeOnComplete: true,
      removeOnFail: 50,
    }
  );

  console.log("[workers] Publish + scheduler workers running (tick every 60s)");
}

bootstrap().catch((err) => {
  console.error("[workers] bootstrap failed", err);
  process.exit(1);
});
