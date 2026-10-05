-- ========================================================
-- Studyboard: Milestone 3 & 4 Materials and Notes Schema
-- Row Level Security (RLS) enabled
-- ========================================================

-- 1. Materials Table
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('drive', 'pdf', 'slides', 'obsidian', 'other')),
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Notes Table (each topic has a primary markdown note document)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  content text not null default '',
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_topic_note unique (topic_id, user_id)
);

-- 3. Indexes
create index if not exists idx_materials_topic_id on public.materials(topic_id);
create index if not exists idx_materials_user_id on public.materials(user_id);
create index if not exists idx_notes_topic_id on public.notes(topic_id);
create index if not exists idx_notes_user_id on public.notes(user_id);

-- 4. Enable Row Level Security (RLS)
alter table public.materials enable row level security;
alter table public.notes enable row level security;

-- 5. Strict RLS Policies: users manage only their own rows
drop policy if exists "Users can manage own materials" on public.materials;
create policy "Users can manage own materials"
  on public.materials
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage own notes" on public.notes;
create policy "Users can manage own notes"
  on public.notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
