export type Locale = 'uz' | 'en' | 'ru'

export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'uz', label: "O'zbek",  native: "O'zbekcha" },
  { code: 'en', label: 'English', native: 'English'   },
  { code: 'ru', label: 'Русский', native: 'Русский'   },
]

/**
 * Flat key-value translation dictionary.
 * Add new keys here as the app grows.
 */
export interface TranslationStrings {
  /* ── Sidebar navigation ── */
  'nav.dashboard': string
  'nav.lessons': string
  'nav.speakingPath': string
  'nav.vocabulary': string
  'nav.mockTest': string
  'nav.aiTutor': string
  'nav.profile': string
  'nav.resources': string
  'nav.tandem': string
  'nav.skills': string
  'nav.phrasalVerbs': string
  'nav.idioms': string

  /* ── Sidebar misc ── */
  'sidebar.levelRange': string
  'sidebar.userFallback': string
  'sidebar.dayCount': string        // "Kun {day}/90"
  'sidebar.daysLeft': string        // "{days} kun qoldi"
  'sidebar.xpProgress': string      // "{current} / {total} XP"
  'sidebar.themeLight': string
  'sidebar.themeDark': string
  'sidebar.themeSystem': string
  'sidebar.collapse': string
  'sidebar.expand': string
  'sidebar.closeMenu': string
  'sidebar.resourcesAria': string   // label for resources toggle button

  /* ── Mobile bottom nav ── */
  'bottomNav.home': string
  'bottomNav.lesson': string
  'bottomNav.vocab': string
  'bottomNav.grammar': string
  'bottomNav.profile': string
  'bottomNav.speaking': string

  /* ── Common (App shell) ── */
  'app.offlineMessage': string
  'app.menuLabel': string

  /* ── SEO page titles ── */
  'seo.dashboard': string
  'seo.lessons': string
  'seo.vocabulary': string
  'seo.mockTest': string
  'seo.chat': string
  'seo.profile': string
  'seo.tandem': string
  'seo.skills': string
  'seo.phrasalVerbs': string
  'seo.idioms': string
  'seo.grammar': string
  'seo.listening': string
  'seo.speaking': string
  'seo.reading': string
  'seo.writing': string
  'seo.conversation': string
  'seo.pronunciation': string
  'seo.review': string
  'seo.desc': string
}
