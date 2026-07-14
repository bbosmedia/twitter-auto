import { format, addMinutes, isAfter, isBefore, parseISO } from "date-fns";

export function toUTC(date: Date): Date {
  return new Date(date.toISOString());
}

export function fromLocalToUTC(localDate: string, localTime: string): Date {
  const [year, month, day] = localDate.split("-").map(Number);
  const [hours, minutes] = localTime.split(":").map(Number);
  const local = new Date(year, month - 1, day, hours, minutes);
  return toUTC(local);
}

export function isScheduledTimeValid(scheduledAt: Date): boolean {
  return isAfter(scheduledAt, new Date());
}

export function getScheduledTimezone(date: Date, tz: string = "UTC"): string {
  return format(date, "yyyy-MM-dd HH:mm:ss") + ` ${tz}`;
}

export { addMinutes, isAfter, isBefore, parseISO };
