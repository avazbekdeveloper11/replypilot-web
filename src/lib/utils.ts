import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class lists safely — clsx handles conditional
 * composition, tailwind-merge resolves conflicting utility classes
 * (e.g. "px-2" vs "px-4") by keeping the last one. Every component in
 * src/components/ui accepts a `className` override and funnels it
 * through this so consumers can extend styling without fighting
 * specificity.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
