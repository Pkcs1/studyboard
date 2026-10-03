import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashMark } from "@/components/ui";

/* Temporary home page for Milestone 0. The real dashboard arrives in Milestone 1. */
export default function Home() {
  return (
    <main className="dot-grid flex flex-1 flex-col px-5 sm:px-8">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between py-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">v0 · setup</span>
        <ThemeToggle />
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center pb-24">
        <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-8xl">
          Study
          <br />
          board
          <DashMark />
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink-muted">
          Your personal course tracker and study group space, coming together one milestone at a time.
        </p>

        <nav aria-label="Dashboards" className="mt-10 flex flex-wrap gap-3">
          {["Personal", "Group"].map((tab) => (
            <span
              key={tab}
              className="rounded-full border-2 border-line bg-surface px-5 py-3 font-display text-sm font-bold uppercase text-ink-muted"
            >
              {tab} <span className="font-mono text-xs font-normal normal-case">(soon)</span>
            </span>
          ))}
          <Link
            id="link-styleguide"
            href="/styleguide"
            className="glow rounded-full bg-accent px-5 py-3 font-display text-sm font-bold uppercase text-on-accent transition-transform hover:-translate-y-0.5"
          >
            View style guide →
          </Link>
        </nav>
      </section>
    </main>
  );
}
