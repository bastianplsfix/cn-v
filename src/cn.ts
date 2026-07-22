import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class values with `clsx`, then resolves conflicting Tailwind CSS
 * utilities with `tailwind-merge`.
 *
 * Later conflicting utilities win, so put a caller-provided `className` last
 * when it should override component defaults.
 *
 * @example
 * ```ts
 * cn("rounded px-2", condition && "font-bold", "px-4");
 * // "rounded font-bold px-4" when condition is true
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
