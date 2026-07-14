import { Suspense } from "react";
import { AccountList } from "@/features/accounts/components/account-list";

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="card-premium h-40 animate-pulse" />}>
      <AccountList />
    </Suspense>
  );
}
