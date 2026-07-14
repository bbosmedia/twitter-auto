"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Separator,
  Spinner,
} from "@heroui/react";
import { signIn } from "@/lib/auth-client";
import { AtSign } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "twitter" | null>(
    null
  );

  const oauth = async (provider: "google" | "twitter") => {
    setOauthLoading(provider);
    setError(null);
    try {
      await signIn.social({ provider, callbackURL: next });
    } catch {
      setError(
        "Sign-in failed. Check Google / X OAuth credentials in your environment."
      );
      setOauthLoading(null);
    }
  };

  return (
    <Card className="card-premium w-full max-w-md">
      <Card.Header className="flex flex-col items-center gap-3 px-6 pt-8 text-center sm:px-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <AtSign size={22} />
        </div>
        <Card.Title className="text-2xl font-bold tracking-tight">
          Sign in to Pulse
        </Card.Title>
        <Card.Description>
          Continue with Google or X — no password needed
        </Card.Description>
      </Card.Header>

      <Card.Content className="flex flex-col gap-3 px-6 pb-8 pt-2 sm:px-8">
        {error && (
          <Alert status="danger">
            <Alert.Content>
              <Alert.Title>Sign-in failed</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <Button
          fullWidth
          size="lg"
          className="btn-glow"
          isDisabled={oauthLoading !== null}
          onPress={() => oauth("twitter")}
        >
          {oauthLoading === "twitter" ? (
            <Spinner size="sm" color="current" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          {oauthLoading === "twitter" ? "Redirecting…" : "Continue with X"}
        </Button>

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-xs text-muted">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          fullWidth
          size="lg"
          variant="secondary"
          isDisabled={oauthLoading !== null}
          onPress={() => oauth("google")}
        >
          {oauthLoading === "google" ? (
            <Spinner size="sm" color="current" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {oauthLoading === "google" ? "Redirecting…" : "Continue with Google"}
        </Button>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted">
          By continuing you agree to use Pulse for managing your X accounts.
          Connecting posting accounts is done separately after sign-in.
        </p>
      </Card.Content>
    </Card>
  );
}
