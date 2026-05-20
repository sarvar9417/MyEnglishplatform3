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

-- ─── Grammar Progress ─────────────────────────────────────────────────────────
create table if not exists public.grammar_progress (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  date             date        not null default current_date,
  topic_id         text        not null,
  topic_title      text        not null,
  score            integer     not null default 0 check (score between 0 and 100),
  correct_count    integer     not null default 0,
  total_exercises  integer     not null default 0,
  xp_earned        integer     not null default 0,
  completed_at     timestamptz not null default now(),
  unique (user_id, date, topic_id)
);

alter table public.grammar_progress enable row level security;

drop policy if exists "Users manage own grammar progress" on public.grammar_progress;
create policy "Users manage own grammar progress"
  on public.grammar_progress for all
  using (auth.uid() = user_id);

drop index if exists grammar_progress_user_date;
create index grammar_progress_user_date on public.grammar_progress (user_id, date);

-- ─── Listening Progress ───────────────────────────────────────────────────────
create table if not exists public.listening_progress (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  date             date        not null default current_date,
  lesson_id        text        not null,
  lesson_title     text        not null,
  score            integer     not null default 0 check (score between 0 and 100),
  fill_correct     integer     not null default 0,
  fill_total       integer     not null default 0,
  tf_correct       integer     not null default 0,
  tf_total         integer     not null default 0,
  summary_done     boolean     not null default false,
  xp_earned        integer     not null default 0,
  completed_at     timestamptz not null default now(),
  unique (user_id, date, lesson_id)
);

alter table public.listening_progress enable row level security;

drop policy if exists "Users manage own listening progress" on public.listening_progress;
create policy "Users manage own listening progress"
  on public.listening_progress for all
  using (auth.uid() = user_id);

drop index if exists listening_progress_user_date;
create index listening_progress_user_date on public.listening_progress (user_id, date);

-- ─── Reading Progress ─────────────────────────────────────────────────────────
create table if not exists public.reading_progress (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  date             date        not null default current_date,
  text_id          text        not null,
  text_title       text        not null,
  score            integer     not null default 0 check (score between 0 and 100),
  correct_count    integer     not null default 0,
  total_questions  integer     not null default 0,
  xp_earned        integer     not null default 0,
  completed_at     timestamptz not null default now(),
  unique (user_id, date, text_id)
);

alter table public.reading_progress enable row level security;

drop policy if exists "Users manage own reading progress" on public.reading_progress;
create policy "Users manage own reading progress"
  on public.reading_progress for all
  using (auth.uid() = user_id);

drop index if exists reading_progress_user_date;
create index reading_progress_user_date on public.reading_progress (user_id, date);

-- ─── Speaking Progress ────────────────────────────────────────────────────────
create table if not exists public.speaking_progress (
  id               bigserial   primary key,
  user_id          uuid        not null references public.users(id) on delete cascade,
  date             date        not null default current_date,
  prompt_id        text        not null,
  prompt_text      text        not null,
  fluency_score    smallint    not null default 0 check (fluency_score between 0 and 10),
  grammar_score    smallint    not null default 0 check (grammar_score between 0 and 10),
  vocabulary_score smallint    not null default 0 check (vocabulary_score between 0 and 10),
  avg_score        smallint    not null default 0 check (avg_score between 0 and 10),
  xp_earned        integer     not null default 0,
  feedback         text,
  completed_at     timestamptz not null default now()
);

alter table public.speaking_progress enable row level security;

drop policy if exists "Users manage own speaking progress" on public.speaking_progress;
create policy "Users manage own speaking progress"
  on public.speaking_progress for all
  using (auth.uid() = user_id);

drop index if exists speaking_progress_user_date;
create index speaking_progress_user_date on public.speaking_progress (user_id, date);

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

-- ─── Words catalog ──────────────────────────────────────────────────────────
create table if not exists public.words (
  id       bigserial primary key,
  english  text not null,
  uzbek    text not null,
  level    text not null check (level in ('A1','A2','B1','B2')),
  example  text not null default '',
  phonetic text not null default '',
  unique (english, level)
);

alter table public.words enable row level security;

drop policy if exists "Words are readable by all authenticated users" on public.words;
create policy "Words are readable by all authenticated users"
  on public.words for select
  using (auth.role() = 'authenticated');

-- ─── Vocabulary Progress (SRS Leitner box per user per word) ────────────────
create table if not exists public.vocabulary_progress (
  id            bigserial    primary key,
  user_id       uuid         not null references auth.users(id) on delete cascade,
  word_id       bigint       not null references public.words(id) on delete cascade,
  box           integer      not null default 1 check (box between 1 and 6),
  next_review   date         not null default current_date,
  correct_count integer      not null default 0,
  wrong_count   integer      not null default 0,
  is_learned    boolean      not null default false,
  last_rating   text         check (last_rating in ('bildim','bilmadim','qiynaldim','yodladim')),
  last_reviewed timestamptz,
  created_at    timestamptz  not null default now(),
  unique (user_id, word_id)
);

