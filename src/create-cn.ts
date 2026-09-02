import { type ClassValue, clsx } from "clsx";

/** A Tailwind merge implementation accepted by {@link createCn}. */
export type MergeClasses = (classes: string) => string;

/**
 * Creates a `cn`-style function around a custom Tailwind merge implementation.
 *
 * @example
 * ```ts
 * import { createCn } from "cn-variants";
 * import { extendTailwindMerge } from "tailwind-merge";
 *
 * const twMerge = extendTailwindMerge({
 *   extend: {
 *     classGroups: {
 *       "bg-color": [{ bg: ["primary", "secondary"] }],
 *     },
 *   },
 * });
 *
 * export const cn = createCn(twMerge);
 * ```
 */
export function createCn(mergeClasses: MergeClasses): (...inputs: ClassValue[]) => string {
  return (...inputs: ClassValue[]) => mergeClasses(clsx(inputs));
}
