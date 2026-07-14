import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
