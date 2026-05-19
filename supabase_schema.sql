-- ═══════════════════════════════════════════════════════════════════════════
-- EnglishPath — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension (already enabled on Supabase by default)
-- create extension if not exists "uuid-ossp";

-- ─── Users (extends auth.users) ──────────────────────────────────────────────
create table if not exists public.users (
  id            uuid        primary key references auth.users(id) on delete cascade,
  name          text        not null default '',
  email         text        not null default '',
  level         text        not null default 'A2+' check (level in ('A2+','B1','B1+','B2')),
  start_date    date        not null default current_date,
  target_date   date        not null default (current_date + 90),
  current_day   integer     not null default 1,
  current_week  integer     not null default 1,
  total_xp      integer     not null default 0,
  streak        integer     not null default 0,
  last_active   date,
  words_learned integer     not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.users enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- ─── Lesson Progress (kunlik darslar) ────────────────────────────────────────
create table if not exists public.lesson_progress (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  date             date        not null default current_date,
  lesson_id        text        not null,
  score            integer     not null default 0 check (score between 0 and 100),
  correct_count    integer     not null default 0,
  total_exercises  integer     not null default 0,
  xp_earned        integer     not null default 0,
  completed_at     timestamptz not null default now(),
  unique (user_id, date, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "Users manage own lesson progress" on public.lesson_progress;
create policy "Users manage own lesson progress"
  on public.lesson_progress for all
  using (auth.uid() = user_id);

drop index if exists lesson_progress_user_date;
create index lesson_progress_user_date on public.lesson_progress (user_id, date);

-- ─── Sessions ────────────────────────────────────────────────────────────────
create table if not exists public.sessions (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  date             date        not null default current_date,
  type             text        not null check (type in ('grammar','vocabulary','listening','writing','mock-test','ai-chat')),
  duration_minutes integer     not null default 0,
  xp_earned        integer     not null default 0,
  notes            text,
  created_at       timestamptz not null default now()
);

alter table public.sessions enable row level security;

drop policy if exists "Users manage own sessions" on public.sessions;
create policy "Users manage own sessions"
  on public.sessions for all
  using (auth.uid() = user_id);

drop index if exists sessions_user_date;
create index sessions_user_date on public.sessions (user_id, date);

-- ─── Vocabulary ───────────────────────────────────────────────────────────────
create table if not exists public.vocabulary (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  word             text        not null,
  translation      text        not null,
  phonetic         text,
  example_sentence text,
  level            text        not null default 'B1' check (level in ('A2','B1','B2')),
  category         text        not null default 'general',
  srs_interval     integer     not null default 1,
  srs_repetitions  integer     not null default 0,
  srs_ease_factor  real        not null default 2.5,
  next_review_at   timestamptz not null default now(),
  mastery_level    smallint    not null default 0 check (mastery_level between 0 and 5),
  learned_at       timestamptz not null default now(),
  unique (user_id, word)
);

alter table public.vocabulary enable row level security;

drop policy if exists "Users manage own vocabulary" on public.vocabulary;
create policy "Users manage own vocabulary"
  on public.vocabulary for all
  using (auth.uid() = user_id);

drop index if exists vocab_user_review;
create index vocab_user_review on public.vocabulary (user_id, next_review_at);

-- ─── Daily Progress ───────────────────────────────────────────────────────────
create table if not exists public.daily_progress (
  id                  bigserial   primary key,
  user_id             uuid        not null references public.users(id) on delete cascade,
  date                date        not null,
  day                 integer     not null,
  week                integer     not null,
  total_minutes       integer     not null default 0,
  grammar_minutes     integer     not null default 0,
  vocab_minutes       integer     not null default 0,
  listening_minutes   integer     not null default 0,
  writing_minutes     integer     not null default 0,
  xp_earned           integer     not null default 0,
  streak              integer     not null default 0,
  grammar_pct         integer     not null default 0,
  vocab_pct           integer     not null default 0,
  listening_pct       integer     not null default 0,
  writing_pct         integer     not null default 0,
  checklist_completed integer     not null default 0,
  unique (user_id, date)
);

alter table public.daily_progress enable row level security;

drop policy if exists "Users manage own progress" on public.daily_progress;
create policy "Users manage own progress"
  on public.daily_progress for all
  using (auth.uid() = user_id);

-- ─── Writings ────────────────────────────────────────────────────────────────
create table if not exists public.writings (
  id           bigserial   primary key,
  user_id      uuid        not null references public.users(id) on delete cascade,
  date         date        not null default current_date,
  day          integer     not null,
  prompt       text        not null,
  user_text    text        not null,
  word_count   integer     not null default 0,
  ai_feedback  text,
  score        smallint    check (score between 0 and 10),
  created_at   timestamptz not null default now()
);

alter table public.writings enable row level security;

drop policy if exists "Users manage own writings" on public.writings;
create policy "Users manage own writings"
  on public.writings for all
  using (auth.uid() = user_id);

-- ─── Mock Tests ───────────────────────────────────────────────────────────────
create table if not exists public.mock_tests (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  date             date        not null default current_date,
  day              integer     not null,
  week             integer     not null,
  type             text        not null check (type in ('weekly','monthly','final')),
  reading_score    integer     not null default 0,
  listening_score  integer     not null default 0,
  grammar_score    integer     not null default 0,
  writing_score    integer     not null default 0,
  total_score      integer     not null default 0,
  level            text        not null default 'B1',
  feedback         text,
  created_at       timestamptz not null default now()
);

alter table public.mock_tests enable row level security;

drop policy if exists "Users manage own tests" on public.mock_tests;
create policy "Users manage own tests"
  on public.mock_tests for all
  using (auth.uid() = user_id);

-- ─── Lessons (kunlik darslar — JSONB saqlanadi) ──────────────────────────────
create table if not exists public.lessons (
  id            text        primary key,
  title         text        not null,
  subtitle      text        not null default '',
  level         text        not null default 'A2',
  day           integer     not null default 1,
  data          jsonb       not null,   -- to'liq dars strukturasi
  created_at    timestamptz not null default now()
);

alter table public.lessons enable row level security;

drop policy if exists "Lessons are public read" on public.lessons;
create policy "Lessons are public read"
  on public.lessons for select
  using (true);

-- ─── Grammar Topics (content) ────────────────────────────────────────────────
create table if not exists public.grammar_topics (
  id            text        primary key,
  level         text        not null default 'B1',
  data          jsonb       not null,
  order_index   integer     not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.grammar_topics enable row level security;

drop policy if exists "Grammar topics are public read" on public.grammar_topics;
create policy "Grammar topics are public read"
  on public.grammar_topics for select
  using (true);

-- ─── Reading Texts (content) ─────────────────────────────────────────────────
create table if not exists public.reading_texts (
  id            text        primary key,
  level         text        not null default 'B1',
  data          jsonb       not null,
  created_at    timestamptz not null default now()
);

alter table public.reading_texts enable row level security;

drop policy if exists "Reading texts are public read" on public.reading_texts;
create policy "Reading texts are public read"
  on public.reading_texts for select
  using (true);

-- ─── Listening Lessons (content) ─────────────────────────────────────────────
create table if not exists public.listening_lessons (
  id            text        primary key,
  level         text        not null default 'B1',
  data          jsonb       not null,
  created_at    timestamptz not null default now()
);

alter table public.listening_lessons enable row level security;

drop policy if exists "Listening lessons are public read" on public.listening_lessons;
create policy "Listening lessons are public read"
  on public.listening_lessons for select
  using (true);

-- ─── Speaking Prompts (content) ──────────────────────────────────────────────
create table if not exists public.speaking_prompts (
  id            text        primary key,
  category      text        not null,
  data          jsonb       not null,
  created_at    timestamptz not null default now()
);

alter table public.speaking_prompts enable row level security;

drop policy if exists "Speaking prompts are public read" on public.speaking_prompts;
create policy "Speaking prompts are public read"
  on public.speaking_prompts for select
  using (true);

-- ─── Writing Prompts (content) ───────────────────────────────────────────────
create table if not exists public.writing_prompts (
  id            text        primary key,
  type          text        not null,
  data          jsonb       not null,
  created_at    timestamptz not null default now()
);

alter table public.writing_prompts enable row level security;

drop policy if exists "Writing prompts are public read" on public.writing_prompts;
create policy "Writing prompts are public read"
  on public.writing_prompts for select
  using (true);

-- ─── Mock Test Questions (content) ───────────────────────────────────────────
create table if not exists public.mocktest_questions (
  id            integer     primary key generated always as identity,
  level         text        not null check (level in ('B1','B2')),
  section       text        not null check (section in ('grammar','vocabulary','reading')),
  data          jsonb       not null,
  created_at    timestamptz not null default now()
);

alter table public.mocktest_questions enable row level security;

drop policy if exists "Mock test questions are public read" on public.mocktest_questions;
create policy "Mock test questions are public read"
  on public.mocktest_questions for select
  using (true);

create table if not exists public.mocktest_listening (
  id            integer     primary key generated always as identity,
  level         text        not null default 'B2',
  data          jsonb       not null,
  created_at    timestamptz not null default now()
);

alter table public.mocktest_listening enable row level security;

drop policy if exists "Mock test listening are public read" on public.mocktest_listening;
create policy "Mock test listening are public read"
  on public.mocktest_listening for select
  using (true);

-- ─── Mock Test IELTS Writing Config (content) ────────────────────────────────
create table if not exists public.mocktest_writing (
  id            text        primary key,
  data          jsonb       not null,
  created_at    timestamptz not null default now()
);

alter table public.mocktest_writing enable row level security;

drop policy if exists "Mock test writing are public read" on public.mocktest_writing;
create policy "Mock test writing are public read"
  on public.mocktest_writing for select
  using (true);

-- ─── Auto-create user profile on signup ──────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
