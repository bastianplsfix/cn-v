import { useEffect, useState } from "react";
import { Switch } from "#/components/ui";

function getTheme() {
  if (typeof document === "undefined") return null;
  return document.documentElement.getAttribute("data-theme");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(getTheme);

  useEffect(() => {
    const dark =
      theme === "dark" ||
      (theme === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [theme]);

  return (
    <span className="inline-flex items-center gap-2 text-[13px] leading-none text-ink-3">
      <Switch.Root
        aria-label="Dark mode"
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      >
        <Switch.Thumb />
      </Switch.Root>
      Dark mode
    </span>
  );
}
