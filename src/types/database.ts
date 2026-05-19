export interface UserRow {
  id:            string
  email:         string
  name:          string
  current_level: string
  current_day:   number
  current_week:  number
  streak:        number
  target_date:   string
  total_xp:      number
  created_at:    string
}

export interface DailyProgressRow {
  id:                number
  user_id:           string
  date:              string  // YYYY-MM-DD
  day:               number
  week:              number
  total_minutes:     number
  grammar_minutes:   number
  vocab_minutes:     number
  listening_minutes: number
  writing_minutes:   number
  xp_earned:         number
  streak:            number
  grammar_pct:       number
  vocab_pct:         number
  listening_pct:     number
  writing_pct:       number
  checklist_completed: number
}

export interface MockTestRow {
  id:         string
  user_id:    string
  type:       'B1' | 'B2' | 'IELTS'
  score:      number
  band:       number | null
  answers:    unknown
  created_at: string
}

export interface VocabularyRow {
  id:               string
  user_id:          string
  word:             string
  status:           'new' | 'learning' | 'known'
  translation:      string
  phonetic:         string
  example_sentence: string
  created_at:       string
  updated_at:       string
}

export interface WritingRow {
  id:         string
  user_id:    string
  prompt:     string
  essay:      string
  scores:     Record<string, number>
  feedback:   string
  created_at: string
}

type TableDef<R> = { Row: R; Insert: Partial<R>; Update: Partial<R> }

export interface Database {
  public: {
    Tables: {
      users:          TableDef<UserRow>
      daily_progress: TableDef<DailyProgressRow>
      mock_tests:     TableDef<MockTestRow>
      vocabulary:     TableDef<VocabularyRow>
      writings:       TableDef<WritingRow>
    }
  }
}
