"use client";

import { useQuery } from "@tanstack/react-query";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch("/api/accounts");
      if (!response.ok) throw new Error("Failed to fetch accounts");
      const data = await response.json();
      return data.data;
    },
  });
}
