# Studyboard: Agent Rules & Project Context

## What this is
A mobile-first web app for college courses with two tabs:
- **Personal**: my private topic tracker, materials library (links) and Markdown notes.
- **Group**: an invite-only study group space with per-member progress, shared materials and shared notes.

First course: **Algoritma dan Pemrograman 1** (uses Go).

## Stack
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Auth) · Motion (`motion/react`) + inline SVG · Vercel.

## Milestones
0. Setup + design foundation (`/styleguide`)
1. Personal progress tracker (courses, topics, status, progress bar)
2. Auth (Supabase, public sign-up disabled, RLS on every table)
3. Materials library
4. Notes & sources (Markdown)
5. Personal polish (search, filters, hero progress piece)
6. Study group foundation (groups, members, invite codes, group RLS)
7. Group progress grid, shared library and notes
8. Group polish

## Non-goals (do NOT build)
Google Drive sync · reading the Obsidian vault directly · file uploads · group chat / task assignment · Three.js 3D objects (stretch goal only).

## Design rules ("Kinetic Geometry")
- All colors are tokens in `app/globals.css`. Never hard-code colors in components.
- Fonts: Unbounded (headings), Inter (body), JetBrains Mono (labels/numbers).
- Light mode is the default. Dark mode uses `<html data-theme="dark">` with a neon orange accent.
- Status shapes: outlined circle / half-filled / solid + burst (`components/StatusShape.tsx`).
- Motion must have a purpose. Animate only `transform` and `opacity`. Respect `prefers-reduced-motion`.
- Mobile-first, readable contrast, tap targets ≥ 44px. Readability beats style.

## Agent rules
- Work on **one milestone at a time**. Never start the next one unprompted.
- Before writing code for a milestone, show a short plan and wait for approval.
- The owner is a beginner. After each change, explain in plain language what each new file does and why it exists.
- Keep code simple. Prefer fewer files and no extra libraries unless the reason is explained.
- Never put secrets in code. Use environment variables (`.env.local`, which is git-ignored).
- Every table must have Row Level Security policies.
- Make a Git commit after each working step with a clear message.
- If something is unclear, ask instead of guessing.
- Read `AGENTS.md`: this Next.js version may differ from what you remember. Check `node_modules/next/dist/docs/`.
