import { Select as Primitive } from "@base-ui/react/select";
import type {
  SelectItemProps,
  SelectListProps,
  SelectPopupProps,
  SelectPositionerProps,
  SelectTriggerProps,
  SelectValueProps,
} from "@base-ui/react/select";
import { cn } from "cn-variants";
import { forwardRef, type ReactNode } from "react";

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
  { className, children, ...props },
  ref,
) {
  return (
    <Primitive.Trigger
      ref={ref}
      className={cn(
        "flex h-8 min-w-40 cursor-default items-center justify-between gap-3 rounded-none border border-neutral-950 bg-white py-0 pr-1 pl-2 text-sm leading-none whitespace-nowrap font-normal text-neutral-950 select-none outline-hidden",
        "hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 data-pressed:bg-neutral-100",
        "dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:active:not-data-disabled:bg-neutral-700 dark:data-pressed:bg-neutral-800",
        "data-disabled:border-neutral-500 data-disabled:text-neutral-500 disabled:border-neutral-500 disabled:text-neutral-500 dark:data-disabled:border-neutral-400 dark:disabled:border-neutral-400 dark:data-disabled:text-neutral-400 dark:disabled:text-neutral-400",
        "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white",
        className,
      )}
      {...props}
    >
      {children as ReactNode}
    </Primitive.Trigger>
  );
});

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(function SelectValue(
  { className, ...props },
  ref,
) {
  return (
    <Primitive.Value
      ref={ref}
      className={cn(
        "truncate data-placeholder:text-neutral-500 dark:data-placeholder:text-neutral-400",
        className,
      )}
      {...props}
    />
  );
});

const SelectIcon = forwardRef<HTMLSpanElement, { className?: string; children?: ReactNode }>(
  function SelectIcon({ className, children }, ref) {
    return (
      <span ref={ref} className={cn("text-neutral-950 dark:text-white", className)}>
        {children ?? "▾"}
      </span>
    );
  },
);

const SelectPositioner = forwardRef<HTMLDivElement, SelectPositionerProps>(
  function SelectPositioner({ className, ...props }, ref) {
    return (
      <Primitive.Positioner
        ref={ref}
        className={cn("z-10 outline-hidden select-none", className)}
        {...props}
      />
    );
  },
);

const SelectPopup = forwardRef<HTMLDivElement, SelectPopupProps>(function SelectPopup(
  { className, ...props },
  ref,
) {
  return (
    <Primitive.Popup
      ref={ref}
      className={cn(
        "group min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-none border border-neutral-950 bg-clip-padding bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 outline-hidden dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none",
        "transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0",
        "data-[side=none]:min-w-[calc(var(--anchor-width)+1.75rem)] data-[side=none]:translate-y-px data-[side=none]:data-ending-style:transition-none data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none",
        className,
      )}
      {...props}
    />
  );
});

const SelectList = forwardRef<HTMLDivElement, SelectListProps>(function SelectList(
  { className, ...props },
  ref,
) {
  return (
    <Primitive.List
      ref={ref}
      className={cn(
        "relative max-h-[var(--available-height)] overflow-y-auto py-1 outline-hidden scroll-py-6",
        className,
      )}
      {...props}
    />
  );
});

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, ...props },
  ref,
) {
  return (
    <Primitive.Item
      ref={ref}
      className={cn(
        "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-none py-1.5 pr-4 pl-2.5 text-sm leading-5 font-normal outline-hidden select-none",
        "data-highlighted:bg-neutral-950 data-highlighted:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-neutral-950",
        className,
      )}
      {...props}
    />
  );
});

export const Select = {
  ...Primitive,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
};
