"use client";

import { Card, CardContent, Button, Spinner } from "@heroui/react";
import { Clock, XCircle, RefreshCw } from "lucide-react";
import { useQueue } from "@/hooks/use-queue";
import { formatDateTime } from "@/utils/format";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function QueueList() {
  const { data: posts, isLoading } = useQueue();
  const queryClient = useQueryClient();

  const retryMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) throw new Error("Failed to retry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-default-500">No posts in queue</div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post: any) => (
        <Card key={post.id}>
          <CardContent className="flex flex-row items-center gap-4">
            {post.status === "scheduled" && (
              <Clock size={20} className="text-warning" />
            )}
            {post.status === "publishing" && (
              <RefreshCw size={20} className="text-primary animate-spin" />
            )}
            {post.status === "failed" && (
              <XCircle size={20} className="text-danger" />
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate">{post.content}</p>
              {post.scheduledAt && (
                <p className="text-sm text-default-500">
                  {formatDateTime(post.scheduledAt)}
                </p>
              )}
              {post.error && (
                <p className="text-sm text-danger">{post.error}</p>
              )}
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                post.status === "scheduled"
                  ? "bg-warning/20 text-warning"
                  : post.status === "failed"
                    ? "bg-danger/20 text-danger"
                    : "bg-primary/20 text-primary"
              }`}
            >
              {post.status}
            </span>
            {post.status === "failed" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => retryMutation.mutate(post.id)}
                isDisabled={retryMutation.isPending}
              >
                <RefreshCw size={14} className="mr-1" />
                Retry
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