alter table public.vocabulary_progress enable row level security;

drop policy if exists "Users manage own vocab progress" on public.vocabulary_progress;
create policy "Users manage own vocab progress"
  on public.vocabulary_progress for all
  using (auth.uid() = user_id);

drop index if exists idx_progress_review;
create index idx_progress_review on public.vocabulary_progress (user_id, next_review);

drop index if exists idx_progress_user_word;
create index idx_progress_user_word on public.vocabulary_progress (user_id, word_id);

-- ─── Vocabulary Sessions ────────────────────────────────────────────────────
create table if not exists public.vocabulary_sessions (
  id           bigserial   primary key,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  session_date date        not null default current_date,
  batch_number integer     not null check (batch_number between 1 and 4),
  words_json   jsonb       not null default '{}'::jsonb,
  score        integer     not null default 0,
  time_spent   integer     not null default 0,
  completed    boolean     not null default false,
  created_at   timestamptz not null default now()
);

alter table public.vocabulary_sessions enable row level security;

drop policy if exists "Users manage own vocab sessions" on public.vocabulary_sessions;
create policy "Users manage own vocab sessions"
  on public.vocabulary_sessions for all
  using (auth.uid() = user_id);

drop index if exists idx_sessions_user_date;
create index idx_sessions_user_date on public.vocabulary_sessions (user_id, session_date);

-- ─── RPC: get_daily_words ───────────────────────────────────────────────────
drop function if exists public.get_daily_words(uuid, int);
create or replace function public.get_daily_words(
  user_uuid uuid,
  new_count int default 70
)
returns table (
  word_id      bigint,
  english      text,
  uzbek        text,
  level        text,
  box          int,
  next_review  date,
  is_learned   boolean,
  correct_count int,
  wrong_count   int,
  is_new       boolean,
  example      text
)
language plpgsql security definer set search_path = public
as $$
begin
  -- 1. Takrorlash uchun so'zlar (next_review <= today)
  return query
  select
    w.id                   as word_id,
    w.english,
    w.uzbek,
    w.level,
    vp.box,
    vp.next_review,
    vp.is_learned,
    vp.correct_count,
    vp.wrong_count,
    false                  as is_new,
    w.example
  from public.words w
  join public.vocabulary_progress vp on vp.word_id = w.id
  where vp.user_id = user_uuid
    and vp.next_review <= current_date
    and vp.is_learned = false
  order by vp.next_review asc, vp.box asc;

  -- 2. Yangi so'zlar (words da bor, vocabulary_progress da yo'q)
  return query
  select
    w.id                   as word_id,
    w.english,
    w.uzbek,
    w.level,
    1                      as box,
    current_date           as next_review,
    false                  as is_learned,
    0                      as correct_count,
    0                      as wrong_count,
    true                   as is_new,
    w.example
  from public.words w
  where not exists (
    select 1 from public.vocabulary_progress vp
    where vp.user_id = user_uuid and vp.word_id = w.id
  )
  order by w.id
  limit new_count;
end;
$$;

grant execute on function public.get_daily_words(uuid, int) to authenticated;

-- ─── RPC: get_word_counts_by_level ──────────────────────────────────────────
create or replace function public.get_word_counts_by_level()
returns table (level text, total bigint)
language sql security definer set search_path = public
as $$
  select w.level, count(*)::bigint as total
  from public.words w
  group by w.level
  order by w.level;
$$;

grant execute on function public.get_word_counts_by_level() to authenticated;

-- ─── RPC: get_learned_counts_by_level ───────────────────────────────────────
create or replace function public.get_learned_counts_by_level(user_uuid uuid)
returns table (level text, learned bigint)
language sql security definer set search_path = public
as $$
  select w.level, count(*)::bigint as learned
  from public.vocabulary_progress vp
  join public.words w on w.id = vp.word_id
  where vp.user_id = user_uuid and vp.is_learned = true
  group by w.level
  order by w.level;
$$;

grant execute on function public.get_learned_counts_by_level(uuid) to authenticated;

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

drop index if exists daily_progress_user_date;
create index daily_progress_user_date on public.daily_progress (user_id, date);

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

-- ─── User words (personal dictionary additions) ───────────────────────────────
create table if not exists public.user_words (
  id       bigserial primary key,
  user_id  uuid        not null references auth.users(id) on delete cascade,
  english  text        not null,
  uzbek    text        not null,
  level    text        not null default 'A2' check (level in ('A1','A2','B1','B2')),
  example  text        not null default '',
  phonetic text        not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, english)
);

alter table public.user_words enable row level security;

drop policy if exists "Users can read own words" on public.user_words;
create policy "Users can read own words"
  on public.user_words for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own words" on public.user_words;
create policy "Users can insert own words"
  on public.user_words for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own words" on public.user_words;
create policy "Users can delete own words"
  on public.user_words for delete
  using (auth.uid() = user_id);

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
