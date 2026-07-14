"use client";

interface CharCounterProps {
  current: number;
  max: number;
}

export function CharCounter({ current, max }: CharCounterProps) {
  const remaining = max - current;
  const isOver = remaining < 0;
  const isWarning = remaining <= 20 && remaining > 0;

  return (
    <span
      className={`text-sm px-2 py-0.5 rounded-full ${
        isOver
          ? "bg-danger/20 text-danger"
          : isWarning
            ? "bg-warning/20 text-warning"
            : "bg-default-200 text-default-600"
      }`}
    >
      {remaining} remaining
    </span>
  );
}
