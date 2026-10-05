import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, DashMark } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Studyboard",
  description: "Sign in to your Studyboard.",
};

export default function LoginPage() {
  return (
    <main className="dot-grid flex flex-1 flex-col px-5 sm:px-8">
      <header className="mx-auto flex w-full max-w-md items-center justify-between py-6">
        <span className="font-display text-sm font-extrabold uppercase tracking-tight">Studyboard</span>
        <ThemeToggle />
      </header>

      <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center pb-24">
        {/* Small geometric accent */}
        <svg viewBox="0 0 120 40" className="mb-6 h-10 w-30" aria-hidden>
          <circle cx="20" cy="20" r="16" fill="var(--orange)" />
          <rect x="44" y="4" width="32" height="32" rx="4" fill="var(--indigo)" />
          <path d="M84 36 L116 36 L100 4 Z" fill="var(--teal)" />
        </svg>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
          Sign in
          <DashMark />
        </h1>
        <p className="mb-8 mt-3 text-ink-muted">Private dashboard. Accounts are invite-only.</p>
        <Card className="glow">
          <LoginForm />
        </Card>
      </section>
    </main>
  );
}
