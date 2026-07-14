"use client";

import { formatTweetText } from "@/utils/tweet-format";
import { format } from "date-fns";
import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  BarChart3,
  MoreHorizontal,
  CalendarClock,
} from "lucide-react";
import { Avatar, Button, Chip } from "@heroui/react";
import { cn } from "@/lib/cn";

export type PreviewAccount = {
  id: string;
  username: string;
  displayName?: string | null;
  avatar?: string | null;
};

type PostPreviewProps = {
  content: string;
  account?: PreviewAccount | null;
  scheduledAt?: string | null;
  otherAccounts?: PreviewAccount[];
  className?: string;
  compact?: boolean;
};

function AccountAvatar({
  account,
  size = "md",
}: {
  account?: PreviewAccount | null;
  size?: "sm" | "md";
}) {
  return (
    <Avatar size={size === "sm" ? "sm" : "md"} className="shrink-0">
      {account?.avatar ? <Avatar.Image src={account.avatar} alt="" /> : null}
      <Avatar.Fallback>
        {(
          account?.displayName?.[0] ||
          account?.username?.[0] ||
          "X"
        ).toUpperCase()}
      </Avatar.Fallback>
    </Avatar>
  );
}

function Action({
  icon: Icon,
  hover,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  hover: string;
}) {
  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      className={cn("pointer-events-none text-muted", hover)}
      aria-hidden
    >
      <Icon size={17} />
    </Button>
  );
}

/**
 * Realistic X.com post card preview — uses HeroUI Avatar / Chip / Button.
 */
export function PostPreview({
  content,
  account,
  scheduledAt,
  otherAccounts = [],
  className,
  compact = false,
}: PostPreviewProps) {
  const name = account?.displayName || account?.username || "Your account";
  const handle = account?.username || "username";
  const when = scheduledAt
    ? format(new Date(scheduledAt), "MMM d")
    : format(new Date(), "MMM d");
  const body = content.trim() || "What's happening?";
  const isPlaceholder = !content.trim();

  return (
    <article
      className={cn(
        "x-post-card w-full overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide text-muted">
            Post preview
          </span>
        </div>
        {scheduledAt ? (
          <Chip size="sm" color="accent" variant="soft">
            <CalendarClock size={12} />
            <Chip.Label>
              {format(new Date(scheduledAt), "MMM d · h:mm a")}
            </Chip.Label>
          </Chip>
        ) : (
          <Chip size="sm" variant="soft">
            Live
          </Chip>
        )}
      </div>

      <div className={cn("flex gap-3 px-4", compact ? "py-3" : "py-3.5")}>
        <div className="shrink-0 pt-0.5">
          <AccountAvatar account={account} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-[15px] leading-5">
              <span className="truncate font-bold text-foreground hover:underline">
                {name}
              </span>
              <BadgeCheck
                size={16}
                className="shrink-0 fill-sky-500 text-white"
                aria-label="Verified"
              />
              <span className="truncate text-muted">@{handle}</span>
              <span className="text-muted">·</span>
              <span className="shrink-0 text-muted hover:underline">{when}</span>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="pointer-events-none text-muted"
              aria-hidden
            >
              <MoreHorizontal size={16} />
            </Button>
          </div>

          <div
            className={cn(
              "mt-0.5 whitespace-pre-wrap break-words text-[15px] leading-5",
              isPlaceholder ? "text-muted" : "text-foreground"
            )}
          >
            {isPlaceholder ? body : formatTweetText(content)}
          </div>

          {otherAccounts.length > 0 && (
            <div className="mt-3 rounded-xl border border-border bg-surface-secondary px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Also posting as
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {otherAccounts.map((a) => (
                  <Chip key={a.id} size="sm" variant="secondary">
                    <AccountAvatar account={a} size="sm" />
                    <Chip.Label>@{a.username}</Chip.Label>
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <div
            className={cn(
              "mt-2 flex max-w-md items-center justify-between",
              compact && "mt-1"
            )}
          >
            <Action icon={MessageCircle} hover="hover:text-sky-500" />
            <Action icon={Repeat2} hover="hover:text-emerald-500" />
            <Action icon={Heart} hover="hover:text-pink-500" />
            <Action icon={BarChart3} hover="hover:text-sky-500" />
            <div className="flex items-center">
              <Action icon={Bookmark} hover="hover:text-sky-500" />
              <Action icon={Share} hover="hover:text-sky-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-surface-secondary/80 px-4 py-2 text-[11px] text-muted">
        <span>
          {account
            ? `Publishing as @${account.username}`
            : "Select an account to preview"}
        </span>
        <span className="tabular-nums">
          {content.length}
          <span className="opacity-60">/280</span>
        </span>
      </div>
    </article>
  );
}

export function MultiAccountPostPreview({
  content,
  accounts,
  scheduledAt,
  activeId,
  onSelectAccount,
}: {
  content: string;
  accounts: PreviewAccount[];
  scheduledAt?: string | null;
  activeId?: string | null;
  onSelectAccount?: (id: string) => void;
}) {
  if (accounts.length === 0) {
    return (
      <PostPreview content={content} account={null} scheduledAt={scheduledAt} />
    );
  }

  const active = accounts.find((a) => a.id === activeId) || accounts[0];
  const others = accounts.filter((a) => a.id !== active.id);

  return (
    <div className="flex flex-col gap-3">
      {accounts.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {accounts.map((a) => {
            const isOn = a.id === active.id;
            return (
              <Button
                key={a.id}
                size="sm"
                variant={isOn ? "secondary" : "ghost"}
                className={cn(
                  "gap-1.5 rounded-full",
                  isOn && "border border-accent/40 bg-accent/10 text-accent"
                )}
                onPress={() => onSelectAccount?.(a.id)}
              >
                <AccountAvatar account={a} size="sm" />
                @{a.username}
              </Button>
            );
          })}
        </div>
      )}

      <PostPreview
        content={content}
        account={active}
        scheduledAt={scheduledAt}
        otherAccounts={others}
      />
    </div>
  );
}
