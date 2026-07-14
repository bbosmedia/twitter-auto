"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  Clock,
  AtSign,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compose", label: "Compose", icon: PenSquare },
  { href: "/queue", label: "Queue", icon: Clock },
  { href: "/accounts", label: "Accounts", icon: AtSign },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-default-200 bg-background flex flex-col">
      <div className="p-4 border-b border-default-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <AtSign className="text-primary" size={24} />
          <h1 className="text-xl font-bold">X Dashboard</h1>
        </Link>
      </div>
      <nav className="flex-1 p-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-default-600 hover:bg-default-100"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
