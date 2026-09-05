import { cn } from "./cn";
import { variants, type Variant } from "cn-variants";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export const badgeTone = variants({
  secondary:
    "ui:border-neutral-950 ui:bg-white ui:text-neutral-950 ui:dark:border-white ui:dark:bg-neutral-950 ui:dark:text-white",
  primary:
    "ui:border-neutral-950 ui:bg-neutral-950 ui:text-white ui:dark:border-white ui:dark:bg-white ui:dark:text-neutral-950",
  danger:
    "ui:border-red-600 ui:bg-red-600 ui:text-white ui:dark:border-red-500 ui:dark:bg-red-500 ui:dark:text-white",
});

export type BadgeProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  children: ReactNode;
  tone?: Variant<typeof badgeTone>;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = "secondary", children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "cnui-control ui:inline-flex ui:h-5 ui:items-center ui:justify-center ui:rounded-full ui:border ui:px-2 ui:text-xs ui:leading-none ui:whitespace-nowrap ui:font-normal ui:select-none",
        badgeTone(tone),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
});
