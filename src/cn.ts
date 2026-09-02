import { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createCn } from "./create-cn.ts";

const mergeClasses = /* @__PURE__ */ createCn(twMerge);

/**
 * Combines class values with `clsx` and resolves Tailwind conflicts with
 * `tailwind-merge`. Later conflicting utilities win.
 *
 * @example
 * ```ts
 * cn("rounded px-2", condition && "font-bold", "px-4");
 * // "rounded font-bold px-4" when condition is true
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return mergeClasses(...inputs);
}
