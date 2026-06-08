import { useState, useEffect, lazy, Suspense } from 'react'
import { SimpleLoadingSkeleton } from './components/ui/PageSkeleton'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { reportWebVitals } from './lib/performance'
import { updatePageMeta } from './lib/seo'
import { useStore } from './store/useStore'
import { useAuth } from './hooks/useAuth'
import { getUserProfile } from './lib/supabase'
import { loadUserState, loadTodayProgress, syncUserState } from './services/stateSync'
import { monitoring } from './lib/monitoring'
import type { Level } from './store/types'
import Sidebar from './components/layout/Sidebar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { Menu, X, WifiOff } from 'lucide-react'
import { I18nProvider, useI18n } from './i18n'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/Toast'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import NotificationInitializer from './components/notifications/NotificationInitializer'
import { LevelUpCelebration } from './components/ui/LevelUpCelebration'
import { XpBurstOverlay } from './components/ui/XpBurst'

// Yangi deploy'dan keyin eski chunk fayllari yo'qoladi. Agar lazy import
// muvaffaqiyatsiz bo'lsa (eski hash), sahifani bir marta qayta yuklab yangi
// versiyani olamiz (cheksiz reload loop'dan saqlanish uchun 10s guard).
function lazyWithReload<T extends { default: React.ComponentType<unknown> }>(factory: () => Promise<T>) {
  return lazy(() =>
    factory().catch((err: unknown) => {
      const last = Number(sessionStorage.getItem('lastChunkReload') || 0)
      if (Date.now() - last > 10_000) {
        sessionStorage.setItem('lastChunkReload', String(Date.now()))
        window.location.reload()
        return new Promise<T>(() => {})  // reload bo'lguncha ushlab turamiz
      }
      throw err
    })
  )
}

const Auth = lazyWithReload(() => import('./pages/Auth'))

