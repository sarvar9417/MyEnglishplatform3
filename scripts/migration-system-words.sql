-- EnglishPath — system_words jadvalini to'ldirish
-- Supabase Dashboard → SQL Editor → Run

-- 1. Missing kolonkalarni qo'shish
ALTER TABLE public.system_words 
  ADD COLUMN IF NOT EXISTS translation text,
  ADD COLUMN IF NOT EXISTS phonetic text,
  ADD COLUMN IF NOT EXISTS example_sentence text,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS week_introduced integer NOT NULL DEFAULT 1;

-- 2. Unique constraint (upsert uchun)
ALTER TABLE public.system_words DROP CONSTRAINT IF EXISTS system_words_word_key;
ALTER TABLE public.system_words ADD CONSTRAINT system_words_word_key UNIQUE (word);

-- 3. system_words RLS yoqish
ALTER TABLE public.system_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all system_words"
  ON public.system_words FOR SELECT
  USING (true);
