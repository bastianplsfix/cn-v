import { cn, variants, type Variant } from "cn-variants";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export const badgeTone = variants({
  secondary:
    "border-neutral-950 bg-white text-neutral-950 dark:border-white dark:bg-neutral-950 dark:text-white",
  primary:
    "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950",
  danger:
    "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500 dark:text-white",
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
        "inline-flex h-5 items-center justify-center rounded-full border px-2 text-xs leading-none whitespace-nowrap font-normal select-none",
        badgeTone(tone),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
});
