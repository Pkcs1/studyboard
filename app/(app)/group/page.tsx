import type { Metadata } from "next";
import { Card, DashMark } from "@/components/ui";

export const metadata: Metadata = { title: "Group · Studyboard" };

/* Placeholder until the study group milestones. */
export default function GroupPage() {
  return (
    <section className="pt-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Study group</p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
        Coming soon
        <DashMark />
      </h1>
      <Card className="mt-8 max-w-lg">
        <p className="text-ink-muted">
          Invite classmates, see everyone&apos;s progress per topic, and share materials and notes.
        </p>
      </Card>
    </section>
  );
}
