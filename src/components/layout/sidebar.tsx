"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  Clock,
  AtSign,
  FileText,
  LayoutTemplate,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/compose", label: "Compose", icon: PenSquare },
  { href: "/queue", label: "Queue", icon: Clock },
  { href: "/drafts", label: "Drafts", icon: FileText },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/accounts", label: "Accounts", icon: AtSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">Pulse</p>
          <p className="text-[10px] uppercase tracking-wider text-muted">
            X Scheduler
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:bg-surface-3 hover:text-foreground"
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <p className="text-xs font-semibold text-foreground">Full access</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            All features unlocked. No subscription tiers.
          </p>
        </div>
      </div>
    </aside>
  );
}
