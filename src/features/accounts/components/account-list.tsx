"use client";

import { Card, CardContent, Button, Spinner } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AccountList() {
  const { data: accounts, isLoading } = useAccounts();
  const queryClient = useQueryClient();

  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/accounts", { method: "POST" });
      if (!response.ok) throw new Error("Failed to initiate connection");
      const data = await response.json();
      window.location.href = data.data.authUrl;
    },
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
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Connected Accounts</h2>
        <Button
          variant="primary"
          onClick={() => connectMutation.mutate()}
          isDisabled={connectMutation.isPending}
        >
          <Plus size={16} className="mr-1" />
          Connect X Account
        </Button>
      </div>

      {!accounts || accounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-default-500 mb-4">No connected accounts yet</p>
            <Button
              variant="primary"
              onClick={() => connectMutation.mutate()}
            >
              Connect Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account: any) => (
            <Card key={account.id}>
              <CardContent className="flex flex-row items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {account.username[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">@{account.username}</p>
                  {account.displayName && (
                    <p className="text-sm text-default-500">
                      {account.displayName}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    account.isActive
                      ? "bg-success/20 text-success"
                      : "bg-danger/20 text-danger"
                  }`}
                >
                  {account.isActive ? "Active" : "Inactive"}
                </span>
                <Button
                  size="sm"
                  variant="danger"
                  isIconOnly
                  onClick={() => disconnectMutation.mutate(account.id)}
                  isDisabled={disconnectMutation.isPending}
                >
                  <Trash2 size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