// Safe wrapper — agar bitta sahifa crash bo'lsa, boshqalari ishlashda davom etadi
function SafePage({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

const Dashboard = lazyWithReload(() => import('./pages/Dashboard'))
const VocabHub = lazyWithReload(() => import('./pages/VocabHub'))
const LearnHub = lazyWithReload(() => import('./pages/LearnHub'))
const Grammar = lazyWithReload(() => import('./pages/Grammar'))
const MockTest = lazyWithReload(() => import('./pages/MockTest'))
const Chat = lazyWithReload(() => import('./pages/Chat'))
const Listening = lazyWithReload(() => import('./pages/Listening'))
const Reading = lazyWithReload(() => import('./pages/Reading'))
const Writing = lazyWithReload(() => import('./pages/Writing'))
const SkillsPage = lazyWithReload(() => import('./pages/SkillsPage'))
const VocabBattle      = lazyWithReload(() => import('./components/vocabulary/VocabBattle'))
const Profile = lazyWithReload(() => import('./pages/Profile'))
const LessonDemoPage = lazyWithReload(() => import('./pages/LessonDemoPage'))
const GrammarReview = lazyWithReload(() => import('./pages/GrammarReview'))
const Conversation = lazyWithReload(() => import('./pages/Conversation'))
const Pronunciation = lazyWithReload(() => import('./pages/Pronunciation'))
const AiPractice = lazyWithReload(() => import('./pages/AiPractice'))
const ResetPassword = lazyWithReload(() => import('./pages/ResetPassword'))
const TandemPage = lazyWithReload(() => import('./pages/TandemPage'))
const InvitePage = lazyWithReload(() => import('./pages/InvitePage'))
const PhrasalVerbs = lazyWithReload(() => import('./pages/PhrasalVerbs'))
const Idioms = lazyWithReload(() => import('./pages/Idioms'))
const SpeakingPath = lazyWithReload(() => import('./pages/SpeakingPath'))
const PlacementTest = lazyWithReload(() => import('./pages/PlacementTest'))
const NotFound = lazyWithReload(() => import('./pages/NotFound'))

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isOnline = useOnlineStatus()
  const levelUpPending = useStore((s) => s.levelUpPending)
  const clearLevelUp = useStore((s) => s.clearLevelUp)
  const { t } = useI18n()

  return (
    <>
      <NotificationInitializer />
      {levelUpPending && (
        <LevelUpCelebration
          fromLevel={levelUpPending.from}
          toLevel={levelUpPending.to}
          xpEarned={500}
          onDismiss={clearLevelUp}
        />
      )}
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center text-xs font-semibold py-1.5 shadow-md">
          <div className="flex items-center justify-center gap-1.5">
            <WifiOff size={12} className="inline" />
            <span>{t('app.offlineMessage')}</span>
          </div>
        </div>
      )}
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 overflow-y-auto flex flex-col mobile-safe-bottom scrollable">
        {/* Mobile top bar with hamburger */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 lg:hidden min-h-[48px]">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('app.menuLabel')}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">EP</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">EnglishPath</span>
          </div>
          <div className="w-10" />
        </div>

        <Suspense fallback={<SimpleLoadingSkeleton />}>
          <div className="animate-page-enter">
            <Routes>
              <Route path="/" element={<SafePage><Dashboard /></SafePage>} />
              <Route path="/lesson" element={<SafePage><LearnHub /></SafePage>} />
              <Route path="/grammar" element={<SafePage><Grammar /></SafePage>} />
              <Route path="/vocabulary" element={<SafePage><VocabHub /></SafePage>} />
              <Route path="/mock-test" element={<SafePage><MockTest /></SafePage>} />
              <Route path="/vocab-battle"   element={<SafePage><VocabBattle /></SafePage>} />
              <Route path="/tandem"         element={<SafePage><TandemPage /></SafePage>} />
              <Route path="/add/:code"      element={<SafePage><InvitePage /></SafePage>} />
              <Route path="/phrasal-verbs"  element={<SafePage><PhrasalVerbs /></SafePage>} />
              <Route path="/idioms"         element={<SafePage><Idioms /></SafePage>} />
              <Route path="/chat"           element={<SafePage><Chat /></SafePage>} />
              <Route path="/conversation"   element={<SafePage><Conversation /></SafePage>} />
              <Route path="/pronunciation"  element={<SafePage><Pronunciation /></SafePage>} />
              <Route path="/ai-practice"    element={<SafePage><AiPractice /></SafePage>} />
              <Route path="/listening"      element={<SafePage><Listening /></SafePage>} />
              <Route path="/speaking"       element={<Navigate to="/speaking-path?tab=free" replace />} />
              <Route path="/speaking-path"  element={<SafePage><SpeakingPath /></SafePage>} />
              <Route path="/placement-test" element={<SafePage><PlacementTest /></SafePage>} />
              <Route path="/reading"        element={<SafePage><Reading /></SafePage>} />
              <Route path="/writing"        element={<SafePage><Writing /></SafePage>} />
              <Route path="/skills"        element={<SafePage><SkillsPage /></SafePage>} />
              <Route path="/profile"        element={<SafePage><Profile /></SafePage>} />
              <Route path="/lesson-demo"    element={<SafePage><LessonDemoPage /></SafePage>} />
              <Route path="/review"         element={<SafePage><GrammarReview /></SafePage>} />
              {/* Eski bookmarklar uchun redirectlar */}
              <Route path="/achievements"   element={<Navigate to="/profile" replace />} />
              <Route path="/progress"       element={<Navigate to="/profile" replace />} />
              <Route path="/leaders"        element={<Navigate to="/profile" replace />} />
              <Route path="/roadmap"        element={<Navigate to="/" replace />} />
              <Route path="/league"         element={<Navigate to="/" replace />} />
              <Route path="/friends"        element={<Navigate to="/" replace />} />
              <Route path="/practice"       element={<Navigate to="/vocabulary" replace />} />
              <Route path="/business-english" element={<Navigate to="/lesson" replace />} />
              <Route path="/reset-password" element={<SafePage><ResetPassword /></SafePage>} />
              <Route path="*" element={<SafePage><NotFound /></SafePage>} />
            </Routes>
          </div>
        </Suspense>
      </main>
    </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />

    </>
  )
}

