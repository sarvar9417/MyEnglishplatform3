import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createAuthSlice } from './authSlice'
import { createProgressSlice } from './progressSlice'
import { createLessonSlice } from './lessonSlice'

export type { Level, DailyChecklist, MockResult, LessonSessionData } from './types'
export type { AuthSlice } from './authSlice'
export type { ProgressSlice } from './progressSlice'
export type { LessonSlice } from './lessonSlice'

export type AppState = ReturnType<typeof createAuthSlice>
  & ReturnType<typeof createProgressSlice>
  & ReturnType<typeof createLessonSlice>

export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createProgressSlice(...a),
      ...createLessonSlice(...a),
    }),
    {
      name: 'englishpath-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        // Exclude lessons and lesson progress from persistence to prevent cross-user data leakage
        const { 
          lessons: _l, 
          lessonsLoading: _ll, 
          lessonsFetched: _lf, 
          _hydrated: _h,
          lessonProgress: _lp,
          lessonSessions: _ls,
          ...rest 
        } = s
        return rest as AppState
      },
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState>
        const { lessonsLoading: _ll, lessonsFetched: _lf, _hydrated: _h, ...rest } = p
        return { ...current, ...rest, lessonsLoading: false, lessonsFetched: false, _hydrated: false }
      },
      onRehydrateStorage: () => () => {
        useStore.setState({ _hydrated: true })
      },
    }
  )
)
