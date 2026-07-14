"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export type FaqItem = {
  q: string;
  a: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden rounded-2xl border bg-slate-50/50 transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isOpen
                ? "border-sky-200/80 bg-white shadow-[0_12px_40px_-20px_rgba(37,99,235,0.35)]"
                : "border-slate-200 hover:border-slate-300 hover:bg-white/80"
            )}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-slate-900 md:text-[15px]">
                {item.q}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isOpen && "rotate-180 border-sky-200 bg-sky-50 text-sky-600"
                )}
              >
                <ChevronDown size={16} />
              </span>
            </button>

            {/* Smooth height: grid-template-rows 0fr → 1fr */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
              style={{
                transitionDuration: "420ms",
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={cn(
                    "px-5 pb-5 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen
                      ? "translate-y-0 opacity-100 delay-75"
                      : "-translate-y-1 opacity-0"
                  )}
                  style={{ transitionDuration: "380ms" }}
                >
                  <p className="border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-500">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
