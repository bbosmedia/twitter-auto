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
import { cn } from "@/utils/cn";

export type PreviewAccount = {
  id: string;
  username: string;
  displayName?: string | null;
  avatar?: string | null;
};

type PostPreviewProps = {
  content: string;
  account?: PreviewAccount | null;
  /** When scheduled, show scheduled time in the preview meta */
  scheduledAt?: string | null;
  /** Extra accounts this will also publish to */
  otherAccounts?: PreviewAccount[];
  className?: string;
  /** Compact density for lists */
  compact?: boolean;
};

function Avatar({
  account,
  size = 40,
}: {
  account?: PreviewAccount | null;
  size?: number;
}) {
  const initial =
    account?.displayName?.[0] || account?.username?.[0] || "X";

  if (account?.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={account.avatar}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover bg-slate-100"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white"
      style={{ width: size, height: size }}
    >
      {initial.toUpperCase()}
    </div>
  );
}

function Action({
  icon: Icon,
  label,
  hover,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label?: string;
  hover: string;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        "group flex items-center gap-1 rounded-full text-slate-500 transition-colors",
        hover
      )}
      aria-hidden
    >
      <span className="rounded-full p-1.5 transition-colors group-hover:bg-current/10">
        <Icon size={17} className="text-inherit" />
      </span>
      {label ? (
        <span className="text-[13px] tabular-nums text-inherit">{label}</span>
      ) : null}
    </button>
  );
}

/**
 * Realistic X.com post card preview — matches timeline post anatomy.
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
        "x-post-card w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm",
        className
      )}
    >
      {/* Chrome bar — like X app chrome */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide text-slate-600">
            Post preview
          </span>
        </div>
        {scheduledAt ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
            <CalendarClock size={12} />
            {format(new Date(scheduledAt), "MMM d · h:mm a")}
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">Live</span>
        )}
      </div>

      {/* Post body — X timeline layout */}
      <div className={cn("flex gap-3 px-4", compact ? "py-3" : "py-3.5")}>
        <div className="shrink-0 pt-0.5">
          <Avatar account={account} size={compact ? 36 : 40} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[15px] leading-5">
              <span className="truncate font-bold text-slate-900 hover:underline">
                {name}
              </span>
              <BadgeCheck
                size={16}
                className="shrink-0 fill-sky-500 text-white"
                aria-label="Verified"
              />
              <span className="truncate text-slate-500">@{handle}</span>
              <span className="text-slate-500">·</span>
              <span className="shrink-0 text-slate-500 hover:underline">
                {when}
              </span>
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="rounded-full p-1 text-slate-400 hover:bg-sky-50 hover:text-sky-500"
              aria-hidden
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Tweet text */}
          <div
            className={cn(
              "mt-0.5 whitespace-pre-wrap break-words text-[15px] leading-5",
              isPlaceholder ? "text-slate-400" : "text-slate-900"
            )}
          >
            {isPlaceholder ? body : formatTweetText(content)}
          </div>

          {/* Multi-account ribbon */}
          {otherAccounts.length > 0 && (
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Also posting as
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {otherAccounts.map((a) => (
                  <div
                    key={a.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
                  >
                    <Avatar account={a} size={16} />
                    <span>@{a.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement row — mirrors X icons */}
          <div
            className={cn(
              "mt-3 flex max-w-md items-center justify-between text-slate-500",
              compact && "mt-2"
            )}
          >
            <Action
              icon={MessageCircle}
              label=""
              hover="hover:text-sky-500"
            />
            <Action icon={Repeat2} label="" hover="hover:text-emerald-500" />
            <Action icon={Heart} label="" hover="hover:text-pink-500" />
            <Action icon={BarChart3} label="" hover="hover:text-sky-500" />
            <div className="flex items-center gap-0.5">
              <Action icon={Bookmark} hover="hover:text-sky-500" />
              <Action icon={Share} hover="hover:text-sky-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer status like X compose */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2 text-[11px] text-slate-500">
        <span>
          {account
            ? `Publishing as @${account.username}`
            : "Select an account to preview"}
        </span>
        <span className="tabular-nums">
          {content.length}
          <span className="text-slate-400">/280</span>
        </span>
      </div>
    </article>
  );
}

/**
 * Stack of previews for each selected account (realistic multi-post).
 */
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

  const active =
    accounts.find((a) => a.id === activeId) || accounts[0];
  const others = accounts.filter((a) => a.id !== active.id);

  return (
    <div className="flex flex-col gap-3">
      {accounts.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {accounts.map((a) => {
            const isOn = a.id === active.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onSelectAccount?.(a.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                  isOn
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                <Avatar account={a} size={16} />
                @{a.username}
              </button>
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
