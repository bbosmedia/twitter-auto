import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import Link from "next/link";
import { AtSign } from "lucide-react";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-mesh px-4 py-12">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative z-10 flex w-full flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <AtSign size={16} className="text-accent" />
          Pulse
        </Link>
        <Suspense fallback={<div className="card-premium h-96 w-full max-w-md animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
