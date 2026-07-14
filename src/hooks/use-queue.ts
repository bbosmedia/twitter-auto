"use client";

import { useQuery } from "@tanstack/react-query";

export function useQueue() {
  return useQuery({
    queryKey: ["queue"],
    queryFn: async () => {
      const response = await fetch("/api/queue");
      if (!response.ok) throw new Error("Failed to fetch queue");
      const data = await response.json();
      return data.data;
    },
  });
}
