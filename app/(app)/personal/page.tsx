import type { Metadata } from "next";
import { Card, DashMark } from "@/components/ui";

export const metadata: Metadata = { title: "Personal · Studyboard" };

/* Placeholder until the progress tracker milestone. */
export default function PersonalPage() {
  return (
    <section className="pt-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Personal dashboard</p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
        You&apos;re in
        <DashMark />
      </h1>
      <Card className="mt-8 max-w-lg">
        <p className="text-ink-muted">
          Login works. Your topic tracker for <strong className="text-ink">Algoritma dan Pemrograman 1</strong>{" "}
          arrives in the next milestone.
        </p>
      </Card>
    </section>
  );
}
