import { useState, useCallback } from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { PlacementTest } from './PlacementTest'
import { AvatarSelector } from '../ui/AvatarSelector'
import LessonDemo from '../dailyLesson/LessonDemo'
import { DEMO_LESSONS, SIMPLE_PRESENT_LESSON, type DemoLesson } from '../../data/lessonDemoContent'
import { LevelExplainer } from './LevelExplainer'
import { JourneyPreview } from './JourneyPreview'
import type { Level } from '../../store/types'

type Phase =
  | 'placement'
  | 'welcome'
  | 'name'
  | 'tutorial'
  | 'levels'
  | 'avatar'
  | 'journey'
  | 'ready'

const MIN_NAME_LENGTH = 2

// Map level to appropriate demo lesson
function lessonForLevel(level: string): DemoLesson {
  const map: Record<string, string> = {
    'A1':  'simple-present',
    'A2':  'can-ability-demo',
    'A2+': 'can-ability-demo',
    'B1':  'simple-future',
    'B1+': 'past-continuous',
    'B2':  'present-perfect',
  }
  const key = map[level]
  if (key && DEMO_LESSONS[key]) return DEMO_LESSONS[key]
  return SIMPLE_PRESENT_LESSON
}

// Get placement level-based greeting
function levelGreeting(level: string): { emoji: string; headline: string; sub: string } {
  const greetings: Record<string, { emoji: string; headline: string; sub: string }> = {
    'A1':  { emoji: '🌱', headline: 'Ajoyib boshlanish!', sub: 'Asoslardan boshlaymiz — 126 kunlik B2 sari intensiv yo\'l' },
    'A2':  { emoji: '🌿', headline: 'Yaxshi asos bor ekan!', sub: 'A2 dan B2 sari — 126 kunlik intensiv sayohat' },
    'A2+': { emoji: '🌿', headline: 'Yaxshi asos bor ekan!', sub: 'A2+ dan B2 sari — 126 kunlik intensiv sayohat' },
    'B1':  { emoji: '🌳', headline: 'Ishonchli bilim!', sub: 'B1 dan B2 ga ko\'tarilish — 9 hafta qoldi' },
    'B1+': { emoji: '🌲', headline: 'Kuchli tayyorgarlik!', sub: 'B1+ dan B2 ga — 6 hafta qoldi, deyarli yetdingiz' },
    'B2':  { emoji: '🚀', headline: 'Ajoyib natija!', sub: 'B2 darajasidasiz — marraga 3 hafta qoldi' },
  }
  return greetings[level] ?? { emoji: '🎯', headline: 'Darajangiz aniqlandi!', sub: 'Siz uchun mos dastur tayyor' }
}

