import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, Sparkles, Trophy, ChevronRight, Lightbulb, Target,
} from 'lucide-react'
import type { DailyLesson, ReviewLesson } from '../data/dailyLessons'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'
import Breadcrumb from '../components/ui/Breadcrumb'
import type { TranslationStrings } from '../i18n/types'
import { useTandemStore } from '../store/tandemSlice'
import { fetchAllLessonProgress } from '../services/lessonService'
import LessonView from '../components/dailyLesson/LessonView'
import ReviewView from '../components/dailyLesson/ReviewView'
import FriendLessonRecommendation from '../components/dailyLesson/FriendLessonRecommendation'
import { DailyLessonSkeleton } from '../components/ui/PageSkeleton'
import { LESSON_INDEX, type LessonMeta } from '../data/daily/lessonsIndex'
import { getLessonCanDo } from '../data/cefrCanDo'
type LearnTab = 'grammar'

// Mavjud daraja tablari (dars darajalari tartibida)
const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B1+', 'B2'].filter(lv => LESSON_INDEX.some(l => l.level === lv))

const TABS: { id: LearnTab; labelKey: string; emoji: string }[] = [
  { id: 'grammar', labelKey: 'learnHub.tabGrammar', emoji: '📚' },
]

export default function LearnHub() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<LearnTab>('grammar')
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedReview, setSelectedReview] = useState<string | null>(null)
  const { pendingOpponentDuels, loadDuels } = useTandemStore()

  const lessonScores    = useStore((s) => s.lessonProgress)
  const lessonSessions  = useStore((s) => s.lessonSessions)
  const lessons         = useStore((s) => s.lessons)
  const lessonsLoading  = useStore((s) => s.lessonsLoading)
  const lessonsFetched  = useStore((s) => s.lessonsFetched)
  const fetchAndSetLessons = useStore((s) => s.fetchAndSetLessons)
  const setLessonProgress  = useStore((s) => s.setLessonProgress)
  const currentDay   = useStore((s) => s.currentDay)
  const currentLevel = useStore((s) => s.currentLevel)

  // Boshlang'ich daraja: foydalanuvchi currentDay'dagi darsning darajasi →
  // currentLevel (A2+ → A2) → A1 (fallback)
  const { t } = useI18n()

  const [activeLevel, setActiveLevel] = useState<string>(() => {
    const cur = LESSON_INDEX.find(l => l.day === currentDay)
    if (cur) return cur.level
    const want = currentLevel === 'A2+' ? 'A2' : currentLevel
    return LEVELS.includes(want as string) ? (want as string) : 'A1'
  })

  useEffect(() => {
    if (!lessonsFetched && !lessonsLoading) fetchAndSetLessons()
    loadDuels()
  }, [lessonsFetched, lessonsLoading, fetchAndSetLessons, loadDuels])

  useEffect(() => {
    if (lessonsFetched && lessons.length > 0) {
      fetchAllLessonProgress().then((progress) => {
        for (const [lessonId, score] of Object.entries(progress)) {
          setLessonProgress(lessonId, score)
        }
      })
    }
  }, [lessonsFetched, lessons, setLessonProgress])



  if (selected) {
    const item = lessons.find((l) => l.id === selected)
    // Faqat DailyLesson (formulas maydoni bor) LessonView ga uzatiladi
    if (item && 'formulas' in item) return <LessonView key={item.id} lesson={item as DailyLesson} onBack={() => setSelected(null)} />
    // To'liq kontent hali fonda yuklanmoqda — yuklab turamiz, kelgach dars ochiladi
    if (lessonsLoading || !lessonsFetched) return <DailyLessonSkeleton />
  }
  if (selectedReview) {
    const review = lessons.find((r) => r.id === selectedReview) as ReviewLesson | undefined
    if (review) return <ReviewView lesson={review} onBack={() => setSelectedReview(null)} />
    if (lessonsLoading || !lessonsFetched) return <DailyLessonSkeleton />
  }

  function renderGrammarTab() {
    const levelLessons: LessonMeta[] = LESSON_INDEX.filter(l => l.level === activeLevel)

    return (
      <div className="space-y-5">
        {/* ── Header ── */}          <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Sparkles size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">{t('learnHub.headerTitle')}</h1>
            <p className="text-xs text-gray-500">{t('learnHub.headerSubtitle')}</p>
          </div>
        </div>

        {/* ── Daraja tablari (A1 / A2 / B1 / B1+ / B2) ── */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {LEVELS.map(lv => {
            const count = LESSON_INDEX.filter(l => l.level === lv && !l.isReview).length
            const active = lv === activeLevel
            return (
              <button
                key={lv}
                onClick={() => setActiveLevel(lv)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {lv} <span className={`text-xs ${active ? 'text-primary-100' : 'text-gray-400'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* ── Progress Overview ── */}
        {(() => {
          const completed = levelLessons.filter(l => lessonScores[l.id] !== undefined).length
          const notStarted = levelLessons.filter(l => lessonScores[l.id] === undefined && !lessonSessions[l.id]).length
          const inProgress = levelLessons.filter(l => lessonScores[l.id] === undefined && lessonSessions[l.id]).length
          const total = levelLessons.length
          const avgPct = total > 0 ? Math.round(levelLessons.reduce((a, l) => a + (lessonScores[l.id] ?? 0), 0) / total) : 0
          const totalXp = levelLessons.reduce((a, l) => {
            const s = lessonScores[l.id]
            if (s === undefined) return a
            return a + Math.round((s / 100) * l.exercises * 10)
          }, 0)
          return (
            <div className="card bg-gradient-to-br from-gray-50 to-white border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Trophy size={16} className="text-amber-500" />
                  <span className="text-sm font-bold text-gray-900">{t('learnHub.progressTitle')}</span>
                </div>
                <span className="text-xs text-gray-400">{totalXp > 0 ? `+${totalXp} XP` : ''}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{completed}</p>
                  <p className="text-xs text-gray-500">{t('learnHub.progressCompleted')}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-amber-500">{inProgress}</p>
                  <p className="text-xs text-gray-500">{t('learnHub.progressInProgress')}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-300">{notStarted}</p>
                  <p className="text-xs text-gray-500">{t('learnHub.progressPending')}</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">{t('learnHub.progressAvgResult')}</span>
                  <span className={`font-bold ${avgPct >= 80 ? 'text-green-600' : avgPct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{avgPct}%</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-green-500 transition-all duration-500"
                    style={{ width: `${avgPct}%` }} />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {levelLessons.map((l) => {
                  const pct = lessonScores[l.id]
                  const hasSession = !!lessonSessions[l.id]
                  const color = pct !== undefined
                    ? pct >= 80 ? 'bg-green-500'
                      : pct >= 50 ? 'bg-amber-400'
                      : 'bg-red-400'
                    : hasSession ? 'bg-blue-400'
                    : 'bg-gray-200'
                  return (
                    <div key={l.id}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white cursor-help transition-transform hover:scale-125 ${color}`}
                      title={`${l.title}: ${pct !== undefined ? pct + '%' : hasSession ? t('learnHub.progressInProgress') : t('learnHub.progressPending')}`}>
                      {l.day ?? '?'}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* ── Do'stlaringiz o'tgan darslar ── */}
        <FriendLessonRecommendation
          onStartLesson={(id) => setSelected(id)}
        />

        {/* ── Lesson list — odd lessons and reviews in correct order ── */}
        <div className="grid grid-cols-1 gap-3">
          {levelLessons.map(item => {
            if (item.isReview) {
              const review = item
              const pct = lessonScores[review.id]
              return (
                <button
                  key={review.id}
                  onClick={() => setSelectedReview(review.id)}
                  className="text-left flex flex-col gap-3 p-3 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-amber-200 dark:bg-amber-800 rounded-lg flex items-center justify-center">
                        <RefreshCw size={15} className="text-amber-700 dark:text-amber-300" />
                      </span>
                      <div>
                        <h3 className="font-bold text-amber-900 dark:text-amber-200 text-base leading-tight">{review.title}</h3>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{review.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {pct !== undefined && (
                        <span className={`badge text-xs font-bold ${pct >= 80 ? 'bg-green-100 text-green-700' : pct >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{pct}%</span>
                      )}
                      <span className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 text-xs">{review.level}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(review.coversTopics ?? []).map(t => (
                      <span key={t} className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-amber-700 dark:text-amber-400">
                    <span>✍️ {t('learnHub.exercisesCount', { count: review.exercises })}</span>
                    <span>🧪 {t('learnHub.testsCount', { count: review.tests })}</span>
                    <span>{t('learnHub.xpCount', { count: (review.exercises + review.tests) * 10 })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    {pct !== undefined ? t('learnHub.reviewRestart') : t('learnHub.reviewStart')} <ChevronRight size={15} />
                  </div>
                </button>
              )
            }

            const lesson = item
            const pct = lessonScores[lesson.id]
            const session = lessonSessions[lesson.id]
            const tabLabels: Record<string, string> = {
              theory: '📖 ' + t('learnHub.tabTheory'), drill: '⚡ ' + t('learnHub.tabDrill'), reading: "📰 " + t('learnHub.tabReading'),
              speaking: '🎤 ' + t('learnHub.tabSpeaking'), writing: '✍️ ' + t('learnHub.tabWriting'), listening: '🎧 ' + t('learnHub.tabListening'),
            }
            return (
              <button
                key={lesson.id}
                onClick={() => setSelected(lesson.id)}
                className="card-hover text-left flex flex-col gap-3 p-3 sm:p-5 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center font-bold text-primary-700 text-sm">
                      {lesson.day}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">{lesson.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lesson.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {pct !== undefined && (
                      <span className={`badge text-xs font-bold ${pct >= 80 ? 'bg-green-100 text-green-700' : pct >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{pct}%</span>
                    )}
                    <span className="badge border bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600">{lesson.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>📚 {t('learnHub.formulasCount', { count: lesson.formulas })}</span>
                  <span>📝 {t('learnHub.wordsCount', { count: lesson.vocabulary })}</span>
                  <span>✍️ {t('learnHub.exercisesCount', { count: lesson.exercises })}</span>
                  <span>{t('learnHub.xpCount', { count: lesson.exercises * 10 })}</span>
                </div>
                {/* CEFR Can-Do Statement */}
                {(() => {
                  const canDo = getLessonCanDo(lesson.id)
                  if (!canDo) return null
                  return (
                    <div className="flex items-start gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <Target size={12} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-medium">{t('cefrCanDo.lessonCanDo')}</span>{' '}
                        <span className="text-emerald-500 dark:text-emerald-400">{canDo}</span>
                      </span>
                    </div>
                  )
                })()}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    {(pct !== undefined || session) ? t('learnHub.lessonContinue') : t('learnHub.lessonStart')} <ChevronRight size={15} />
                  </div>
                  {session && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {tabLabels[session.tab] ?? session.tab}
                      {session.tab === 'drill' && ` · ${session.currentSection + 1}-bo'lim`}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="card bg-gradient-to-r from-primary-50 to-b2-50 border-primary-100">
          <p className="text-sm text-primary-800 font-medium flex items-center gap-2">
            <Lightbulb size={16} />
            {t('learnHub.tipText')}
          </p>
        </div>

      </div>
    )
  }

  function renderActiveTab() {
    switch (activeTab) {
      case 'grammar': return renderGrammarTab()
    }
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('breadcrumb.lessons') },
      ]} />
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('learnHub.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {t('learnHub.subtitle')}
        </p>
      </div>

      {/* Pending duel banner */}
      {pendingOpponentDuels.length > 0 && (
        <button
          onClick={() => navigate('/tandem')}
          className="w-full flex items-center gap-3 p-3 sm:p-4 mb-5 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20 border border-rose-200 dark:border-rose-800/50 text-left hover:shadow-md active:scale-[0.98] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">⚔️</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-rose-800 dark:text-rose-200">
              {t('learnHub.duelTitle', { count: pendingOpponentDuels.length })}
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
              {t('learnHub.duelSubtitle')}
            </p>
          </div>
          <span className="text-sm text-rose-600 dark:text-rose-400 font-semibold group-hover:gap-1.5 transition-all flex items-center gap-0.5 flex-shrink-0">
            {t('learnHub.duelButton')} <ChevronRight size={15} />
          </span>
        </button>
      )}

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{t(tab.labelKey as keyof TranslationStrings)}</span>
          </button>
        ))}
      </div>

      {renderActiveTab()}
    </div>
  )
}
