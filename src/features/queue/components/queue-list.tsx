"use client";

import {
  Button,
  Card,
  EmptyState,
  Spinner,
  Chip,
} from "@heroui/react";
import {
  Clock,
  XCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useQueue } from "@/hooks/use-queue";
import { formatDateTime } from "@/utils/format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatusPill } from "@/components/shared/status-pill";
import { PostPreview } from "@/components/shared/post-preview";
import { useState } from "react";

export function QueueList() {
  const { data: posts, isLoading } = useQueue();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card className="card-premium">
        <Card.Content className="px-5 py-12">
          <EmptyState className="text-center text-sm text-muted">
            Queue is empty. Schedule a post from Compose to see it here.
          </EmptyState>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map(
        (post: {
          id: string;
          content: string;
          status: string;
          scheduledAt?: string | null;
          error?: string | null;
          postAccounts?: Array<{
            twitterAccount?: {
              id?: string;
              username?: string;
              displayName?: string | null;
              avatar?: string | null;
            } | null;
          }>;
        }) => {
          const primary = post.postAccounts?.[0]?.twitterAccount;
          const isOpen = expandedId === post.id;

          return (
            <div key={post.id} className="flex flex-col gap-2">
              <Card className="card-premium">
                <Card.Content className="flex flex-row items-start gap-3 p-4">
                  <div className="mt-0.5 shrink-0 text-muted">
                    {post.status === "scheduled" && (
                      <Clock size={18} className="text-warning" />
                    )}
                    {post.status === "publishing" && (
                      <RefreshCw
                        size={18}
                        className="animate-spin text-accent"
                      />
                    )}
                    {post.status === "failed" && (
                      <XCircle size={18} className="text-danger" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm leading-relaxed">
                      {post.content}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusPill status={post.status} />
                      {post.scheduledAt && (
                        <span className="text-xs text-muted">
                          {formatDateTime(post.scheduledAt)}
                        </span>
                      )}
                      {post.postAccounts?.map((pa, i) =>
                        pa.twitterAccount?.username ? (
                          <Chip key={i} size="sm" variant="soft">
                            @{pa.twitterAccount.username}
                          </Chip>
                        ) : null
                      )}
                    </div>
                    {post.error && (
                      <p className="mt-2 text-xs text-danger">{post.error}</p>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 h-auto px-0 text-xs font-medium text-accent"
                      onPress={() =>
                        setExpandedId(isOpen ? null : post.id)
                      }
                    >
                      {isOpen ? "Hide X preview" : "Show X preview"}
                    </Button>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {post.status === "failed" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        isPending={retryMutation.isPending}
                        onPress={() => retryMutation.mutate(post.id)}
                      >
                        <RefreshCw size={12} />
                        Retry
                      </Button>
                    )}
                    {post.status !== "publishing" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        isIconOnly
                        aria-label="Delete"
                        onPress={() => deleteMutation.mutate(post.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </Card.Content>
              </Card>

              {isOpen && (
                <PostPreview
                  compact
                  content={post.content}
                  scheduledAt={post.scheduledAt}
                  account={
                    primary?.username
                      ? {
                          id: primary.id || post.id,
                          username: primary.username,
                          displayName: primary.displayName,
                          avatar: primary.avatar,
                        }
                      : null
                  }
                  otherAccounts={(post.postAccounts || [])
                    .slice(1)
                    .map((pa) => pa.twitterAccount)
                    .filter(
                      (
                        a
                      ): a is {
                        id?: string;
                        username: string;
                        displayName?: string | null;
                        avatar?: string | null;
                      } => !!a?.username
                    )
                    .map((a) => ({
                      id: a.id || a.username,
                      username: a.username,
                      displayName: a.displayName,
                      avatar: a.avatar,
                    }))}
                />
              )}
            </div>
          );
        }
      )}
    </div>
  );
}
