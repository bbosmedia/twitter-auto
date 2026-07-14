"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";

export function useSession() {
  const { data: session, isPending, error } = useBetterAuthSession();
  return { session, isPending, error, isAuthenticated: !!session };
}
