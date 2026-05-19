import { create } from 'zustand'
import type { DailyWordRow, Rating } from '../services/vocabularyService'
import { computeNextReview } from '../services/vocabularyService'
import { getTodayTashkent } from '../utils/tashkentDate'

export type ViewMode = 'catalog' | 'flashcard' | 'test' | 'game' | 'complete'

export interface GameWord {
  word_id:      number
  english:      string
  uzbek:        string
  level:        string
  box:          number
  next_review:  string
  is_learned:   boolean
  correct_count: number
  wrong_count:   number
  is_new:       boolean
  example?:    string
  last_rating?: string
}

export interface VocabState {
  dailyWords:     GameWord[]
  reviewWords:    GameWord[]  // bugun takrorlanishi kerak bo'lgan so'zlar
  currentBatch:   number   // 1-4 yangi, 0 takrorlash
  batchWords:     GameWord[]
  currentIdx:     number
  viewMode:       ViewMode
  batchResults:   Record<string, Rating>
  correctCount:   number
  totalAnswered:  number
  loading:        boolean
  sessionTime:    number   // seconds

  setDailyWords:  (words: DailyWordRow[]) => void
  setReviewWords: (words: DailyWordRow[]) => void
  setViewMode:    (mode: ViewMode) => void
  setLoading:     (v: boolean) => void

  selectBatch:    (batch: number) => void
  selectReview:   () => void
  nextWord:       () => void

  rateWord:       (wordId: number, rating: Rating) => { newBox: number; nextReview: string }
  finishBatch:    () => void

  tick:           () => void
  reset:          () => void
}

const BATCH_SIZE = 25

export function getBatchWords(all: GameWord[], batch: number): GameWord[] {
  const start = (batch - 1) * BATCH_SIZE
  return all.slice(start, start + BATCH_SIZE)
}

export const useVocabStore = create<VocabState>()((set, get) => ({
  dailyWords:    [],
  reviewWords:   [],
  currentBatch:  1,
  batchWords:    [],
  currentIdx:    0,
  viewMode:      'catalog',
  batchResults:  {},
  correctCount:  0,
  totalAnswered: 0,
  loading:       false,
  sessionTime:   0,

  setDailyWords: (words) =>
    set({
      dailyWords: words,
      currentBatch: 1,
      currentIdx: 0,
      viewMode: 'catalog',
      batchResults: {},
      correctCount: 0,
      totalAnswered: 0,
      sessionTime: 0,
      batchWords: getBatchWords(words, 1),
    }),

  setReviewWords: (words) =>
    set({ reviewWords: words }),

  setViewMode: (mode) => set({ viewMode: mode, currentIdx: 0 }),

  setLoading: (v) => set({ loading: v }),

  selectBatch: (batch) =>
    set({
      currentBatch: batch,
      batchWords: getBatchWords(get().dailyWords, batch),
      currentIdx: 0,
      viewMode: 'catalog',
      batchResults: {},
      correctCount: 0,
      totalAnswered: 0,
    }),

  selectReview: () =>
    set({
      currentBatch: 0,
      batchWords: get().reviewWords,
      currentIdx: 0,
      viewMode: 'catalog',
      batchResults: {},
      correctCount: 0,
      totalAnswered: 0,
    }),

  nextWord: () =>
    set((s) => ({
      currentIdx: Math.min(s.currentIdx + 1, s.batchWords.length - 1),
    })),

  rateWord: (wordId, rating) => {
    const word = get().batchWords.find((w) => w.word_id === wordId)
    if (!word) return { newBox: 1, nextReview: getTodayTashkent() }

    const srs = computeNextReview(word.box, rating)
    const isCorrect = rating === 'bildim' || rating === 'yodladim'

    set((s) => {
      const isLearned = srs.is_learned
      const base = { box: srs.box, next_review: srs.next_review, is_learned: isLearned, is_new: false, last_rating: rating }
      const upd = (w: GameWord) =>
        w.word_id === wordId
          ? { ...w, ...base, correct_count: w.correct_count + (isCorrect ? 1 : 0), wrong_count: w.wrong_count + (isCorrect ? 0 : 1) }
          : w
      return {
        batchWords: s.batchWords.map(upd),
        batchResults: { ...s.batchResults, [wordId]: rating },
        correctCount: s.correctCount + (isCorrect ? 1 : 0),
        totalAnswered: s.totalAnswered + 1,
        dailyWords: s.dailyWords.map(upd),
      }
    })

    return { newBox: srs.box, nextReview: srs.next_review }
  },

  finishBatch: () => set({ viewMode: 'complete' }),

  tick: () => set((s) => ({ sessionTime: s.sessionTime + 1 })),

  reset: () =>
    set({
      dailyWords:    [],
      reviewWords:   [],
      currentBatch:  1,
      batchWords:    [],
      currentIdx:    0,
      viewMode:      'catalog',
      batchResults:  {},
      correctCount:  0,
      totalAnswered: 0,
      loading:       false,
      sessionTime:   0,
    }),
}))
