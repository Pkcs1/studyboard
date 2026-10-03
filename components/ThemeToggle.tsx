"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// Watch the <html data-theme> attribute so the button always shows the real theme.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerTheme = (): Theme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (next === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      id="theme-toggle"
      onClick={toggle}
      className="flex min-h-11 items-center gap-2 rounded-full border-2 border-line bg-surface px-4 font-mono text-xs uppercase tracking-wider hover:border-accent"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span
        aria-hidden
        className="block size-3 rounded-full bg-accent glow"
        style={{ clipPath: theme === "dark" ? "inset(0 0 0 50%)" : "none" }}
      />
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
