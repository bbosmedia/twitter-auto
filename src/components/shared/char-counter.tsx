import { Chip } from "@heroui/react";

export function CharCounter({
  current,
  max = 280,
}: {
  current: number;
  max?: number;
}) {
  const remaining = max - current;
  const color =
    remaining < 0 ? "danger" : remaining <= 20 ? "warning" : "default";

  return (
    <Chip size="sm" color={color} variant="soft">
      <Chip.Label className="tabular-nums font-medium">
        {current}/{max}
      </Chip.Label>
    </Chip>
  );
}
