import { Button as Primitive } from "@base-ui/react/button";
import type { ButtonProps as PrimitiveProps, ButtonState } from "@base-ui/react/button";
import { cn, variants, type Variant } from "cn-variants";
import { forwardRef, type ReactNode } from "react";

export const buttonTone = variants({
  secondary:
    "border-neutral-950 bg-white text-neutral-950 hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:active:not-data-disabled:bg-neutral-700",
  primary:
    "border-neutral-950 bg-neutral-950 text-white hover:not-data-disabled:bg-neutral-700 active:not-data-disabled:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:not-data-disabled:bg-neutral-200 dark:active:not-data-disabled:bg-neutral-300",
});

export const buttonSize = variants({
  sm: "h-7 px-2",
  md: "h-8 px-3",
});

export type ButtonProps = Omit<PrimitiveProps, "children"> & {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  tone?: Variant<typeof buttonTone>;
  rounded?: boolean;
  size?: Variant<typeof buttonSize>;
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    className,
    tone = "secondary",
    type = "button",
    rounded = false,
    icon,
    iconPosition = "start",
    size = "md",
    children,
    ...props
  },
  ref,
) {
  const iconAfterLabel = iconPosition === "end";
  const iconSlot = icon ? (
    <span className="inline-flex size-4 shrink-0 items-center justify-center overflow-hidden [&>svg]:size-full">
      {icon}
    </span>
  ) : null;

  return (
    <Primitive
      ref={ref}
      type={type}
      className={(state: ButtonState) =>
        cn(
          "inline-flex items-center justify-center gap-2 rounded-none border text-sm leading-none whitespace-nowrap font-normal select-none",
          "data-disabled:border-neutral-500 data-disabled:text-neutral-500 disabled:border-neutral-500 disabled:text-neutral-500 dark:data-disabled:border-neutral-400 dark:data-disabled:text-neutral-400 dark:disabled:border-neutral-400 dark:disabled:text-neutral-400",
          "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white",
          buttonTone(tone),
          buttonSize(size),
          rounded && "rounded-full",
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    >
      {icon ? (
        iconAfterLabel ? (
          <>
            {children}
            {iconSlot}
          </>
        ) : (
          <>
            {iconSlot}
            {children}
          </>
        )
      ) : (
        children
      )}
    </Primitive>
  );
});