export function OnboardingFlow() {
  const { completeOnboarding, avatarId, setAvatarId } = useStore()
  const [phase, setPhase] = useState<Phase>('placement')
  const [name, setName] = useState('')
  const [placementResult, setPlacementResult] = useState<{ level: string; startDay: number } | null>(null)
  const [showTutorial, setShowTutorial] = useState(true)

  // Estimate percentage from level (matches determineLevelFromScore thresholds)
  function pctFromLevel(level: string): number {
    const map: Record<string, number> = {
      'A1':  15,
      'A2':  40,
      'A2+': 50,
      'B1':  60,
      'B1+': 77,
      'B2':  92,
    }
    return map[level] ?? 50
  }

  const handlePlacementComplete = useCallback((result: { level: string; startDay: number }) => {
    setPlacementResult(result)
    setPhase('welcome')
  }, [])

  const handleNext = useCallback(() => {
    const phases: Phase[] = ['welcome', 'name', 'tutorial', 'levels', 'avatar', 'journey', 'ready']
    const idx = phases.indexOf(phase)
    if (idx < phases.length - 1) {
      setPhase(phases[idx + 1])
    }
  }, [phase])

  const handleBack = useCallback(() => {
    const phases: Phase[] = ['welcome', 'name', 'tutorial', 'levels', 'avatar', 'journey', 'ready']
    const idx = phases.indexOf(phase)
    if (idx > 0) {
      setPhase(phases[idx - 1])
    }
  }, [phase])

  // Show placement test first
  if (phase === 'placement') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Branding */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-black text-xl">EP</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              EnglishPath
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Darajangizni aniqlash uchun testdan o'ting
            </p>
          </div>
          <PlacementTest
            onComplete={handlePlacementComplete}
          />
        </div>
      </div>
    )
  }

  // Validate placement result is available
  if (!placementResult) return null

  const pct = pctFromLevel(placementResult.level)
  const tutorial = lessonForLevel(placementResult.level)
  const greeting = levelGreeting(placementResult.level)

  // Calculate progress through phases
  const allPhases: Phase[] = ['welcome', 'name', 'tutorial', 'levels', 'avatar', 'journey', 'ready']
  const currentPhaseIdx = allPhases.indexOf(phase)

  const renderPhaseContent = () => {
    switch (phase) {
      // ─── WELCOME ──────────────────────────────────────────────────
      case 'welcome':
        return (
          <div className="space-y-5 animate-slide-up">
            {/* Score + level result */}
            <div className="text-center">
              <div className="text-7xl mb-3 animate-bounce">{greeting.emoji}</div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                {greeting.headline}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {greeting.sub}
              </p>

              <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 rounded-2xl px-5 py-3 mb-4">
                <Sparkles size={18} className="text-primary-500" />
                <div>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">Sizning darajangiz</p>
                  <p className="text-xl font-black text-primary-700 dark:text-primary-300">{placementResult.level}</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div className="bg-primary-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-400">Test natijasi: {pct}%</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { emoji: '📅', value: `${placementResult.startDay}-kun`, label: 'Boshlanish' },
                { emoji: '🎯', value: 'B2', label: 'Maqsad' },
                { emoji: '⏱️', value: `${126 - placementResult.startDay + 1} kun`, label: 'Qolgan' },
              ].map(stat => (
                <div key={stat.label} className="card text-center py-3">
                  <p className="text-lg">{stat.emoji}</p>
                  <p className="text-sm font-black text-gray-800 dark:text-white">{stat.value}</p>
                  <p className="text-[11px] text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )

      // ─── NAME ────────────────────────────────────────────────────
      case 'name':
        return (
          <div className="space-y-5 animate-slide-up">
            <div className="text-center">
              <span className="text-5xl block mb-3">✍️</span>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
                Ismingizni kiriting
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Platformani siz uchun shaxsiylashtiramiz
              </p>
            </div>

            <div className="space-y-3">
              <input
                className="input text-lg text-center"
                placeholder="Ismingiz..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                autoComplete="name"
              />

              <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} /> Sizni nima kutmoqda
                </p>
                <ul className="space-y-1.5">
                  {[
                    'Haftalik testlar va AI feedback',
                    'Spaced Repetition lug\'at tizimi',
                    '126 kunlik yo\'l xaritasi',
                    'Voice recognition — talaffuz mashqlari',
                    'Real-time gamification va leaderboard',
                  ].map((item, i) => (
                    <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                      <span className="text-primary-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )

      // ─── TUTORIAL ───────────────────────────────────────────────
      case 'tutorial':
        if (!showTutorial) {
          return (
            <div className="text-center space-y-4 animate-fade-in">
              <span className="text-6xl block">⏭️</span>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                Tutorialni o'tkazib yubordingiz
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Keyinroq Lesson Demo dan istalgan vaqtda o'rganishingiz mumkin
              </p>
            </div>
          )
        }
        return (
          <div className="relative">
            {/* Header with skip */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-primary-500 uppercase tracking-wider">
                🎯 Interaktiv demo dars
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                O'tkazib yuborish →
              </button>
            </div>
            <LessonDemo
              onExit={() => setShowTutorial(false)}
              lesson={tutorial}
            />
          </div>
        )

      // ─── LEVELS ──────────────────────────────────────────────────
      case 'levels':
        return (
          <LevelExplainer
            currentLevel={placementResult.level}
            onNext={handleNext}
          />
        )

      // ─── AVATAR ──────────────────────────────────────────────────
      case 'avatar':
        return (
          <div className="space-y-4 animate-slide-up">
            <div className="text-center mb-2">
              <span className="text-4xl block mb-2">🎭</span>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
                Personajingizni tanlang
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Har bir personaj o'ziga xos xarakterga ega
              </p>
            </div>
            <AvatarSelector
              current={avatarId}
              onChange={setAvatarId}
            />
          </div>
        )

      // ─── JOURNEY ────────────────────────────────────────────────
      case 'journey':
        return (
          <JourneyPreview
            currentLevel={placementResult.level}
            startDay={placementResult.startDay}
            onNext={handleNext}
          />
        )

      // ─── READY ───────────────────────────────────────────────────
      case 'ready':
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-5 animate-slide-up">
            <div className="text-7xl animate-bounce">🚀</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Tayyor, {name || 'do\'st'}! 💪
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Bugundan boshlaymiz. 126 kun ichida B2 sari katta yo'l bosasiz!
            </p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {[
                { emoji: '📚', label: 'Kunlik dars', desc: '14 daqiqa' },
                { emoji: '🎯', label: 'Maqsad', desc: 'B2 🇬🇧' },
                { emoji: '⏱️', label: 'Vaqt', desc: `${126 - placementResult.startDay + 1} kun` },
                { emoji: '🌟', label: 'XP ga tayyor', desc: `${Math.min(5000, placementResult.startDay * 50)} XP'ga yaqin'` },
              ].map(item => (
                <div key={item.label} className="card text-center py-3">
                  <p className="text-xl">{item.emoji}</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800 w-full max-w-xs">
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                {placementResult.startDay}-kundan boshlaysiz · {placementResult.level} → B2
              </p>
            </div>

            <button
              onClick={() => {
                completeOnboarding(
                  name.trim() || 'Foydalanuvchi',
                  placementResult.level as Level,
                  placementResult.startDay
                )
              }}
              className="btn-primary w-full max-w-xs py-4 font-bold text-lg flex items-center justify-center gap-2"
            >
              Boshlash! <ChevronRight size={18} />
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        {phase !== 'tutorial' && (
          <div className="flex justify-center gap-1.5 mb-6">
            {allPhases.map((p, i) => (
              <div
                key={p}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${i < currentPhaseIdx ? 'w-1.5 bg-primary-400' : ''}
                  ${i === currentPhaseIdx ? 'w-6 bg-primary-600' : ''}
                  ${i > currentPhaseIdx ? 'w-1.5 bg-gray-200 dark:bg-gray-700' : ''}
                `}
              />
            ))}
          </div>
        )}

        <div className="card shadow-xl p-5 sm:p-6">
          {renderPhaseContent()}

          {/* Navigation buttons (for non-ready, non-tutorial phases) */}
          {phase !== 'ready' && phase !== 'tutorial' && (
            <div className="flex gap-3 mt-6">
              {phase !== 'welcome' && (
                <button className="btn-secondary flex-1" onClick={handleBack}>
                  Orqaga
                </button>
              )}
              <button
                className="btn-primary flex-1"
                disabled={phase === 'name' && name.trim().length < MIN_NAME_LENGTH}
                onClick={handleNext}
              >
                {phase === 'journey' ? 'Tayyorman! 🚀' : 'Keyingi →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
