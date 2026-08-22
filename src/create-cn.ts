import { type ClassValue, clsx } from "clsx";

/**
 * Creates a `cn` function with a custom Tailwind merge implementation.
 *
 * The default {@link cn} hardcodes tailwind-merge's default configuration.
 * Projects with custom utilities — design tokens like `bg-primary` or
 * plugin classes like `animate-fade-in` — can pass a configured merger
 * built with tailwind-merge's `extendTailwindMerge` instead:
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
export function createCn(
  mergeClasses: (classes: string) => string,
): (...inputs: ClassValue[]) => string {
  return (...inputs: ClassValue[]) => mergeClasses(clsx(inputs));
}
