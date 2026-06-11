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
  'nav.personalVocabulary': string
  'nav.mockTest': string
  'nav.aiTutor': string
  'nav.profile': string
  'nav.resources': string
  'nav.tandem': string
  'nav.skills': string
  'nav.phrasalVerbs': string
  'nav.idioms': string
  'nav.confusablePairs': string

  /* ── Personal Vocabulary ── */
  'personalVocab.title': string
  'personalVocab.subtitle': string
  'personalVocab.export': string
  'personalVocab.import': string
  'personalVocab.totalWords': string
  'personalVocab.learned': string
  'personalVocab.due': string
  'personalVocab.addWord': string
  'personalVocab.startTest': string
  'personalVocab.searchPlaceholder': string
  'personalVocab.allCategories': string
  'personalVocab.custom': string
  'personalVocab.allLevels': string
  'personalVocab.dueOnly': string
  'personalVocab.loading': string
  'personalVocab.noResults': string
   'personalVocab.emptyState': string
   'personalVocab.flashCardTest': string
   'personalVocab.noWordsForReview': string

   /* ── Sidebar misc ── */
  'sidebar.levelRange': string
  'sidebar.userFallback': string
  'sidebar.dayCount': string        // "Kun {day}/126"
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

  /* ── Offline banner ── */
  'offline.title': string
  'offline.subtitle': string
  'offline.available': string
  'offline.unavailable': string
  'offline.lessons': string
  'offline.vocabulary': string
  'offline.progress': string
  'offline.mockTests': string
  'offline.writing': string
  'offline.speakingPath': string
  'offline.dictionary': string
  'offline.aiFeatures': string
  'offline.tandem': string
  'offline.supabase': string
  'offline.syncPending': string
  'offline.reconnected': string
  'offline.dismiss': string
  'offline.showDetails': string
  'offline.hideDetails': string

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
  'seo.confusablePairs': string
  'seo.desc': string

  /* ── Grammar page titles ── */
  'grammar.presentSimple': string
  'grammar.presentContinuous': string
  'grammar.presentPerfect': string
  'grammar.presentPerfectContinuous': string
  'grammar.pastSimple': string
  'grammar.pastContinuous': string
  'grammar.pastPerfect': string
  'grammar.pastPerfectContinuous': string
  'grammar.futureSimple': string
  'grammar.futureContinuous': string
  'grammar.futurePerfect': string
  'grammar.modalVerbs': string
  'grammar.conditionals': string
  'grammar.passiveVoice': string
  'grammar.reportedSpeech': string
  'grammar.comparatives': string
  'grammar.articles': string
  'grammar.prepositions': string
  'grammar.conjunctions': string
  'grammar.causative': string
  'grammar.gerundInfinitive': string

  /* ── PWA install prompt ── */
  'pwa.installTitle': string
  'pwa.installDesc': string
  'pwa.install': string
  'pwa.dismiss': string
  'pwa.notNow': string
  'pwa.installed': string

  /* ── Auth page ── */
  'auth.tabLogin': string
  'auth.tabSignup': string
  'auth.signupSuccess': string
  'auth.signupResent': string
  'auth.checkEmailStep1': string
  'auth.checkEmailStep2': string
  'auth.checkEmailStep3': string
  'auth.spamTip': string
  'auth.resendButton': string
  'auth.resendCooldown': string
  'auth.backToLogin': string
  'auth.nameLabel': string
  'auth.namePlaceholder': string
  'auth.emailLabel': string
  'auth.emailPlaceholder': string
  'auth.passwordLabel': string
  'auth.passwordPlaceholder': string
  'auth.forgotPassword': string
  'auth.submitLoading': string
  'auth.submitLogin': string
  'auth.submitSignup': string
  'auth.demoButton': string
  'auth.supportText': string
  'auth.resetTitle': string
  'auth.resetSubtitle': string
  'auth.resetSentTitle': string
  'auth.resetSentBody': string
  'auth.resetSentOk': string
  'auth.resetLoading': string
  'auth.resetSubmit': string
  'auth.closeModal': string
  'auth.errorInvalidCredentials': string
  'auth.errorEmailNotConfirmed': string
  'auth.errorAlreadyRegistered': string
  'auth.errorEmailNotFound': string
}
