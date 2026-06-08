export type ErrorSeverity = 'fatal' | 'error' | 'warning'

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly userMessage: string,
    public readonly severity: ErrorSeverity = 'error'
  ) {
    super(userMessage)
    this.name = 'AppError'
  }
}

export const ERROR_CODES = {
  SUPABASE_FETCH:    'SUPABASE_FETCH',
  LESSON_NOT_FOUND:  'LESSON_NOT_FOUND',
  AUTH_REQUIRED:     'AUTH_REQUIRED',
  AI_UNAVAILABLE:    'AI_UNAVAILABLE',
  NETWORK_ERROR:     'NETWORK_ERROR',
} as const

export const USER_MESSAGES: Record<keyof typeof ERROR_CODES, string> = {
  SUPABASE_FETCH:   "Ma'lumot yuklanmadi. Internet aloqasini tekshiring.",
  LESSON_NOT_FOUND: 'Dars topilmadi. Qayta urinib ko\'ring.',
  AUTH_REQUIRED:    'Bu funksiyadan foydalanish uchun kirishingiz kerak.',
  AI_UNAVAILABLE:   'AI yordamchi vaqtincha mavjud emas.',
  NETWORK_ERROR:    'Internet aloqasida muammo. Qayta urinib ko\'ring.',
}
