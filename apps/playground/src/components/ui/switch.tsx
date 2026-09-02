import { Switch as Primitive } from "@base-ui/react/switch";
import type { SwitchRootProps, SwitchThumbProps } from "@base-ui/react/switch";
import { cn } from "cn-variants";
import { forwardRef } from "react";

const SwitchRoot = forwardRef<HTMLButtonElement, SwitchRootProps>(function SwitchRoot(
  { className, ...props },
  ref,
) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn(
        "flex h-5 w-9 shrink-0 rounded-none border border-neutral-950 bg-white p-0.5 transition-colors duration-150 ease-[ease] dark:border-white dark:bg-neutral-950 data-checked:bg-neutral-950 dark:data-checked:bg-white",
        "data-disabled:border-neutral-500 disabled:border-neutral-500 dark:data-disabled:border-neutral-400 dark:disabled:border-neutral-400",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white",
        className,
      )}
      {...props}
    />
  );
});

const SwitchThumb = forwardRef<HTMLSpanElement, SwitchThumbProps>(function SwitchThumb(
  { className, ...props },
  ref,
) {
  return (
    <Primitive.Thumb
      ref={ref}
      className={cn(
        "size-3.5 bg-neutral-950 transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-4 data-checked:bg-white dark:bg-white dark:data-checked:bg-neutral-950",
        className,
      )}
      {...props}
    />
  );
});

export const Switch = {
  ...Primitive,
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};
