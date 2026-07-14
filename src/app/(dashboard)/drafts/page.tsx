"use client";

import { usePosts } from "@/hooks/use-posts";
import { formatDateTime } from "@/utils/format";
import { Trash2, PenSquare } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { StatusPill } from "@/components/shared/status-pill";
import { Card, EmptyState, Spinner, Button } from "@heroui/react";
import { LinkButton } from "@/components/shared/link-button";

export default function DraftsPage() {
  const { data: posts, isLoading } = usePosts("draft");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drafts</h1>
          <p className="mt-1 text-sm text-muted">
            Saved work — polish later, then schedule or publish.
          </p>
        </div>
        <LinkButton href="/compose" variant="secondary">
          <PenSquare size={14} />
          Compose
        </LinkButton>
      </div>

      <div className="flex flex-col gap-3">
        {(posts ?? []).map(
          (post: {
            id: string;
            content: string;
            createdAt: string;
            status: string;
          }) => (
            <Card key={post.id} className="card-premium">
              <Card.Content className="p-4">
                <p className="text-sm leading-relaxed">{post.content}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusPill status={post.status} />
                    <span className="text-xs text-muted">
                      {formatDateTime(post.createdAt)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    isIconOnly
                    aria-label="Delete draft"
                    onPress={() => deleteMutation.mutate(post.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )
        )}
        {(!posts || posts.length === 0) && (
          <Card className="card-premium">
            <Card.Content className="px-5 py-16">
              <EmptyState className="text-center text-sm text-muted">
                No drafts yet.
              </EmptyState>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
}
