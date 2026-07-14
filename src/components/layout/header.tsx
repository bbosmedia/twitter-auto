"use client";

import { LogOut, User, Settings, Menu } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  Separator,
} from "@heroui/react";
import { cn } from "@/lib/cn";
import { LinkButton } from "@/components/shared/link-button";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const title =
    titles[pathname] ||
    Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ||
    "Pulse";

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

      <Dropdown>
        <Button variant="secondary" className="h-auto gap-2 px-2 py-1.5">
          <Avatar size="sm">
            {session?.user?.image ? (
              <Avatar.Image src={session.user.image} alt="" />
            ) : null}
            <Avatar.Fallback>
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar.Fallback>
          </Avatar>
          <div className="hidden pr-1 text-left sm:block">
            <p className="text-xs font-medium leading-none">
              {session?.user?.name || "User"}
            </p>
            <p className="mt-1 text-[10px] leading-none text-muted">
              {session?.user?.email}
            </p>
          </div>
        </Button>
        <Dropdown.Popover placement="bottom end" className="min-w-48">
          <Dropdown.Menu
            onAction={(key) => {
              if (key === "profile") router.push("/profile");
              if (key === "settings") router.push("/settings");
              if (key === "logout") void handleSignOut();
            }}
          >
            <Dropdown.Item id="profile" textValue="Profile">
              <User size={15} />
              <Label>Profile</Label>
            </Dropdown.Item>
            <Dropdown.Item id="settings" textValue="Settings">
              <Settings size={15} />
              <Label>Settings</Label>
            </Dropdown.Item>
            <Separator />
            <Dropdown.Item id="logout" textValue="Sign out" variant="danger">
              <LogOut size={15} />
              <Label>Sign out</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-surface p-3 md:hidden">
          <div className="flex flex-col gap-1">
            {mobileNav.map((item) => (
              <LinkButton
                key={item.href}
                href={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "text-accent"
                )}
                onPress={() => setMobileOpen(false)}
              >
                {item.label}
              </LinkButton>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
