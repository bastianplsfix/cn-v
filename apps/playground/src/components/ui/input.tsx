import { Input as Primitive } from "@base-ui/react/input";
import type { InputProps as PrimitiveProps, InputState } from "@base-ui/react/input";
import { cn, variants, type Variant } from "cn-variants";
import { forwardRef, type ReactNode } from "react";

const sizeVariants = variants({
  small: "h-7",
  default: "h-8",
});

export type InputProps = Omit<PrimitiveProps, "size"> & {
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  size?: Variant<typeof sizeVariants>;
};

export const Input = forwardRef<HTMLElement, InputProps>(function Input(
  { className, icon, iconPosition = "start", size = "default", ...props },
  ref,
) {
  const iconSlot = icon ? (
    <span
      className={cn(
        "pointer-events-none absolute inset-y-0 flex items-center text-neutral-500 dark:text-neutral-400 [&>svg]:size-4",
        iconPosition === "end" ? "right-2" : "left-2",
      )}
    >
      {icon}
    </span>
  ) : null;

  const control = (
    <Primitive
      ref={ref}
      className={(state: InputState) =>
        cn(
          "w-full rounded-none border border-neutral-950 bg-white text-sm leading-none font-normal text-neutral-950 outline-hidden placeholder:text-neutral-500",
          icon ? (iconPosition === "end" ? "pr-8 pl-2" : "pr-2 pl-8") : "px-2",
          "any-pointer-coarse:text-base",
          "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950",
          "dark:border-white dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-400 dark:focus-visible:outline-white",
          "data-disabled:border-neutral-500 data-disabled:text-neutral-500 disabled:border-neutral-500 disabled:text-neutral-500 dark:data-disabled:border-neutral-400 dark:disabled:border-neutral-400 dark:data-disabled:text-neutral-400 dark:disabled:text-neutral-400",
          sizeVariants(size),
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );

  if (!icon) {
    return control;
  }

  return (
    <span className="relative inline-flex w-full items-center">
      {iconPosition === "start" ? iconSlot : null}
      {control}
      {iconPosition === "end" ? iconSlot : null}
    </span>
  );
});
