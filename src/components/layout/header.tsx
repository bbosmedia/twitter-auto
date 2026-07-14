"use client";

import { LogOut, User, Settings, Menu } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar, Button, Separator } from "@heroui/react";
import { cn } from "@/utils/cn";

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/compose": "Compose",
  "/queue": "Queue",
  "/drafts": "Drafts",
  "/templates": "Templates",
  "/accounts": "Accounts",
  "/settings": "Settings",
  "/profile": "Profile",
};

const mobileNav = [
  { href: "/dashboard", label: "Home" },
  { href: "/compose", label: "Compose" },
  { href: "/queue", label: "Queue" },
  { href: "/accounts", label: "Accounts" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const title =
    titles[pathname] ||
    Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ||
    "Pulse";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-label="Menu"
          onPress={() => setMobileOpen((v) => !v)}
        >
          <Menu size={16} />
        </Button>
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="hidden text-xs text-muted sm:block">
            Multi-account X publishing
          </p>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <Button
          variant="secondary"
          className="h-auto gap-2 px-2 py-1.5"
          onPress={() => setShowMenu((v) => !v)}
        >
          <Avatar size="sm">
            {session?.user?.image ? (
              <Avatar.Image src={session.user.image} alt="" />
            ) : null}
            <Avatar.Fallback>
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar.Fallback>
          </Avatar>
          <div className="hidden text-left sm:block pr-1">
            <p className="text-xs font-medium leading-none">
              {session?.user?.name || "User"}
            </p>
            <p className="mt-1 text-[10px] text-muted leading-none">
              {session?.user?.email}
            </p>
          </div>
        </Button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
            <Button
              variant="ghost"
              fullWidth
              className="justify-start rounded-none"
              onPress={() => {
                router.push("/profile");
                setShowMenu(false);
              }}
            >
              <User size={15} /> Profile
            </Button>
            <Button
              variant="ghost"
              fullWidth
              className="justify-start rounded-none"
              onPress={() => {
                router.push("/settings");
                setShowMenu(false);
              }}
            >
              <Settings size={15} /> Settings
            </Button>
            <Separator />
            <Button
              variant="danger-soft"
              fullWidth
              className="justify-start rounded-none"
              onPress={handleSignOut}
            >
              <LogOut size={15} /> Sign out
            </Button>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-surface p-3 md:hidden">
          <div className="flex flex-col gap-1">
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  pathname === item.href
                    ? "bg-accent/15 text-accent"
                    : "text-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
