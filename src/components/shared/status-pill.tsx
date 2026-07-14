import { Chip } from "@heroui/react";

const config: Record<
  string,
  { color: "default" | "accent" | "success" | "warning" | "danger"; label?: string }
> = {
  scheduled: { color: "warning" },
  published: { color: "success" },
  failed: { color: "danger" },
  draft: { color: "default" },
  publishing: { color: "accent" },
  pending: { color: "default" },
};

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const c = config[status] || { color: "default" as const };
  return (
    <Chip
      size="sm"
      color={c.color}
      variant="soft"
      className={className}
    >
      <Chip.Label className="capitalize">{c.label || status}</Chip.Label>
    </Chip>
  );
}
