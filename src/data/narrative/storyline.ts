export interface StoryBeat {
  dayRange: [number, number]
  act: 'prologue' | 'act1' | 'act2' | 'act3' | 'act4' | 'epilogue'
  title: string
  context: string
  lessonHint: string
  location: string
  emoji: string
}

export const STORY_BEATS: StoryBeat[] = [
  {
    dayRange: [1, 4], act: 'prologue',
    title: 'Boshlanish',
    context: 'Bugun safaringiz boshlanadi. 99 kun ichida A1 dan B2 darajasiga yetasiz!',
    lessonHint: 'Ingliz tilini asoslaridan o\'rganishni boshladingiz.',
    location: '1-bosqich', emoji: '✉️',
  },
  {
    dayRange: [5, 27], act: 'act1',
    title: 'A2 — Asoslarni O\'rganish',
    context: 'Har kuni yangi mavzu o\'rganyapsiz. Endi oddiy gaplar tuza olasiz.',
    lessonHint: 'Bu mavzu sizni ingliz tilida erkin gapirishga bir qadam yaqinlashtirdi.',
    location: 'A2 daraja', emoji: '📚',
  },
  {
    dayRange: [28, 55], act: 'act2',
    title: 'B1 — Ishonchli Suhbat',
    context: 'Endi suhbat qura olasiz. Murakkabroq mavzularga o\'tyapsiz.',
    lessonHint: 'Bu mavzu real suhbatlarda javob bera olishingiz uchun juda muhim.',
    location: 'B1 daraja', emoji: '💼',
  },
  {
    dayRange: [56, 78], act: 'act3',
    title: 'B1+ — Professional Til',
    context: 'Professional ingliz tilini o\'rganyapsiz — yig\'ilish, prezentatsiya, email.',
    lessonHint: 'Professional ingliz tili — ish va karyerangizga bevosita foydali.',
    location: 'B1+ daraja', emoji: '🏙️',
  },
  {
    dayRange: [79, 99], act: 'act4',
    title: 'B2 — Yuqori Daraja',
    context: 'Endi murakkab muhokamalar, akademik yozish va IELTS darajasidasiz!',
    lessonHint: 'Siz B2 darajasiga yetib bormoqdasiz — deyarli maqsadingizdasiz!',
    location: 'B2 daraja', emoji: '🌟',
  },
]

export function getStoryBeat(day: number): StoryBeat {
  return STORY_BEATS.find(b => day >= b.dayRange[0] && day <= b.dayRange[1])
    ?? STORY_BEATS[STORY_BEATS.length - 1]
}

// ─── Act display info (shared across UI components) ───────────────────────
export interface ActDisplay {
  label: string
  emoji: string
  color: string
  bgClass: string
  lightBgClass: string
  borderClass: string
  textClass: string
}

export const ACT_DISPLAY: Record<string, ActDisplay> = {
  prologue: {
    label: 'Boshlanish',
    emoji: '🌱',
    color: '#6b7280',
    bgClass: 'bg-gray-500',
    lightBgClass: 'bg-gray-50',
    borderClass: 'border-gray-200',
    textClass: 'text-gray-600 dark:text-gray-400',
  },
  act1: {
    label: '1-qism',
    emoji: '📚',
    color: '#059669',
    bgClass: 'bg-emerald-500',
    lightBgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  act2: {
    label: '2-qism',
    emoji: '💼',
    color: '#2563eb',
    bgClass: 'bg-blue-500',
    lightBgClass: 'bg-sky-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  act3: {
    label: '3-qism',
    emoji: '🏙️',
    color: '#7c3aed',
    bgClass: 'bg-violet-500',
    lightBgClass: 'bg-violet-50',
    borderClass: 'border-violet-200',
    textClass: 'text-violet-600 dark:text-violet-400',
  },
  act4: {
    label: '4-qism',
    emoji: '🌟',
    color: '#d97706',
    bgClass: 'bg-amber-500',
    lightBgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-600 dark:text-amber-400',
  },
  epilogue: {
    label: 'Yakun',
    emoji: '🏆',
    color: '#dc2626',
    bgClass: 'bg-red-500',
    lightBgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-600 dark:text-red-400',
  },
}
