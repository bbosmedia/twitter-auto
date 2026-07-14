"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import type { ComponentProps } from "react";

type ButtonProps = Omit<ComponentProps<typeof Button>, "onPress">;

export function LinkButton({
  href,
  children,
  ...props
}: ButtonProps & { href: string }) {
  const router = useRouter();
  return (
    <Button {...props} onPress={() => router.push(href)}>
      {children}
    </Button>
  );
}
