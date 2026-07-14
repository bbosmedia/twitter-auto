"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

export function LinkButton({
  href,
  children,
  onPress,
  ...props
}: ButtonProps & { href: string }) {
  const router = useRouter();
  return (
    <Button
      {...props}
      onPress={(e) => {
        onPress?.(e);
        router.push(href);
      }}
    >
      {children}
    </Button>
  );
}
