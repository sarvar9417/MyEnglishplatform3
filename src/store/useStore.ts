import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getTodayTashkent } from '../utils/tashkentDate'
import { fetchLessons } from '../services/lessonService'
import type { DailyLesson } from '../data/dailyLessons'

export type Level = 'A2+' | 'B1' | 'B1+' | 'B2'

export interface DailyChecklist {
  grammar:    boolean   // Grammar: Conditionals       3 soat
  vocabulary: boolean   // Vocabulary: 100 so'z         2 soat
  listening:  boolean   // Listening: BBC + Shadowing   2 soat
  reading:    boolean   // Reading: 2 matn              1.5 soat
  writing:    boolean   // Writing: Essay 200 so'z      2 soat
  speaking:   boolean   // Speaking: Italki             1.5 soat
}

export interface MockResult {
  score: number        // 0–100
  level: Level
  date: string
}

export interface AppState {
  // Foydalanuvchi
  userName: string
  userEmail: string

  // O'quv jarayoni
  startDate: string
  targetDate: string       // startDate + 90 kun
  currentWeek: number
  currentDay: number
  currentLevel: Level

  // Maqsad
  dailyGoalMinutes: number  // 840 = 14 soat

  // XP va streak
  totalXP: number
  todayXP: number           // bugun qo'shilgan XP
  streak: number
  lastActiveDate: string

  // Lug'at statistikasi
  totalWordsLearned: number

  // Kunlik darslar progressi (lessonId → score 0-100)
  lessonProgress: Record<string, number>

  // Database'dan olingan darslar
  lessons: DailyLesson[]
  lessonsLoading: boolean
  lessonsFetched: boolean

  // Oxirgi mock test natijasi
  lastMock: MockResult | null

  // Bugungi progress (0–100)
  todayMinutes: number
  todayGrammarPct: number
  todayVocabPct: number
  todayListeningPct: number
  todayReadingPct: number
  todaySpeakingPct: number
  todayWritingPct: number

  // Bugungi chek-list
  todayChecklist: DailyChecklist

  // Onboarding
  onboardingComplete: boolean

  // Actions
  setUserName: (name: string) => void
  setUserEmail: (email: string) => void
  completeOnboarding: (name: string) => void

  addXP: (amount: number) => void
  incrementStreak: () => void
  resetStreak: () => void

  setTodayMinutes: (minutes: number) => void
  updateSkillProgress: (
    skill: keyof Pick<AppState,
      'todayGrammarPct' | 'todayVocabPct' | 'todayListeningPct' | 'todayReadingPct' | 'todaySpeakingPct' | 'todayWritingPct'
    >,
    pct: number
  ) => void

  toggleChecklistItem: (item: keyof DailyChecklist) => void
  setLessonProgress: (lessonId: string, score: number) => void
  setLastMock: (result: MockResult) => void
  addLearnedWords: (count: number) => void
  fetchAndSetLessons: () => Promise<void>

