"use client";

import { useQuery } from "@tanstack/react-query";

export function usePosts(status?: string) {
  return useQuery({
    queryKey: ["posts", status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);

      const response = await fetch(`/api/posts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      return data.data;
    },
  });
}
