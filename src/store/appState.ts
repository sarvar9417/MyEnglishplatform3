import type { AuthSlice } from './authSlice'
import type { ProgressSlice } from './progressSlice'
import type { LessonSlice } from './lessonSlice'

export type AppState = AuthSlice & ProgressSlice & LessonSlice
