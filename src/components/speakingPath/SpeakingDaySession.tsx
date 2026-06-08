import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { X, Sparkles, Brain, Volume2, ArrowRight, Clock, Zap, RotateCcw, Check } from 'lucide-react'
import ListenStep from './steps/ListenStep'
import ShadowStep from './steps/ShadowStep'
import SpeakStep from './steps/SpeakStep'
import ConverseStep from './steps/ConverseStep'
import CooldownStep from './steps/CooldownStep'
import WarmupStep from './steps/WarmupStep'
import RecallPanel from './RecallPanel'
import { saveSpeakingDayProgress, enrollChunks, loadSrsMap, computeSRSDistribution, type SRSDistribution } from '../../services/speakingPathService'
import { getSpeakingDay, getChunkById, TOTAL_SPEAKING_DAYS } from '../../data/speakingPath'
import type { SpeakingDay, SpeakingChunk } from '../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  userId?: string
  onExit: () => void
}

type Step = 'review' | 'warmup' | 'listen' | 'shadow' | 'speak' | 'converse' | 'cooldown' | 'done'

const STEP_ORDER: Step[] = ['review', 'warmup', 'listen', 'shadow', 'speak', 'converse', 'cooldown']
const STEP_LABEL: Record<string, string> = {
  review: 'Takrorlash', warmup: 'Kirish', listen: 'Eshit', shadow: 'Shadow', speak: 'Gapir', converse: 'Suhbat', cooldown: 'Mulohaza',
}

