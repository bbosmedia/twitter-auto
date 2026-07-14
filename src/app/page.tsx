import { Button } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-8 text-center px-4">
        <svg
          viewBox="0 0 24 24"
          className="w-16 h-16 text-foreground"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <h1 className="text-5xl font-bold">X Multi-Account Dashboard</h1>
        <p className="text-xl text-default-500 max-w-2xl">
          Manage multiple X (Twitter) accounts from a single dashboard.
          Schedule posts, track performance, and publish effortlessly.
        </p>
        <Link href="/login">
          <Button variant="primary" size="lg">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-2"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Sign in with X
          </Button>
        </Link>
      </div>
    </div>
  );
}
