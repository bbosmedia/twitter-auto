"use client";

import { Card, CardContent, Spinner } from "@heroui/react";
import { PenSquare, Clock, FileText, AtSign } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useAccounts } from "@/hooks/use-accounts";

export default function DashboardPage() {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  const scheduledPosts =
    posts?.filter((p: any) => p.status === "scheduled") || [];
  const publishedPosts =
    posts?.filter((p: any) => p.status === "published") || [];

  const stats = [
    {
      title: "Total Posts",
      value: posts?.length || 0,
      icon: PenSquare,
      color: "text-primary",
    },
    {
      title: "Scheduled",
      value: scheduledPosts.length,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Published",
      value: publishedPosts.length,
      icon: FileText,
      color: "text-success",
    },
    {
      title: "Accounts",
      value: accounts?.length || 0,
      icon: AtSign,
      color: "text-secondary",
    },
  ];

  if (postsLoading || accountsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex flex-row items-center gap-4">
              <stat.icon size={24} className={stat.color} />
              <div>
                <p className="text-sm text-default-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
          </div>
          <CardContent>
            {posts?.slice(0, 5).map((post: any) => (
              <div
                key={post.id}
                className="py-2 border-b border-default-200 last:border-0"
              >
                <p className="truncate">{post.content}</p>
                <p className="text-sm text-default-500">{post.status}</p>
              </div>
            )) || (
              <p className="text-default-500 text-center py-4">No posts yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold">Connected Accounts</h2>
          </div>
          <CardContent>
            {accounts?.map((account: any) => (
              <div
                key={account.id}
                className="py-2 border-b border-default-200 last:border-0 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {account.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">@{account.username}</p>
                  {account.displayName && (
                    <p className="text-sm text-default-500">
                      {account.displayName}
                    </p>
                  )}
                </div>
              </div>
            )) || (
              <p className="text-default-500 text-center py-4">
                No connected accounts
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
