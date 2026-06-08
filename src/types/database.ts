// ═══════════════════════════════════════════════════════════════════════════
// Auto-generated from supabase_schema.sql
// Regenerate: supabase gen types typescript --linked > src/types/database.ts
// ═══════════════════════════════════════════════════════════════════════════

// ─── Users ────────────────────────────────────────────────────────────────────
export interface DbUser {
  id:            string
  name:          string
  email:         string
  level:         string
  start_date:    string
  target_date:   string
  current_day:   number
  current_week:  number
  total_xp:      number
  streak:        number
  last_active:   string | null
  words_learned: number
  state:         unknown | null
  invite_code:   string | null
  created_at:    string
}

// ─── Progress Tables ──────────────────────────────────────────────────────────

export interface DbLessonProgress {
  id:               number
  user_id:          string
  date:             string
  lesson_id:        string
  score:            number
  correct_count:    number
  total_exercises:  number
  xp_earned:        number
  completed_at:     string
}

export interface DbGrammarProgress {
  id:               number
  user_id:          string
  date:             string
  topic_id:         string
  topic_title:      string
  score:            number
  correct_count:    number
  total_exercises:  number
  xp_earned:        number
  completed_at:     string
}

export interface DbListeningProgress {
  id:               number
  user_id:          string
  date:             string
  lesson_id:        string
  lesson_title:     string
  score:            number
  fill_correct:     number
  fill_total:       number
  tf_correct:       number
  tf_total:         number
  summary_done:     boolean
  xp_earned:        number
  completed_at:     string
}

export interface DbReadingProgress {
  id:               number
  user_id:          string
  date:             string
  text_id:          string
  text_title:       string
  score:            number
  correct_count:    number
  total_questions:  number
  xp_earned:        number
  completed_at:     string
}

export interface DbSpeakingProgress {
  id:                number
  user_id:          string
  date:             string
  prompt_id:        string
  prompt_text:      string
  fluency_score:    number
  grammar_score:    number
  vocabulary_score: number
  avg_score:        number
  xp_earned:        number
  feedback:         string | null
  completed_at:     string
}

// ─── Sessions ─────────────────────────────────────────────────────────────────
export interface DbSession {
  id:               number
  user_id:          string
  date:             string
  type:             'grammar' | 'vocabulary' | 'listening' | 'writing' | 'mock-test' | 'ai-chat'
  duration_minutes: number
  xp_earned:        number
  notes:            string | null
  created_at:       string
}

// ─── Daily Progress ───────────────────────────────────────────────────────────
export interface DbDailyProgress {
  id:                  number
  user_id:             string
  date:                string
  day:                 number
  week:                number
  total_minutes:       number
  grammar_minutes:     number
  vocab_minutes:       number
  listening_minutes:   number
  writing_minutes:     number
  xp_earned:           number
  streak:              number
  grammar_pct:         number
  vocab_pct:           number
  listening_pct:       number
  writing_pct:         number
  reading_pct:         number
  speaking_pct:        number
  phrases_pct:         number
  checklist_completed: number
}

// ─── Vocabulary (per-user) ────────────────────────────────────────────────────
export interface DbVocabWord {
  id:               number
  user_id:          string
  word:             string
  translation:      string
  phonetic:         string | null
  example_sentence: string | null
  level:            string
  category:         string
  srs_interval:     number
  srs_repetitions:  number
  srs_ease_factor:  number
  next_review_at:   string
  mastery_level:    number
  learned_at:       string
}

// ─── Words Catalog ────────────────────────────────────────────────────────────
export interface DbWord {
  id:       number
  english:  string
  uzbek:    string
  level:    'A1' | 'A2' | 'B1' | 'B2'
  example:  string
  phonetic: string
}

// ─── Vocabulary Progress (SRS) ────────────────────────────────────────────────
export interface DbVocabularyProgress {
  id:            number
  user_id:       string
  word_id:       number
  box:           number
  next_review:   string
  correct_count: number
  wrong_count:   number
  is_learned:    boolean
  last_rating:   string | null
  last_reviewed: string | null
  created_at:    string
  updated_at?:   string
}

// ─── Vocabulary Sessions ──────────────────────────────────────────────────────
export interface DbVocabularySession {
  id:           number
  user_id:      string
  session_date: string
  batch_number: 1 | 2 | 3 | 4
  words_json:   Record<string, string>
  score:        number
  time_spent:   number
  completed:    boolean
  created_at:   string
}

