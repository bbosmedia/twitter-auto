"use client";

import { usePathname, useRouter } from "next/navigation";
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
import { Button, Card, Chip } from "@heroui/react";
import { cn } from "@/lib/cn";

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
  const router = useRouter();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
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
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-accent/15 text-accent"
              )}
              onPress={() => router.push(item.href)}
            >
              <item.icon size={17} />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Card className="card-premium border border-border">
          <Card.Content className="gap-2 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">
                Full access
              </p>
              <Chip size="sm" color="success" variant="soft">
                Free
              </Chip>
            </div>
            <p className="text-[11px] leading-relaxed text-muted">
              All features unlocked. No subscription tiers.
            </p>
          </Card.Content>
        </Card>
      </div>
    </aside>
  );
}