// ─── Auth-aware router ────────────────────────────────────────────────────────

function AppRouter() {
  const { session, loading, user } = useAuth()
  const onboardingComplete = useStore((s) => s.onboardingComplete)
  const hydrated = useStore((s) => s._hydrated)

  // ── Clear lesson progress when user changes (prevents cross-user data leakage) ──
  const clearAllLessonProgress = useStore((s) => s.clearAllLessonProgress)
  const prevUserId = useStore((s) => s.prevUserId)
  
  useEffect(() => {
    if (!session?.user?.id) return

    // Foydalanuvchi o'zgargan bo'lsa — eski user ma'lumotlarini TO'LIQ tozalaymiz.
    // Aks holda localStorage'dagi eski profil (ism, streak, XP, avatar) yangi
    // userga "sizib o'tadi" va onboardingComplete=true bo'lgani uchun yangi
    // userning profili hech qachon yuklanmaydi.
    if (prevUserId && prevUserId !== session.user.id) {
      clearAllLessonProgress()
      // IndexedDB'dagi BARCHA user ma'lumotini tozalaymiz (vocabulary, sessions,
      // dailyProgress, writings, mockTests, catalog, stats)
      import('./db/database').then(({ clearLocalUserData }) => clearLocalUserData()).catch(() => {})
      // localStorage: auth-token va theme'dan tashqari HAMMA kalitni o'chiramiz.
      // (Bu yerda localStorage.clear() qilolmaymiz — yangi userning auth tokenini o'chiradi.
      //  Dinamik kalitlar ham qamraladi: review-*, exercise-answers-*, test-state-*)
      try {
        for (const key of Object.keys(localStorage)) {
          // Supabase auth token (sb-...-auth-token) va theme'ni saqlaymiz, qolganini o'chiramiz
          if (key.includes('auth-token') || key === 'theme') continue
          localStorage.removeItem(key)
        }
      } catch { /* ignore */ }
      // User-spetsifik store maydonlarini default'ga qaytaramiz + qayta hidratsiyaga majburlaymiz
      useStore.setState({
        userName: '', userEmail: '',
        onboardingComplete: false, _hydrated: false, lessonsFetched: false,
        lessonProgress: {}, lessonSessions: {},
        currentLevel: 'A2+', currentDay: 1, currentWeek: 1, avatarId: 'scholar',
        streak: 0, totalXP: 0, totalWordsLearned: 0,
        todayMinutes: 0, todayXP: 0,
        todayGrammarPct: 0, todayVocabPct: 0, todayListeningPct: 0, todayReadingPct: 0,
        todaySpeakingPct: 0, todayWritingPct: 0, todayPhrasesPct: 0,
        prevUserId: session.user.id,
      })
    }
  }, [session?.user?.id, prevUserId, clearAllLessonProgress])

  // ── Hydrate store from Supabase when session exists but store is empty ──
  useEffect(() => {
    if (!session || onboardingComplete || hydrated) return

    const hydrate = async () => {
      try {
        const profile = await getUserProfile(session.user.id)
        if (profile) {
          const patch: Record<string, unknown> = {
            userName: profile.name,
            userEmail: profile.email ?? '',
            onboardingComplete: true,
            currentLevel: profile.level as Level,
            currentDay: profile.current_day,
            currentWeek: profile.current_week,
            startDate: profile.start_date,
            targetDate: profile.target_date,
            totalXP: profile.total_xp,
            streak: profile.streak,
            lastActiveDate: profile.last_active ?? '',
            totalWordsLearned: profile.words_learned,
            _hydrated: true,
            prevUserId: session.user.id, // Store current user ID to detect changes
          }

          // Load persisted JSON state (streakBonusesClaimed, dailyGoalMinutes, etc.)
          const savedState = await loadUserState()
          if (savedState) {
            Object.assign(patch, savedState)
          }

          // Load today's daily_progress into today* fields
          const todayProgress = await loadTodayProgress()
          if (todayProgress) {
            const dp = todayProgress as Record<string, unknown>
            patch.todayMinutes = dp.total_minutes ?? 0
            patch.todayXP = dp.xp_earned ?? 0
            patch.todayGrammarPct = dp.grammar_pct ?? 0
            patch.todayVocabPct = dp.vocab_pct ?? 0
            patch.todayListeningPct = dp.listening_pct ?? 0
            patch.todayReadingPct = dp.reading_pct ?? 0
            patch.todaySpeakingPct = dp.speaking_pct ?? 0
            patch.todayWritingPct = dp.writing_pct ?? 0
            patch.todayPhrasesPct = dp.phrases_pct ?? 0
          }

          useStore.setState(patch)
        } else if (user?.user_metadata?.name) {
          // fallback: if no public.users row yet, use auth metadata
          useStore.setState({
            userName: user.user_metadata.name as string,
            onboardingComplete: true,
            _hydrated: true,
            prevUserId: session.user.id,
          })
        }
      } catch (e) {
        monitoring.captureMessage('Failed to hydrate user state from Supabase: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }
    hydrate()
  }, [session, onboardingComplete, hydrated, user])

  // ── Sync store state to Supabase whenever it changes ──
  useEffect(() => {
    if (!session || !hydrated) return

    let timer: ReturnType<typeof setTimeout> | null = null
    const unsub = useStore.subscribe((state) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const { lessons: _l, lessonsLoading: _ll, lessonsFetched: _lf, ...rest } = state
        syncUserState(rest as Record<string, unknown>)
      }, 3000)
    })
    return () => { unsub(); if (timer) clearTimeout(timer) }
  }, [session, hydrated])

  if (loading) {
    return <SimpleLoadingSkeleton />
  }

  if (!session) return <Auth />
  if (!onboardingComplete) return <OnboardingFlow />
  return <AppShell />
}

