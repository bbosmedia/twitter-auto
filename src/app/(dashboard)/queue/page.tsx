import { QueueList } from "@/features/queue/components/queue-list";

export default function QueuePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Queue</h1>
      <QueueList />
    </div>
  );
}
