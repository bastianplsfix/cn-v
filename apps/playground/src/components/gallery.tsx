import { type ReactNode } from "react";
import { cn, ScrollArea } from "#/components/ui";

export function GalleryPage({
  title,
  description,
  preview,
  code,
  controls,
  propDocs,
  children,
}: {
  title: string;
  description?: ReactNode;
  preview?: ReactNode;
  code?: string;
  controls?: ReactNode;
  propDocs?: ReactNode;
  children?: ReactNode;
}) {
  if (preview === undefined) {
    return (
      <div className="h-full overflow-y-auto px-8 py-6">
        <section className="max-w-3xl">
          <header className="flex flex-col gap-1.5">
            <h1 className="text-lg leading-snug font-normal">{title}</h1>
            {description ? (
              <p className="text-[15px] leading-snug text-ink-2">{description}</p>
            ) : null}
          </header>
          <div className="mt-9 flex flex-col gap-9">{children}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <section aria-label="Preview" className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-[22rem] flex-1 flex-col p-6">
          <div className="m-auto flex w-full flex-1 items-center justify-center">{preview}</div>
          {code ? <UsagePanel code={code} className="mt-4 hidden lg:block" /> : null}
        </div>
      </section>
      <aside
        aria-label="Documentation"
        className="flex w-full shrink-0 flex-col border-t border-line-subtle lg:w-80 lg:min-h-0 lg:border-t-0 lg:border-l xl:w-[26rem]"
      >
        <ScrollArea.Root className="flex min-h-0 flex-1 flex-col">
          <ScrollArea.Viewport className="min-w-0 flex-1 border-none overscroll-y-contain">
            <div className="flex flex-col gap-9 px-5 py-6 lg:pl-6 xl:pl-7">
              <header className="flex flex-col gap-1.5">
                <h1 className="text-lg leading-snug font-normal">{title}</h1>
                {description ? (
                  <p className="text-[15px] leading-snug text-ink-2">{description}</p>
                ) : null}
              </header>
              {controls ? (
                <section aria-label="Knobs" className="flex flex-col gap-3">
                  <h2 className="text-[15px] leading-snug text-ink-3">Knobs</h2>
                  {controls}
                </section>
              ) : null}
              {propDocs ? (
                <section aria-label="Props" className="flex flex-col gap-3">
                  <h2 className="text-[15px] leading-snug text-ink-3">Props</h2>
                  <ScrollArea.Root className="min-w-0">
                    <ScrollArea.Viewport className="min-w-0 border-none overscroll-x-contain overscroll-y-auto">
                      <div className="min-w-max pb-3.5">{propDocs}</div>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar orientation="horizontal">
                      <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                  </ScrollArea.Root>
                </section>
              ) : null}
              {children}
              {code ? <UsagePanel code={code} className="mt-auto lg:hidden" /> : null}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </aside>
    </div>
  );
}

function UsagePanel({ code, className }: { code: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-none border border-line-subtle", className)}>
      <div className="border-b border-line-subtle px-3 py-1.5 text-xs leading-none text-ink-3">
        Usage
      </div>
      <ScrollArea.Root className="bg-surface-2">
        <ScrollArea.Viewport className="border-none overscroll-x-contain overscroll-y-auto">
          <pre className="w-max min-w-full p-3 font-mono text-xs leading-relaxed text-ink">
            {code}
          </pre>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
