import type { MaterialType } from "@/lib/types";

export function MaterialBadge({ type }: { type: MaterialType }) {
  switch (type) {
    case "drive":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-teal">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.71 3.5L1.15 15l3.43 6l6.55-11.5L7.71 3.5zm4.87 5.75L7.43 21h13.14l5.15-9H12.58zM16.29 3.5l-3.43 6l6.57 11.5l6.57-11.5l-9.71-6z" />
          </svg>
          Drive
        </span>
      );
    case "pdf":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange/40 bg-orange/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-orange">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          PDF
        </span>
      );
    case "slides":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow/40 bg-yellow/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-yellow">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          Slides
        </span>
      );
    case "obsidian":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo/40 bg-indigo/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-indigo">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 9 12 22 22 9 12 2" />
            <polyline points="2 9 12 14 22 9" />
          </svg>
          Obsidian
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-muted">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Link
        </span>
      );
  }
}
