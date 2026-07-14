"use client";

import { useSession } from "@/hooks/use-session";
import { Avatar, Card, Chip, Spinner } from "@heroui/react";

export default function ProfilePage() {
  const { session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted">Your Pulse account details.</p>
      </div>

      <Card className="card-premium">
        <Card.Content className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {session?.user?.image ? (
                <Avatar.Image src={session.user.image} alt="" />
              ) : null}
              <Avatar.Fallback className="text-lg">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar.Fallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{session?.user?.name}</p>
              <p className="text-sm text-muted">{session?.user?.email}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background/40 p-3">
              <dt className="text-xs text-muted">User ID</dt>
              <dd className="mt-1 truncate font-mono text-xs">
                {session?.user?.id}
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-3">
              <dt className="text-xs text-muted">Email verified</dt>
              <dd className="mt-1">
                <Chip
                  size="sm"
                  color={session?.user?.emailVerified ? "success" : "warning"}
                  variant="soft"
                >
                  {session?.user?.emailVerified ? "Verified" : "Pending"}
                </Chip>
              </dd>
            </div>
          </dl>
        </Card.Content>
      </Card>
    </div>
  );
}