export default function SpeakingDaySession({ day, userId, onExit }: Props) {
  const [step, setStep] = useState<Step>(day.recycledChunkIds?.length ? 'review' : 'warmup')
  const [speakScore, setSpeakScore] = useState(0)
  const [spokenSeconds, setSpokenSeconds] = useState(0)
  const [daySrsStats, setDaySrsStats] = useState<{ label: string; count: number; color: string }[] | null>(null)
  const [globalSrsDist, setGlobalSrsDist] = useState<SRSDistribution[] | null>(null)
  const [showGlobalSrs, setShowGlobalSrs] = useState(false)
  const [recycledChunks, setRecycledChunks] = useState<SpeakingChunk[]>([])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewScores, setReviewScores] = useState<number[]>([])
  const [reviewSummary, setReviewSummary] = useState(false)
  const startRef = useRef(Date.now())
  const level = day.cefr === 'A0' ? 'A1' : day.cefr

  // Load recycled chunks from ids
  useEffect(() => {
    if (day.recycledChunkIds && day.recycledChunkIds.length > 0) {
      const chunks = day.recycledChunkIds
        .map(id => getChunkById(id))
        .filter((c): c is SpeakingChunk => c !== undefined)
      setRecycledChunks(chunks)
    }
  }, [day.recycledChunkIds])

  // Agar recycled chunklar bo'lmasa (data yo'q yoki hammasi invalid ID) — review qadamini o'tkazib yuboramiz
  const effectiveStep = step === 'review' && recycledChunks.length === 0 ? 'warmup' : step

  // Faqat recycled chunklari bor kunlarda review qadami ko'rsatiladi
  const hasReview = recycledChunks.length > 0
  const activeSteps: Step[] = hasReview ? STEP_ORDER : STEP_ORDER.filter(s => s !== 'review') as Step[]

  // progress: nechta qadam tugagani
  const doneCount = step === 'done' ? activeSteps.length : activeSteps.indexOf(step)

  // sessiya yakuni — progress DB'ga saqlanadi, kun tugatilgan deb belgilanadi
  // ConverseStep dan keyin → cooldown ga o'tamiz (donedan oldin)
  const handleConversationDone = useCallback(() => {
    const secs = Math.round((Date.now() - startRef.current) / 1000)
    setSpokenSeconds(secs)
    setStep('cooldown')
  }, [])

  // Cool-down dan keyin → done (SRS va progressni saqlaymiz)
  const handleCooldownDone = useCallback(() => {
    const secs = spokenSeconds || Math.round((Date.now() - startRef.current) / 1000)
    if (userId) {
      saveSpeakingDayProgress(userId, {
        day: day.day,
        completed: true,
        bestSpeakScore: speakScore,
        spokenSeconds: secs,
        completedAt: new Date().toISOString(),
      }).catch(() => {})
      // barcha kun bloklarini SRS'ga kafolatli kiritamiz (eksplitsit enrollment)
      enrollChunks(userId, day.chunks.map(c => c.id)).catch(() => {})

      // SRS statistikasini yuklash (non-blocking)
      loadSrsMap(userId).then(map => {
        // Per-day stats (shu kunning chunklari)
        const buckets = [
          { label: 'Yangi', count: 0, color: '#F87171' },
          { label: "O'rganilmoqda", count: 0, color: '#FBBF24' },
          { label: 'Mustahkam', count: 0, color: '#34D399' },
          { label: 'Yodda', count: 0, color: '#8B5CF6' },
        ]
        for (const c of day.chunks) {
          const st = map[c.id]
          if (!st) {
            buckets[0].count++
          } else if (st.stability < 5) {
            buckets[0].count++
          } else if (st.stability < 30) {
            buckets[1].count++
          } else if (st.stability < 90) {
            buckets[2].count++
          } else {
            buckets[3].count++
          }
        }
        setDaySrsStats(buckets.filter(b => b.count > 0))

        // Global SRS distribution (barcha chunklar)
        const globalDist = computeSRSDistribution(map)
        setGlobalSrsDist(globalDist)
      }).catch(() => {})
    }
    setStep('done')
  }, [userId, day.day, day.chunks, speakScore, spokenSeconds])

  const handleReviewDone = useCallback((bestSim: number) => {
    const pct = Math.round(bestSim * 100)
    setReviewScores(prev => [...prev, pct])
    if (reviewIndex < recycledChunks.length - 1) {
      setReviewIndex(i => i + 1)
    } else {
      setReviewSummary(true)
    }
  }, [reviewIndex, recycledChunks.length])

  const handleStartLesson = useCallback(() => {
    setStep('listen')
    setReviewIndex(0)
    setReviewScores([])
    setReviewSummary(false)
  }, [])

  // Resolve review summary — shows average + per-chunk breakdown
  const reviewAvg = reviewScores.length > 0
    ? Math.round(reviewScores.reduce((a, b) => a + b, 0) / reviewScores.length)
    : 0

  const spokenLabel = spokenSeconds < 60
    ? `${spokenSeconds} soniya`
    : `${Math.round(spokenSeconds / 60)} daqiqa`

  const nextDay = useMemo(() => day.day < TOTAL_SPEAKING_DAYS ? getSpeakingDay(day.day + 1) : undefined, [day.day])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 mobile-safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
          <X size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-black text-sm text-gray-900 dark:text-gray-100 truncate">{day.day}-kun · {day.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">🎯 {day.goalUz}</p>
        </div>
      </div>

      {/* Progress bar — review bo'lsa 5, bo'lmasa 4 qadam */}
      <div className="flex gap-1.5">
        {activeSteps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${i < doneCount ? 'bg-primary-600' : i === doneCount && effectiveStep !== 'done' ? 'bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <p className={`text-[10px] text-center mt-1 font-semibold ${i <= doneCount ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`}>{STEP_LABEL[s]}</p>
          </div>
        ))}
      </div>

      {/* 🔄 Takrorlash qadami — RecallPanel bilan SRS scoring */}
      {effectiveStep === 'review' && !reviewSummary && recycledChunks.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800/40">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw size={16} className="text-amber-600 dark:text-amber-400" />
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                Avvalgi kunlardan takrorlash · {reviewIndex + 1} / {recycledChunks.length}
              </p>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Iboralarni esga oling va talaffuz qiling — natijangiz SRS da yangilanadi.
            </p>
          </div>

          <RecallPanel
            key={recycledChunks[reviewIndex].id}
            chunk={recycledChunks[reviewIndex]}
            userId={userId}
            isLast={reviewIndex >= recycledChunks.length - 1}
            onDone={handleReviewDone}
          />
        </div>
      )}

      {/* 🔄 Takrorlash yakuni — qisqacha natija */}
      {effectiveStep === 'review' && reviewSummary && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800/40">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw size={16} className="text-amber-600 dark:text-amber-400" />
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">Takrorlash yakuni</p>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {recycledChunks.length} ta ibora takrorlandi. Endi yangi mavzuga o'tamiz!
            </p>
          </div>

          {/* Umumiy natija */}
          <div className="rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">O'rtacha takrorlash balli</p>
            <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{reviewAvg}%</p>
            <div className="mt-3 space-y-1.5">
              {recycledChunks.map((ch, i) => (
                <div key={ch.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-gray-700 dark:text-gray-300 truncate">{ch.en}</span>
                  <span className={`font-bold shrink-0 ${(reviewScores[i] ?? 0) >= 65 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {(reviewScores[i] ?? 0) >= 65 ? <Check size={14} className="inline" /> : '🔄'} {reviewScores[i] ?? 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartLesson}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] transition-all shadow-md"
          >
            Darsni boshlash →
          </button>
        </div>
      )}

      {/* Asosiy qadamlar */}
      {effectiveStep === 'warmup' && <WarmupStep day={day} onNext={() => setStep('listen')} />}
      {effectiveStep === 'listen' && <ListenStep day={day} onNext={() => setStep('shadow')} />}
      {effectiveStep === 'shadow' && <ShadowStep day={day} level={level} onNext={() => setStep('speak')} />}
      {effectiveStep === 'speak' && <SpeakStep day={day} userId={userId} onNext={(avg) => { setSpeakScore(avg); setStep('converse') }} />}
      {effectiveStep === 'converse' && <ConverseStep day={day} level={level} onNext={handleConversationDone} />}
      {effectiveStep === 'cooldown' && <CooldownStep day={day} speakScore={speakScore} spokenSeconds={spokenSeconds} onNext={handleCooldownDone} />}

      {effectiveStep === 'done' && (
        <div className="space-y-3">
          {/* 🎉 Yakunlash kartasi */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center">
              <Sparkles size={28} className="text-white" />
            </div>
            <p className="mt-3 font-black text-gray-900 dark:text-gray-100">{day.day}-kun yakunlandi! 🎉</p>
            <div className="mt-2 flex items-center justify-center gap-4 text-sm font-semibold">
              <span className="text-gray-700 dark:text-gray-200">🎙️ {spokenLabel}</span>
              <span className="text-gray-700 dark:text-gray-200">⭐ {speakScore}%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Ajoyib! Iboralar takror rejasiga (SRS) yozildi va keyingi kun ochildi.
            </p>
          </div>

          {/* 📊 SRS progress (yuklangan bo'lsa) */}
          {daySrsStats && daySrsStats.length > 0 && (
            <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1.5 mb-3">
                <Brain size={16} className="text-violet-600 dark:text-violet-400" />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">SRS o'zlashtirish</p>
              </div>
              {/* Stacked bar */}
              <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 flex overflow-hidden">
                {daySrsStats.map((b, i) => (
                  <div
                    key={i}
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${(b.count / day.chunks.length) * 100}%`,
                      backgroundColor: b.color,
                    }}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {daySrsStats.map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    {b.label}: {b.count}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🗣️ Pronunciation Focus summary */}
          {day.pronunciationFocus && (
            <div className="rounded-2xl p-4 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800/30">
              <div className="flex items-center gap-1.5 mb-2">
                <Volume2 size={16} className="text-violet-600 dark:text-violet-400" />
                <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Bugungi talaffuz</p>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                /{day.pronunciationFocus.sound}/ — {day.pronunciationFocus.ipaExample}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {day.pronunciationFocus.tipUz}
              </p>
              {day.pronunciationFocus.commonError && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠️ {day.pronunciationFocus.commonError}
                </p>
              )}
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-2 font-semibold">
                Keyingi kunlarda ham shu tovushga e'tibor bering!
              </p>
            </div>
          )}

          {/* 📊 Global SRS distribution (yuklangan bo'lsa) */}
          {globalSrsDist && (
            <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowGlobalSrs(v => !v)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <Brain size={16} className="text-purple-600 dark:text-purple-400" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Umumiy SRS holati</p>
                </div>
                <span className="text-xs text-gray-400">{showGlobalSrs ? '▲' : '▼'}</span>
              </button>

              {showGlobalSrs && (
                <div className="mt-3 animate-slide-up">
                  {/* Stacked bar */}
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 flex overflow-hidden">
                    {globalSrsDist.map((b, i) => (
                      <div
                        key={i}
                        className="h-full transition-all duration-700"
                        style={{
                          width: b.count > 0 ? `${(b.count / globalSrsDist.reduce((s, x) => s + x.count, 0)) * 100}%` : '0%',
                          backgroundColor: b.color,
                        }}
                      />
                    ))}
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {globalSrsDist.map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                        {b.label}: <span className="font-semibold">{b.count}</span>
                      </div>
                    ))}
                  </div>
                  {/* Summary */}
                  <p className="text-[10px] text-gray-400 mt-2 text-center">
                    Jami {globalSrsDist.reduce((s, b) => s + b.count, 0)} ta iboradan {(globalSrsDist[3]?.count || 0) + (globalSrsDist[4]?.count || 0)} tasi o'zlashtirilgan
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ⏭️ Next day preview */}
          {nextDay && (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowRight size={16} className="text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Keyingi kun: {nextDay.day}-kun</p>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{nextDay.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">🎯 {nextDay.goalUz}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {nextDay.estMinutes} daqiqa
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={12} /> {nextDay.chunks.length} ta ibora
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onExit}
            className="w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all"
          >
            Narvonga qaytish
          </button>
        </div>
      )}
    </div>
  )
}
