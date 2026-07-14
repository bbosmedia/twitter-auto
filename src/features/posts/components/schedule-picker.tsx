"use client";

import { useMemo } from "react";
import { Description, Input, Label, TextField } from "@heroui/react";

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function SchedulePicker({
  value,
  onChange,
  enabled,
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
  enabled: boolean;
}) {
  const min = useMemo(() => {
    const d = new Date(Date.now() + 2 * 60 * 1000);
    return toLocalInputValue(d);
  }, []);

  if (!enabled) return null;

  const localValue = value ? toLocalInputValue(new Date(value)) : "";

  return (
    <TextField
      fullWidth
      name="scheduledAt"
      type="datetime-local"
      value={localValue}
      onChange={(v) => {
        if (!v) {
          onChange(null);
          return;
        }
        onChange(new Date(v).toISOString());
      }}
      variant="secondary"
      className="form-field"
    >
      <Label>Schedule for</Label>
      <Input min={min} className="w-full" />
      <Description>
        Local timezone. Worker checks due posts every minute.
      </Description>
    </TextField>
  );
}
