"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type Status = "not_started" | "in_progress" | "done";

const LABELS: Record<Status, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

// How much of the circle is filled for each status (0 = empty, 1 = full)
const FILL: Record<Status, number> = { not_started: 0, in_progress: 0.5, done: 1 };

const COLOR: Record<Status, string> = {
  not_started: "var(--status-todo)",
  in_progress: "var(--status-doing)",
  done: "var(--status-done)",
};

const NEXT: Record<Status, Status> = {
  not_started: "in_progress",
  in_progress: "done",
  done: "not_started",
};

/**
 * The status "shape":
 *   Not started = outlined circle, In progress = half-filled, Done = solid + burst.
 * The fill is a rectangle that grows sideways (scaleX), so only `transform`
 * is animated, which keeps it smooth on phones.
 */
export function StatusShape({ status, size = 40 }: { status: Status; size?: number }) {
  const reduce = useReducedMotion();
  const clipId = "clip" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

  // Play the burst only when the status *changes* to done (not on first load).
  const [prev, setPrev] = useState(status);
  const [burstKey, setBurstKey] = useState(0);
  if (status !== prev) {
    setPrev(status);
    if (status === "done") setBurstKey((k) => k + 1);
  }

  const color = COLOR[status];
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 24 };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label={LABELS[status]}
      className="shrink-0 overflow-visible"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="13" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <motion.rect
          x="6"
          y="6"
          width="28"
          height="28"
          initial={false}
          animate={{ scaleX: FILL[status], fill: color }}
          style={{ originX: 0 }}
          transition={spring}
        />
      </g>

      <motion.circle
        cx="20"
        cy="20"
        r="13"
        fill="none"
        strokeWidth="3"
        initial={false}
        animate={{ stroke: color }}
        transition={spring}
      />

      {burstKey > 0 && !reduce && (
        <motion.g
          key={burstKey}
          style={{ originX: "50%", originY: "50%" }}
          initial={{ opacity: 1, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.35 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={20 + Math.cos(a) * 16}
                y1={20 + Math.sin(a) * 16}
                x2={20 + Math.cos(a) * 21}
                y2={20 + Math.sin(a) * 21}
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </motion.g>
      )}
    </svg>
  );
}

/** A big tap target that cycles the status: Not started → In progress → Done. */
export function StatusCycler({ initial = "not_started" }: { initial?: Status }) {
  const [status, setStatus] = useState<Status>(initial);
  return (
    <motion.button
      type="button"
      onClick={() => setStatus(NEXT[status])}
      whileTap={{ scale: 0.94 }}
      className="flex min-h-12 items-center gap-3 rounded-full border-2 border-line bg-surface py-2 pl-2 pr-5 hover:border-accent"
      aria-label={`Status: ${LABELS[status]}. Tap to change.`}
    >
      <StatusShape status={status} />
      <span className="font-mono text-sm uppercase tracking-wider">{LABELS[status]}</span>
    </motion.button>
  );
}
