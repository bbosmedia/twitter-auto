import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind + conditional classes (works with HeroUI className props). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
