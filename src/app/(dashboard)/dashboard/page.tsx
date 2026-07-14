"use client";

import Link from "next/link";
import {
  PenSquare,
  Clock,
  CheckCircle2,
  AtSign,
  ArrowRight,
} from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useAccounts } from "@/hooks/use-accounts";
import { formatDateTime } from "@/utils/format";
import { StatusPill } from "@/components/shared/status-pill";
import {
  Alert,
  Avatar,
  Card,
  Spinner,
} from "@heroui/react";
import { LinkButton } from "@/components/shared/link-button";

export default function DashboardPage() {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  const list = posts ?? [];
  const scheduled = list.filter((p: { status: string }) => p.status === "scheduled");
  const published = list.filter((p: { status: string }) => p.status === "published");
  const failed = list.filter((p: { status: string }) => p.status === "failed");

  const stats = [
    {
      title: "Total posts",
      value: list.length,
      icon: PenSquare,
      tone: "text-accent bg-accent/15",
    },
    {
      title: "Scheduled",
      value: scheduled.length,
      icon: Clock,
      tone: "text-warning bg-warning/15",
    },
    {
      title: "Published",
      value: published.length,
      icon: CheckCircle2,
      tone: "text-success bg-success/15",
    },
    {
      title: "Accounts",
      value: accounts?.length || 0,
      icon: AtSign,
      tone: "text-violet-400 bg-violet-500/15",
    },
  ];

  if (postsLoading || accountsLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted">
            Your publishing pulse across all connected X accounts.
          </p>
        </div>
        <LinkButton href="/compose" className="btn-glow">
          <PenSquare size={15} />
          New post
        </LinkButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-premium">
            <Card.Content className="flex flex-row items-center gap-3 p-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}
              >
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-muted">{stat.title}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {failed.length > 0 && (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Title>
              {failed.length} post{failed.length > 1 ? "s" : ""} failed
            </Alert.Title>
            <Alert.Description>
              <Link href="/queue" className="font-semibold underline">
                Review in queue
              </Link>
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-premium">
          <Card.Header className="flex flex-row items-center justify-between px-5 pt-5 pb-1">
            <Card.Title>Recent posts</Card.Title>
            <LinkButton href="/queue" size="sm" variant="ghost">
              View all <ArrowRight size={12} />
            </LinkButton>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3 px-5 pb-5">
            {list.slice(0, 6).map(
              (post: {
                id: string;
                content: string;
                status: string;
                createdAt: string;
              }) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-border bg-background/40 p-3"
                >
                  <p className="line-clamp-2 text-sm leading-relaxed">
                    {post.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <StatusPill status={post.status} />
                    <span className="text-[11px] text-muted">
                      {formatDateTime(post.createdAt)}
                    </span>
                  </div>
                </div>
              )
            )}
            {list.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">
                No posts yet.{" "}
                <Link href="/compose" className="text-accent hover:underline">
                  Compose your first
                </Link>
              </p>
            )}
          </Card.Content>
        </Card>

        <Card className="card-premium">
          <Card.Header className="flex flex-row items-center justify-between px-5 pt-5 pb-1">
            <Card.Title>Connected accounts</Card.Title>
            <LinkButton href="/accounts" size="sm" variant="ghost">
              Manage <ArrowRight size={12} />
            </LinkButton>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3 px-5 pb-5">
            {(accounts ?? []).map(
              (account: {
                id: string;
                username: string;
                displayName?: string | null;
                avatar?: string | null;
              }) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
                >
                  <Avatar size="sm">
                    {account.avatar ? (
                      <Avatar.Image src={account.avatar} alt="" />
                    ) : null}
                    <Avatar.Fallback>
                      {account.username[0]?.toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">@{account.username}</p>
                    {account.displayName && (
                      <p className="truncate text-xs text-muted">
                        {account.displayName}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
            {(!accounts || accounts.length === 0) && (
              <p className="py-8 text-center text-sm text-muted">
                No accounts connected.{" "}
                <Link href="/accounts" className="text-accent hover:underline">
                  Connect X
                </Link>
              </p>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
