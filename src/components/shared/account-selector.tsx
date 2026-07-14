"use client";

import { Button } from "@heroui/react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface Account {
  id: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  isActive: boolean;
}

interface AccountSelectorProps {
  accounts: Account[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function AccountSelector({
  accounts,
  selected,
  onChange,
}: AccountSelectorProps) {
  const toggleAccount = (accountId: string) => {
    if (selected.includes(accountId)) {
      onChange(selected.filter((id) => id !== accountId));
    } else {
      onChange([...selected, accountId]);
    }
  };

  const selectAll = () => {
    if (selected.length === accounts.length) {
      onChange([]);
    } else {
      onChange(accounts.map((a) => a.id));
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-4 text-default-500">
        No connected accounts.{" "}
        <a href="/accounts" className="text-primary underline">
          Connect one
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Post to:</span>
        <Button size="sm" variant="ghost" onClick={selectAll}>
          {selected.length === accounts.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {accounts.map((account) => {
          const isSelected = selected.includes(account.id);
          return (
            <button
              key={account.id}
              type="button"
              onClick={() => !account.isActive || toggleAccount(account.id)}
              disabled={!account.isActive}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all",
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent border-default-300 hover:border-primary",
                !account.isActive && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-default-200 flex items-center justify-center text-xs font-medium">
                {account.username[0].toUpperCase()}
              </div>
              @{account.username}
              {isSelected && <Check size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
