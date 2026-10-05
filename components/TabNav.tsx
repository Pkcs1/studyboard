"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const TABS = [
  { href: "/personal", label: "Personal" },
  { href: "/group", label: "Group" },
];

/** The Personal | Group switcher. The orange pill slides to show which tab you're on. */
export function TabNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboards" className="flex rounded-full border-2 border-line bg-surface p-1">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            id={`tab-${tab.label.toLowerCase()}`}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-11 items-center rounded-full px-5 font-display text-xs font-bold uppercase tracking-wide transition-colors sm:text-sm ${
              active ? "text-on-accent" : "text-ink-muted hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-accent glow"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
