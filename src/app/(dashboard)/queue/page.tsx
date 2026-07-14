import { QueueList } from "@/features/queue/components/queue-list";

export default function QueuePage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Queue</h1>
        <p className="mt-1 text-sm text-muted">
          Scheduled, in-flight, and failed posts. Retry failures anytime.
        </p>
      </div>
      <QueueList />
    </div>
  );
}