// ─── Route meta updater (SEO + Web Vitals) ──────────────────────────────────

function RouteMetaUpdater() {
  const location = useLocation()
  const { t } = useI18n()

  useEffect(() => {
    reportWebVitals()
  }, [])

  useEffect(() => {
    const seoKeys: Record<string, keyof import('./i18n').TranslationStrings> = {
      '/': 'seo.dashboard',
      '/lesson': 'seo.lessons',
      '/grammar': 'seo.grammar',
      '/vocabulary': 'seo.vocabulary',
      '/mock-test': 'seo.mockTest',
      '/tandem': 'seo.tandem',
      '/phrasal-verbs': 'seo.phrasalVerbs',
      '/idioms': 'seo.idioms',
      '/chat': 'seo.chat',
      '/conversation': 'seo.conversation',
      '/listening': 'seo.listening',
      '/speaking': 'seo.speaking',
      '/reading': 'seo.reading',
      '/writing': 'seo.writing',
      '/skills': 'seo.skills',
      '/profile': 'seo.profile',
      '/lesson-demo': 'seo.dashboard',
      '/review': 'seo.review',
      '/pronunciation': 'seo.pronunciation',
    }
    const key = seoKeys[location.pathname]
    if (key) {
      updatePageMeta(t(key), t('seo.desc'))
    }
  }, [location.pathname, t])

  return null
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <I18nProvider>
        <RouteMetaUpdater />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
        <ToastContainer />
        <XpBurstOverlay />
      </I18nProvider>
    </BrowserRouter>
  )
}
