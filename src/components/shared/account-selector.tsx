"use client";

import {
  Avatar,
  Button,
  Description,
  EmptyState,
  FieldError,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { LinkButton } from "@/components/shared/link-button";

export type SelectableAccount = {
  id: string;
  username: string;
  displayName?: string | null;
  avatar?: string | null;
  isActive?: boolean;
};

export function AccountSelector({
  accounts,
  selected,
  onChange,
  isInvalid,
  errorMessage,
}: {
  accounts: SelectableAccount[];
  selected: string[];
  onChange: (ids: string[]) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}) {
  if (!accounts.length) {
    return (
      <EmptyState className="rounded-xl border border-dashed border-border bg-surface-secondary/40 px-4 py-6 text-center">
        <p className="text-sm text-muted">No active X accounts yet.</p>
        <LinkButton href="/accounts" size="sm" className="mt-3">
          Connect one
        </LinkButton>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Select
        fullWidth
        selectionMode="multiple"
        placeholder="Select accounts to publish"
        value={selected}
        onChange={(keys) => {
          const list = Array.isArray(keys) ? keys : keys != null ? [keys] : [];
          onChange(list.map(String));
        }}
        isInvalid={isInvalid}
        variant="secondary"
        className="form-field w-full"
      >
        <Label>Publish to</Label>
        <Select.Trigger>
          <Select.Value>
            {({ defaultChildren, isPlaceholder, state }) => {
              if (isPlaceholder || state.selectedItems.length === 0) {
                return defaultChildren;
              }
              if (state.selectedItems.length === 1) {
                const acc = accounts.find(
                  (a) => a.id === String(state.selectedItems[0]?.key)
                );
                return acc ? `@${acc.username}` : defaultChildren;
              }
              return `${state.selectedItems.length} accounts selected`;
            }}
          </Select.Value>
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox selectionMode="multiple">
            {accounts.map((account) => (
              <ListBox.Item
                key={account.id}
                id={account.id}
                textValue={`@${account.username} ${account.displayName || ""}`}
              >
                <Avatar size="sm">
                  {account.avatar ? (
                    <Avatar.Image src={account.avatar} alt="" />
                  ) : null}
                  <Avatar.Fallback>
                    {account.username[0]?.toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <Label>@{account.username}</Label>
                  {account.displayName ? (
                    <Description>{account.displayName}</Description>
                  ) : null}
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
        {isInvalid && errorMessage ? (
          <FieldError>{errorMessage}</FieldError>
        ) : (
          <Description>
            Post to one or many connected X profiles at once.
          </Description>
        )}
      </Select>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="ghost"
          onPress={() => onChange(accounts.map((a) => a.id))}
        >
          Select all
        </Button>
        <Button size="sm" variant="ghost" onPress={() => onChange([])}>
          Clear
        </Button>
      </div>
    </div>
  );
}
