"use client";

import { Accordion } from "@heroui/react";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
  q: string;
  a: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion
      className="w-full"
      variant="surface"
      defaultExpandedKeys={items[0] ? ["0"] : []}
    >
      {items.map((item, index) => (
        <Accordion.Item key={item.q} id={String(index)} className="mb-3 overflow-hidden rounded-2xl border border-border bg-surface last:mb-0">
          <Accordion.Heading>
            <Accordion.Trigger className="px-5 py-4 text-left text-sm font-semibold text-foreground md:text-[15px]">
              {item.q}
              <Accordion.Indicator className="text-muted">
                <ChevronDown size={16} />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="px-5 pb-5 text-sm leading-relaxed text-muted">
              {item.a}
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
