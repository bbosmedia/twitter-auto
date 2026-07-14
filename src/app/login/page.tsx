"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader } from "@heroui/react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<"twitter" | "google" | null>(null);

  const handleTwitterLogin = async () => {
    setIsLoading("twitter");
    try {
      await signIn.social({
        provider: "twitter",
        callbackURL: "/dashboard",
      });
    } catch {
      setIsLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6 text-center">
          <div className="flex justify-center mb-4">
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 text-foreground"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">X Multi-Account Dashboard</h1>
          <p className="text-sm text-default-500">
            Sign in to manage your X accounts
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6 flex flex-col gap-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleTwitterLogin}
            isDisabled={isLoading !== null}
          >
            {isLoading === "twitter" ? (
              "Redirecting to X..."
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Sign in with X
              </>
            )}
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-default-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-default-500">or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            isDisabled={isLoading !== null}
          >
            {isLoading === "google" ? (
              "Redirecting to Google..."
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="none">
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
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
