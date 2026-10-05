-- ========================================================
-- Studyboard: Milestone 1 Initial Schema
-- Courses & Topics with Row Level Security (RLS)
-- ========================================================

-- 1. Courses Table
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Topics Table
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  week_number integer not null default 1,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'done')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Indexes for fast lookups
create index if not exists idx_courses_user_id on public.courses(user_id);
create index if not exists idx_topics_course_id on public.topics(course_id);
create index if not exists idx_topics_user_id on public.topics(user_id);
create index if not exists idx_topics_week on public.topics(course_id, week_number);

-- 4. Enable Row Level Security (RLS)
alter table public.courses enable row level security;
alter table public.topics enable row level security;

-- 5. RLS Policies: users can only view, insert, update, delete their own rows
drop policy if exists "Users can manage own courses" on public.courses;
create policy "Users can manage own courses"
  on public.courses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage own topics" on public.topics;
create policy "Users can manage own topics"
  on public.topics
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
