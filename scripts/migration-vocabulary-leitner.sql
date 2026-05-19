-- ═══════════════════════════════════════════════════════════════════════════
-- EnglishPath — Vocabulary Leitner System Migration
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Words catalog ──────────────────────────────────────────────────────────
create table if not exists public.words (
  id       bigserial primary key,
  english  text not null,
  uzbek    text not null,
  level    text not null check (level in ('A1','A2','B1','B2')),
  unique (english, level)
);

-- Mavjud jadvalga yangi ustunlar (agar mavjud bo'lmasa)
alter table public.words add column if not exists example  text not null default '';
alter table public.words add column if not exists phonetic text not null default '';

-- Unique constraint (create if not exists)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'words_english_level_key'
  ) then
    alter table public.words add constraint words_english_level_key unique (english, level);
  end if;
end $$;

-- Takrorlarni o'chirish (seed script ikki marta yugurganda)
delete from public.words
where id not in (
  select min(id) from public.words group by english, level
);

alter table public.words enable row level security;

drop policy if exists "Words are readable by all authenticated users" on public.words;
create policy "Words are readable by all authenticated users"
  on public.words for select
  using (auth.role() = 'authenticated');

-- ─── 1. Vocabulary Progress (Leitner box per user per word) ───────────────
create table if not exists public.vocabulary_progress (
  id            bigserial    primary key,
  user_id       uuid         not null references auth.users(id) on delete cascade,
  word_id       bigint       not null references public.words(id) on delete cascade,
  box           integer      not null default 1 check (box between 1 and 5),
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

-- ─── 2. Vocabulary Sessions ─────────────────────────────────────────────────
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

-- ─── 3. Indexes ─────────────────────────────────────────────────────────────
create index if not exists idx_progress_review
  on public.vocabulary_progress (user_id, next_review);

create index if not exists idx_progress_user_word
  on public.vocabulary_progress (user_id, word_id);

create index if not exists idx_words_level
  on public.words (level);

create index if not exists idx_sessions_user_date
  on public.vocabulary_sessions (user_id, session_date);

-- ─── 4. Function: get_daily_words ───────────────────────────────────────────
-- Returns new words + due-for-review words for a user on the current day.
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
  -- ── 1. Takrorlash uchun so'zlar (next_review <= today) ──────────────
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

  -- ── 2. Yangi so'zlar (words da bor, vocabulary_progress da yo'q) ───
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

-- ─── 5. Helper functions for progress stats ──────────────────────────────────

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
