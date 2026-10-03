import type { Metadata } from "next";
import Link from "next/link";
import { StatusCycler, StatusShape, type Status } from "@/components/StatusShape";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button, Card, DashMark, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Style Guide · Studyboard",
  description: "Colors, type, buttons, cards and status shapes for the Studyboard design system.",
};

const BRAND = [
  { name: "Cream", token: "--cream", hex: "#F5EFE6" },
  { name: "Orange", token: "--orange", hex: "#FF7A3D" },
  { name: "Teal", token: "--teal", hex: "#0E9594" },
  { name: "Indigo", token: "--indigo", hex: "#5B4B7A" },
  { name: "Plum", token: "--plum", hex: "#2B1233" },
  { name: "Yellow", token: "--yellow", hex: "#FFA400" },
];

const ROLES = ["--bg", "--surface", "--ink", "--ink-muted", "--line", "--accent"];

const WEEKS: { n: string; title: string; status: Status; materials: number }[] = [
  { n: "01", title: "Pengenalan Algoritma & Go", status: "done", materials: 4 },
  { n: "02", title: "Tipe Data & Variabel", status: "in_progress", materials: 3 },
  { n: "03", title: "Percabangan (if / switch)", status: "not_started", materials: 2 },
  { n: "04", title: "Perulangan (for)", status: "not_started", materials: 0 },
];

/** Static preview of the "hero progress piece": shapes that assemble as progress grows. */
function HeroShapes() {
  return (
    <svg viewBox="0 0 240 240" className="h-auto w-full max-w-[280px]" aria-hidden>
      <rect x="20" y="20" width="96" height="96" rx="8" fill="var(--indigo)" />
      <path d="M124 116 A96 96 0 0 1 220 20 L220 116 Z" fill="var(--yellow)" />
      <circle cx="68" cy="172" r="48" fill="var(--orange)" />
      <path d="M124 220 L220 220 L172 124 Z" fill="var(--teal)" />
      <circle cx="172" cy="172" r="10" fill="var(--plum)" />
    </svg>
  );
}

/** Dashed curved arrow, used to connect related things (topic → next topic). */
function CurvedArrow() {
  return (
    <svg viewBox="0 0 120 60" className="h-12 w-24 shrink-0 text-ink-muted" aria-hidden>
      <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d="M6 46 C 30 4, 80 4, 110 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
      {/* ---------- Header ---------- */}
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="font-display text-sm font-extrabold uppercase tracking-tight">
          Studyboard
        </Link>
        <ThemeToggle />
      </header>

      {/* ---------- Hero ---------- */}
      <section className="dot-grid grid items-center gap-8 rounded-card border-2 border-line px-6 py-10 sm:grid-cols-[1fr_auto] sm:px-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Design system / v0</p>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl">
            Kinetic
            <br />
            Geometry
            <DashMark />
          </h1>
          <p className="mt-5 max-w-md text-ink-muted">
            Bold flat color, geometric shapes, and motion only where it means something.
          </p>
        </div>
        <HeroShapes />
      </section>

      {/* ---------- 01 Colors ---------- */}
      <section className="mt-16" aria-labelledby="colors">
        <SectionHeading index="01">
          <span id="colors">Colors</span>
        </SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BRAND.map((c) => (
            <div key={c.token} className="overflow-hidden rounded-card border-2 border-line bg-surface">
              <div className="h-20" style={{ background: `var(${c.token})` }} />
              <div className="p-3">
                <p className="font-display text-sm font-bold">{c.name}</p>
                <p className="font-mono text-xs text-ink-muted">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mb-3 mt-8 font-mono text-xs uppercase tracking-wider text-ink-muted">
          Semantic roles (these switch with the theme)
        </p>
        <div className="flex flex-wrap gap-3">
          {ROLES.map((r) => (
            <div key={r} className="flex items-center gap-2 rounded-full border-2 border-line bg-surface py-1.5 pl-1.5 pr-4">
              <span className="block size-7 rounded-full border border-line" style={{ background: `var(${r})` }} />
              <span className="font-mono text-xs">{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 02 Typography ---------- */}
      <section className="mt-16" aria-labelledby="type">
        <SectionHeading index="02">
          <span id="type">Typography</span>
        </SectionHeading>
        <div className="space-y-6">
          <Card>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">Display / Unbounded</p>
            <p className="mt-2 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              Algoritma
            </p>
          </Card>
          <Card>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">Body / Inter</p>
            <p className="mt-2 max-w-prose text-lg leading-relaxed">
              Sebuah algoritma adalah langkah-langkah logis untuk menyelesaikan masalah. In Go, every
              program starts in <code className="font-mono text-base">func main()</code>.
            </p>
          </Card>
          <Card>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">Labels &amp; numbers / JetBrains Mono</p>
            <p className="mt-2 font-mono text-sm uppercase tracking-wider">Week 03 · 2 materials · 68% done</p>
          </Card>
        </div>
      </section>

      {/* ---------- 03 Buttons ---------- */}
      <section className="mt-16" aria-labelledby="buttons">
        <SectionHeading index="03">
          <span id="buttons">Buttons</span>
        </SectionHeading>
        <div className="flex flex-wrap items-center gap-4">
          <Button id="btn-primary">Add topic</Button>
          <Button id="btn-secondary" variant="secondary">Edit</Button>
          <Button id="btn-ghost" variant="ghost">Cancel</Button>
          <Button id="btn-disabled" disabled>Disabled</Button>
        </div>
      </section>

      {/* ---------- 04 Status shapes ---------- */}
      <section className="mt-16" aria-labelledby="status">
        <SectionHeading index="04">
          <span id="status">Status shapes</span>
        </SectionHeading>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["not_started", "in_progress", "done"] as Status[]).map((s) => (
            <Card key={s} className="flex items-center gap-4">
              <StatusShape status={s} size={48} />
              <span className="font-mono text-sm uppercase tracking-wider">{s.replace("_", " ")}</span>
            </Card>
          ))}
        </div>
        <p className="mb-3 mt-8 font-mono text-xs uppercase tracking-wider text-ink-muted">
          Try it: tap to cycle (morph + burst on Done)
        </p>
        <StatusCycler />
      </section>

      {/* ---------- 05 Cards & lists ---------- */}
      <section className="mt-16" aria-labelledby="cards">
        <SectionHeading index="05">
          <span id="cards">Cards &amp; lists</span>
        </SectionHeading>

        <Card className="p-0 sm:p-0">
          <ul className="divide-y-2 divide-line">
            {WEEKS.map((w) => (
              <li
                key={w.n}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-bg sm:gap-6 sm:px-6"
              >
                <span className="font-display text-3xl font-black text-ink-muted transition-colors group-hover:text-accent sm:text-4xl">
                  {w.n}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{w.title}</p>
                  <p className="font-mono text-xs text-ink-muted">{w.materials} materials</p>
                </div>
                <StatusShape status={w.status} />
              </li>
            ))}
          </ul>
        </Card>

        <p className="mb-3 mt-10 font-mono text-xs uppercase tracking-wider text-ink-muted">
          Connector: dashed curved arrow
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Card className="px-5 py-4">
            <span className="font-mono text-xs text-ink-muted">01</span>
            <p className="font-semibold">Variabel</p>
          </Card>
          <CurvedArrow />
          <Card className="px-5 py-4">
            <span className="font-mono text-xs text-ink-muted">02</span>
            <p className="font-semibold">Percabangan</p>
          </Card>
        </div>
      </section>
    </main>
  );
}
