import { cn } from "./cn";
import { Button as Primitive } from "@base-ui/react/button";
import type { ButtonProps as PrimitiveProps, ButtonState } from "@base-ui/react/button";
import { variants, type Variant } from "cn-variants";
import { forwardRef, type ReactNode } from "react";

export const buttonTone = variants({
  secondary:
    "ui:border-neutral-950 ui:bg-white ui:text-neutral-950 ui:hover:not-data-disabled:bg-neutral-100 ui:active:not-data-disabled:bg-neutral-200 ui:dark:border-white ui:dark:bg-neutral-950 ui:dark:text-white ui:dark:hover:not-data-disabled:bg-neutral-800 ui:dark:active:not-data-disabled:bg-neutral-700",
  primary:
    "ui:border-neutral-950 ui:bg-neutral-950 ui:text-white ui:hover:not-data-disabled:bg-neutral-700 ui:active:not-data-disabled:bg-neutral-800 ui:dark:border-white ui:dark:bg-white ui:dark:text-neutral-950 ui:dark:hover:not-data-disabled:bg-neutral-200 ui:dark:active:not-data-disabled:bg-neutral-300",
});

export const buttonSize = variants({
  sm: "ui:h-7 ui:px-2",
  md: "ui:h-8 ui:px-3",
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
    <span className="ui:inline-flex ui:size-4 ui:shrink-0 ui:items-center ui:justify-center ui:overflow-hidden ui:[&>svg]:size-full">
      {icon}
    </span>
  ) : null;

  return (
    <Primitive
      ref={ref}
      type={type}
      className={(state: ButtonState) =>
        cn(
          "cnui-control ui:inline-flex ui:items-center ui:justify-center ui:gap-2 ui:rounded-none ui:border ui:text-sm ui:leading-none ui:whitespace-nowrap ui:font-normal ui:select-none",
          "ui:data-disabled:border-neutral-500 ui:data-disabled:text-neutral-500 ui:disabled:border-neutral-500 ui:disabled:text-neutral-500 ui:dark:data-disabled:border-neutral-400 ui:dark:data-disabled:text-neutral-400 ui:dark:disabled:border-neutral-400 ui:dark:disabled:text-neutral-400",
          "ui:focus-visible:outline-2 ui:focus-visible:-outline-offset-1 ui:focus-visible:outline-neutral-950 ui:dark:focus-visible:outline-white",
          buttonTone(tone),
          buttonSize(size),
          rounded && "ui:rounded-full",
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
