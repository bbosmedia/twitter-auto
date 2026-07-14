"use client";

import { PostComposer } from "@/features/posts/components/post-composer";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ComposeInner() {
  const params = useSearchParams();
  const content = params.get("content") || "";
  return <PostComposer initialContent={content} />;
}

export default function ComposePage() {
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-premium h-96 animate-pulse" />
            <div className="card-premium h-64 animate-pulse" />
          </div>
        }
      >
        <ComposeInner />
      </Suspense>
    </div>
  );
}
