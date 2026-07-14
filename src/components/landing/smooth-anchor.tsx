"use client";

import type { ReactNode, MouseEvent } from "react";
import { cn } from "@/utils/cn";

/** Smooth-scroll in-page anchor with premium easing via native scroll-behavior + offset for sticky header. */
export function SmoothAnchor({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <a href={href} onClick={onClick} className={cn(className)}>
      {children}
    </a>
  );
}
