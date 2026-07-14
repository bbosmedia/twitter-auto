"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Animation variant */
  variant?: "up" | "fade" | "scale" | "left" | "right";
  /** Once only (default true) */
  once?: boolean;
};

const variants: Record<
  NonNullable<RevealProps["variant"]>,
  { hidden: string; shown: string }
> = {
  up: {
    hidden: "translate-y-8 opacity-0",
    shown: "translate-y-0 opacity-100",
  },
  fade: {
    hidden: "opacity-0",
    shown: "opacity-100",
  },
  scale: {
    hidden: "scale-[0.96] opacity-0",
    shown: "scale-100 opacity-100",
  },
  left: {
    hidden: "-translate-x-6 opacity-0",
    shown: "translate-x-0 opacity-100",
  },
  right: {
    hidden: "translate-x-6 opacity-0",
    shown: "translate-x-0 opacity-100",
  },
};

/**
 * IntersectionObserver reveal — premium ease-out motion when scrolled into view.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Prefer reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const v = variants[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? v.shown : v.hidden,
        className
      )}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
