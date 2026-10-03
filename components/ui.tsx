import type { ComponentProps, ReactNode } from "react";

/* Small, shared UI pieces. Kept in one file so there are fewer files to learn. */

/** The brand signature: a little underscore + dash after headings. */
export function DashMark() {
  return (
    <span aria-hidden className="ml-3 inline-flex items-end gap-1 align-baseline">
      <span className="block h-[0.14em] w-[0.6em] bg-accent" />
      <span className="mb-[0.3em] block h-[0.14em] w-[0.35em] bg-accent" />
    </span>
  );
}

export function SectionHeading({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <div className="mb-6 flex items-baseline gap-4">
      {index && <span className="font-mono text-sm text-ink-muted">{index}</span>}
      <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
        {children}
        <DashMark />
      </h2>
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent glow hover:-translate-y-0.5",
  secondary: "border-2 border-ink text-ink hover:bg-ink hover:text-bg",
  ghost: "text-ink underline-offset-4 hover:underline",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-display text-sm font-bold uppercase tracking-wide transition-[transform,background-color,color] duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-card border-2 border-line bg-surface p-5 sm:p-6 ${className}`}
      {...props}
    />
  );
}
