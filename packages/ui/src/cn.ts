import { createCn } from "cn-variants";
import { extendTailwindMerge } from "tailwind-merge";

export const cn = createCn(extendTailwindMerge({ prefix: "ui" }));
