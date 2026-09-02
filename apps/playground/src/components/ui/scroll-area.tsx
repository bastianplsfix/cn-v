import { ScrollArea as Primitive } from "@base-ui/react/scroll-area";
import type {
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
} from "@base-ui/react/scroll-area";
import { cn } from "cn-variants";
import { forwardRef } from "react";

const ScrollAreaViewPort = forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
  function ScrollAreaViewPort({ className, ...props }, ref) {
    return (
      <Primitive.Viewport
        ref={ref}
        className={cn(
          "h-full overscroll-contain rounded-none border border-neutral-950 outline-hidden dark:border-white",
          "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white",
          className,
        )}
        {...props}
      />
    );
  },
);

const ScrollAreaScrollbar = forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>(
  function ScrollAreaScrollbar({ className, ...props }, ref) {
    return (
      <Primitive.Scrollbar
        ref={ref}
        className={cn(
          "relative m-px flex bg-black/12 opacity-0 transition-opacity pointer-events-none dark:bg-white/12",
          "data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5",
          "data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0",
          className,
        )}
        {...props}
      />
    );
  },
);

const ScrollAreaThumb = forwardRef<HTMLDivElement, ScrollAreaThumbProps>(function ScrollAreaThumb(
  { className, ...props },
  ref,
) {
  return (
    <Primitive.Thumb
      ref={ref}
      className={cn(
        "rounded-none bg-neutral-950 dark:bg-white",
        "data-[orientation=vertical]:w-full data-[orientation=horizontal]:h-full",
        className,
      )}
      {...props}
    />
  );
});

export const ScrollArea = {
  ...Primitive,
  Viewport: ScrollAreaViewPort,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
};
