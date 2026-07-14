"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardHeader } from "@heroui/react";
import { postSchema } from "../schemas";
import { AccountSelector } from "@/components/shared/account-selector";
import { CharCounter } from "@/components/shared/char-counter";
import { useAccounts } from "@/hooks/use-accounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

export function PostComposer() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const { data: accounts } = useAccounts();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { content: "", accountIds: [] },
  });

  const content = watch("content") || "";

  const createPost = useMutation({
    mutationFn: async (data: z.infer<typeof postSchema>) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          accountIds: selectedAccounts,
        }),
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
      setSelectedAccounts([]);
    },
  });

  const onSubmit = (data: z.infer<typeof postSchema>) => {
    createPost.mutate({
      ...data,
      accountIds: selectedAccounts,
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <h2 className="text-xl font-bold">Compose Post</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <textarea
              placeholder="What's happening?"
              rows={4}
              maxLength={300}
              className="w-full px-3 py-2 border border-default-300 rounded-md bg-background text-foreground resize-none"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-danger text-xs mt-1">
                {errors.content.message}
              </p>
            )}
            <div className="flex justify-end mt-2">
              <CharCounter current={content.length} max={280} />
            </div>
          </div>

          <AccountSelector
            accounts={accounts || []}
            selected={selectedAccounts}
            onChange={setSelectedAccounts}
          />
          {errors.accountIds && (
            <p className="text-danger text-sm">{errors.accountIds.message}</p>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => reset()}>
              Clear
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={createPost.isPending}
            >
              {createPost.isPending ? "Posting..." : "Post Now"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
