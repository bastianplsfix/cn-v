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
 *       "font-size": [{ text: ["caption", "body"] }],
 *     },
 *   },
 * });
 *
 * export const cn = createCn(twMerge);
 * cn("text-caption", "text-red-500");
 * // "text-caption text-red-500": the custom font size and color coexist.
 * ```
 */
export function createCn(mergeClasses: MergeClasses): (...inputs: ClassValue[]) => string {
  return (...inputs: ClassValue[]) => mergeClasses(clsx(inputs));
}
