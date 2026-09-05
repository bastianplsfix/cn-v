import { twMerge } from "tailwind-merge";
import { type Cn, createCn } from "./create-cn.ts";

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
export const cn: Cn = /* @__PURE__ */ createCn(twMerge);
