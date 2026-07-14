"use client";

import { LogOut, User, Settings } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const { session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-default-200 bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">X Multi-Account Dashboard</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-default-100"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-default-200 rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                router.push("/profile");
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-default-100"
            >
              <User size={16} />
              Profile
            </button>
            <button
              onClick={() => {
                router.push("/settings");
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-default-100"
            >
              <Settings size={16} />
              Settings
            </button>
            <hr className="border-default-200" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-danger/10"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
