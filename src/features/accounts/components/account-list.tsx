"use client";

import {
  Alert,
  Avatar,
  Button,
  Card,
  Chip,
  EmptyState,
  Spinner,
} from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AccountList() {
  const { data: accounts, isLoading } = useAccounts();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [banner, setBanner] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "connected") {
      setBanner({ type: "success", text: "X account connected successfully." });
    } else if (searchParams.get("error")) {
      setBanner({
        type: "danger",
        text: `Connection failed: ${searchParams.get("error")}`,
      });
    }
  }, [searchParams]);

  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/accounts", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start OAuth");
      window.location.href = data.data.authUrl;
    },
    onError: (err: Error) => setBanner({ type: "danger", text: err.message }),
  });

  const disconnectMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const response = await fetch(`/api/accounts?id=${accountId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to disconnect");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="mt-1 text-sm text-muted">
            Connect X profiles via OAuth 2.0 PKCE. Tokens encrypted at rest.
          </p>
        </div>
        <Button
          className="btn-glow"
          isPending={connectMutation.isPending}
          onPress={() => connectMutation.mutate()}
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner size="sm" color="current" /> : <Plus size={15} />}
              Connect X account
            </>
          )}
        </Button>
      </div>

      {banner && (
        <Alert status={banner.type}>
          <Alert.Content>
            <Alert.Description>{banner.text}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {!accounts || accounts.length === 0 ? (
        <Card className="card-premium">
          <Card.Content className="px-5 py-10">
            <EmptyState className="mx-auto max-w-sm text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Plus size={20} />
              </div>
              <p className="font-medium">No connected accounts</p>
              <p className="mt-2 text-sm text-muted">
                Connect an X account with tweet write scopes to start publishing.
              </p>
              <Button
                className="btn-glow mt-5"
                onPress={() => connectMutation.mutate()}
              >
                <Plus size={15} />
                Connect your first account
              </Button>
            </EmptyState>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {accounts.map(
            (account: {
              id: string;
              username: string;
              displayName?: string | null;
              avatar?: string | null;
              isActive: boolean;
            }) => (
              <Card key={account.id} className="card-premium">
                <Card.Content className="flex flex-row items-center gap-4 p-4">
                  <Avatar>
                    {account.avatar ? (
                      <Avatar.Image src={account.avatar} alt="" />
                    ) : null}
                    <Avatar.Fallback>
                      {account.username[0]?.toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">@{account.username}</p>
                    {account.displayName && (
                      <p className="truncate text-sm text-muted">
                        {account.displayName}
                      </p>
                    )}
                  </div>
                  <Chip color="success" variant="soft" size="sm">
                    Active
                  </Chip>
                  <Button
                    size="sm"
                    variant="danger-soft"
                    isIconOnly
                    aria-label="Disconnect"
                    isPending={disconnectMutation.isPending}
                    onPress={() => disconnectMutation.mutate(account.id)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </Card.Content>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}