  advanceDay: () => void
  setLevel: (level: Level) => void
  resetDailyProgress: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

function todayISO(): string {
  return getTodayTashkent()
}

const EMPTY_CHECKLIST: DailyChecklist = {
  grammar:    false,
  vocabulary: false,
  listening:  false,
  reading:    false,
  writing:    false,
  speaking:   false,
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      const today = todayISO()

      return {
        // Foydalanuvchi
        userName:  '',
        userEmail: '',

        // O'quv jarayoni
        startDate:    today,
        targetDate:   addDays(today, 90),
        currentWeek:  1,
        currentDay:   1,
        currentLevel: 'A2+',

        // Maqsad: 14 soat = 840 daqiqa
        dailyGoalMinutes: 840,

        // XP / streak
        totalXP:        0,
        todayXP:        0,
        streak:         0,
        lastActiveDate: '',

        // Database darslar
        lessons:        [],
        lessonsLoading: false,
        lessonsFetched: false,

        // Statistika
        totalWordsLearned: 0,
        lastMock:          null,

        // Kunlik darslar progressi
        lessonProgress: {},

        // Bugungi progress
        todayMinutes:      0,
        todayGrammarPct:   0,
        todayVocabPct:     0,
        todayListeningPct: 0,
        todayReadingPct:   0,
        todaySpeakingPct:  0,
        todayWritingPct:   0,

        // Chek-list
        todayChecklist: { ...EMPTY_CHECKLIST },

        // Onboarding
        onboardingComplete: false,

        // ── Actions ──────────────────────────────────────────────────────────

        setUserName:  (name)  => set({ userName: name }),
        setUserEmail: (email) => set({ userEmail: email }),

        completeOnboarding: (name) => {
          const today = todayISO()
          set({
            userName: name,
            onboardingComplete: true,
            startDate:  today,
            targetDate: addDays(today, 90),
          })
        },

        addXP: (amount) =>
          set((s) => ({
            totalXP: s.totalXP + amount,
            todayXP: s.todayXP + amount,
          })),

        incrementStreak: () => {
          const today = todayISO()
          const { lastActiveDate, streak } = get()
          const yesterday = addDays(today, -1)
          if (lastActiveDate === yesterday) {
            set({ streak: streak + 1, lastActiveDate: today })
          } else if (lastActiveDate !== today) {
            set({ streak: 1, lastActiveDate: today })
          }
        },

        resetStreak: () => set({ streak: 0 }),

        setTodayMinutes: (minutes) => set({ todayMinutes: minutes }),

        updateSkillProgress: (skill, pct) =>
          set({ [skill]: Math.min(100, Math.max(0, pct)) }),

        toggleChecklistItem: (item) =>
          set((s) => ({
            todayChecklist: {
              ...s.todayChecklist,
              [item]: !s.todayChecklist[item],
            },
          })),

        setLessonProgress: (lessonId, score) =>
          set((s) => ({
            lessonProgress: {
              ...s.lessonProgress,
              [lessonId]: Math.max(s.lessonProgress[lessonId] ?? 0, score),
            },
          })),

        setLastMock: (result) => set({ lastMock: result }),

        addLearnedWords: (count) =>
          set((s) => ({ totalWordsLearned: s.totalWordsLearned + count })),

        fetchAndSetLessons: async () => {
          set({ lessonsLoading: true })
          try {
            const lessons = await fetchLessons()
            set({ lessons, lessonsLoading: false, lessonsFetched: true })
          } catch {
            set({ lessonsLoading: false, lessonsFetched: true })
          }
        },

        advanceDay: () => {
          const newDay  = get().currentDay + 1
          const newWeek = Math.ceil(newDay / 7)
          set({
            currentDay: newDay,
            currentWeek: newWeek,
            todayMinutes:      0,
            todayXP:           0,
            todayGrammarPct:   0,
            todayVocabPct:     0,
            todayListeningPct: 0,
            todayReadingPct:   0,
            todaySpeakingPct:  0,
            todayWritingPct:   0,
            todayChecklist:    { ...EMPTY_CHECKLIST },
          })
        },

        setLevel: (level) => set({ currentLevel: level }),

        resetDailyProgress: () =>
          set({
            todayMinutes:      0,
            todayXP:           0,
            todayGrammarPct:   0,
            todayVocabPct:     0,
            todayListeningPct: 0,
            todayReadingPct:   0,
            todaySpeakingPct:  0,
            todayWritingPct:   0,
            todayChecklist:    { ...EMPTY_CHECKLIST },
          }),
      }
    },
    {
      name:    'englishpath-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const { lessons: _l, lessonsLoading: _ll, lessonsFetched: _lf, ...rest } = s
        return rest
      },
      merge: (persisted, current) => {
        const { lessonsLoading: _ll, lessonsFetched: _lf, ...rest } = persisted as any
        return { ...current, ...rest, lessonsLoading: false, lessonsFetched: false }
      },
    }
  )
)