// ─── Writings ─────────────────────────────────────────────────────────────────
export interface DbWriting {
  id:             number
  user_id:        string
  date:           string
  day:            number
  prompt:         string
  user_text:      string
  word_count:     number
  ai_feedback:    string | null
  score:          number | null
  created_at:     string
}

// ─── Mock Tests ───────────────────────────────────────────────────────────────
export interface DbMockTest {
  id:               number
  user_id:          string
  date:             string
  day:              number
  week:             number
  type:             string
  reading_score:    number
  listening_score:  number
  grammar_score:    number
  writing_score:    number
  total_score:      number
  level:            string
  feedback:         string | null
  created_at:       string
}

// ─── Content Tables ───────────────────────────────────────────────────────────

export interface DbLesson {
  id:        string
  title:     string
  subtitle:  string
  level:     string
  day:       number
  data:      unknown
  created_at: string
}

export interface DbGrammarTopic {
  id:          string
  level:       string
  data:        unknown
  order_index: number
  created_at:  string
}

export interface DbReadingText {
  id:         string
  level:      string
  data:       unknown
  created_at: string
}

export interface DbListeningLesson {
  id:         string
  level:      string
  data:       unknown
  created_at: string
}

export interface DbSpeakingPrompt {
  id:        string
  category:  string
  data:      unknown
  created_at: string
}

export interface DbWritingPrompt {
  id:   string
  type: string
  data: unknown
}

// ─── Mock Test Content ────────────────────────────────────────────────────────
export interface DbMockTestQuestion {
  id:        number
  level:     'B1' | 'B2'
  section:   'grammar' | 'vocabulary' | 'reading'
  data:      unknown
  created_at: string
}

export interface DbMockTestListening {
  id:        number
  level:     string
  data:      unknown
  created_at: string
}

export interface DbMockTestWriting {
  id:   string
  data: unknown
}

// ─── Phrases Catalog ──────────────────────────────────────────────────────────
export interface DbPhrase {
  id:          number
  english:     string
  uzbek:       string
  level:       'A1' | 'A2' | 'B1' | 'B2'
  category:    string
  source:      string | null
}

// ─── Phrase Progress (SRS) ────────────────────────────────────────────────────
export interface DbPhraseProgress {
  id:            number
  user_id:       string
  phrase_id:     number
  box:           number
  next_review:   string
  correct_count: number
  wrong_count:   number
  is_learned:    boolean
  last_rating:   number | null
  last_reviewed: string | null
  created_at:    string
  updated_at?:   string
}

// ─── Phrase Sessions ──────────────────────────────────────────────────────────
export interface DbPhraseSession {
  id:            number
  user_id:       string
  session_date:  string
  batch_number:  1 | 2 | 3
  phrases_json:  Record<string, string>
  score:         number
  time_spent:    number
  completed:     boolean
  created_at:    string
}

// ─── User Words ───────────────────────────────────────────────────────────────
export interface DbUserWord {
  id:       number
  user_id:  string
  english:  string
  uzbek:    string
  level:    'A1' | 'A2' | 'B1' | 'B2'
  example:  string
  phonetic: string
  created_at: string
}

// ─── Lesson Session (cross-device resume) ─────────────────────────────────────
export interface DbLessonSession {
  id:                       number
  user_id:                  string
  lesson_id:                string
  tab:                      string
  current_section:          number
  test_section:             number
  completed_sections:       Record<string, number>
  completed_test_sections:  Record<string, number>
  updated_at:               string
}

export interface DbLessonExerciseAnswer {
  id:            number
  user_id:       string
  lesson_id:     string
  section_index: number
  exercise_id:   number
  exercise_type: string
  section_type:  'exercise' | 'test' | 'drill'
  answer:        unknown
  is_correct:    boolean
  submitted_at:  string
}

export interface DbLessonVocabProgress {
  id:          number
  user_id:     string
  lesson_id:   string
  word_index:  number
  known:       boolean
  quiz_correct: number
  quiz_wrong:   number
  updated_at:  string
}

export interface DbLessonViewedTab {
  id:           number
  user_id:      string
  lesson_id:    string
  viewed_tabs:  string[]
  updated_at:   string
}
