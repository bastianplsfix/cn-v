import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { navLinks } from "../components/nav";
import { CycleNav } from "../components/cycle-nav";
import { ScrollArea } from "#/components/ui";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <section className="px-8 py-6">
      <p className="text-sm text-ink-3">404</p>
      <h1 className="mt-2 text-lg font-normal">Page not found</h1>
      <Link
        className="mt-6 inline-block text-[15px] text-ink-2 underline underline-offset-2"
        to="/"
      >
        Back to the docs
      </Link>
    </section>
  ),
});

function RootLayout() {
  return (
    <div className="flex h-dvh gap-0 bg-surface py-1 text-ink">
      <aside className="hidden w-[200px] shrink-0 flex-col border-r border-line-subtle lg:flex xl:w-[250px]">
        <ScrollArea.Root className="flex min-h-0 flex-1 flex-col">
          <ScrollArea.Viewport className="min-w-0 flex-1 border-none overscroll-y-contain">
            <div className="flex h-full flex-col gap-9 px-5 py-6 xl:px-7">
              <nav className="flex flex-1 flex-col items-start gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    activeOptions={link.to === "/" ? { exact: true } : undefined}
                    className="self-start text-[15px] leading-snug text-ink-3 transition-colors hover:text-ink"
                    activeProps={{ className: "text-ink! underline underline-offset-2" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <footer className="flex flex-col gap-3">
                <div className="flex flex-col text-[13px] leading-tight text-ink-3">
                  <p>
                    <a
                      className="transition-colors hover:text-ink"
                      href="https://github.com/bastianplsfix/cn-variants"
                      target="_blank"
                      rel="noopener"
                    >
                      cn-variants
                    </a>
                  </p>
                  <p>Docs and component playground.</p>
                </div>
              </footer>
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <CycleNav />
        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
