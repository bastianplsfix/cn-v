import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Select } from "#/components/ui";
import { navLinks } from "./nav";
import { ThemeToggle } from "./theme-toggle";

const arrowButtonClasses =
  "flex size-7 cursor-pointer items-center justify-center rounded-none border border-line-subtle text-sm leading-none text-ink-3 transition-colors hover:border-line hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white";

export function CycleNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/$/, "") || "/";
  const index = navLinks.findIndex((link) => link.to === pathname);
  const current = index < 0 ? navLinks[0]! : navLinks[index]!;
  const previous = navLinks[(index < 0 ? 0 : index - 1 + navLinks.length) % navLinks.length]!;
  const next = navLinks[(index < 0 ? 1 : index + 1) % navLinks.length]!;

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-3">
      <div className="flex min-w-0 items-center gap-3">
        <ThemeToggle />
        <div className="min-w-0 lg:hidden">
          <Select.Root
            items={navLinks.map((link) => ({ value: link.to, label: link.label }))}
            value={current.to}
            onValueChange={(to) => {
              if (to) void navigate({ to });
            }}
          >
            <Select.Trigger aria-label="Page" className="w-full min-w-0 max-w-[16rem]">
              <Select.Value />
              <Select.Icon>▾</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
                <Select.Popup>
                  <Select.List>
                    {navLinks.map((link) => (
                      <Select.Item key={link.to} value={link.to}>
                        <Select.ItemIndicator className="col-start-1">✓</Select.ItemIndicator>
                        <Select.ItemText className="col-start-2">{link.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
        <span className="hidden text-[13px] leading-none text-ink-3 lg:block">{current.label}</span>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-1">
        <Link
          to={previous.to}
          aria-label={`Previous: ${previous.label}`}
          className={arrowButtonClasses}
        >
          ←
        </Link>
        <Link to={next.to} aria-label={`Next: ${next.label}`} className={arrowButtonClasses}>
          →
        </Link>
      </div>
    </div>
  );
}
