// Speaking Path — kunlik sessiya konteyneri (4 qadam)
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Faza 2: Eshit + Shadow ishlaydi. Gapir (Faza 3) va AI suhbat (Faza 4) keyin ulanadi.

import { useState, useRef, useCallback } from 'react'
import { X, Sparkles } from 'lucide-react'
import ListenStep from './steps/ListenStep'
import ShadowStep from './steps/ShadowStep'
import SpeakStep from './steps/SpeakStep'
import ConverseStep from './steps/ConverseStep'
import { saveSpeakingDayProgress, enrollChunks } from '../../services/speakingPathService'
import type { SpeakingDay } from '../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  userId?: string
  onExit: () => void
}

type Step = 'listen' | 'shadow' | 'speak' | 'converse' | 'done'

const STEP_ORDER: Step[] = ['listen', 'shadow', 'speak', 'converse']
const STEP_LABEL: Record<string, string> = {
  listen: 'Eshit', shadow: 'Shadow', speak: 'Gapir', converse: 'Suhbat',
}

export default function SpeakingDaySession({ day, userId, onExit }: Props) {
  const [step, setStep] = useState<Step>('listen')
  const [speakScore, setSpeakScore] = useState(0)
  const [spokenSeconds, setSpokenSeconds] = useState(0)
  const startRef = useRef(Date.now())
  const level = day.cefr === 'A0' ? 'A1' : day.cefr

  // progress: nechta qadam tugagani (done = barcha 4 qadam)
  const doneCount = step === 'done' ? STEP_ORDER.length : STEP_ORDER.indexOf(step)

  // sessiya yakuni — progress DB'ga saqlanadi, kun tugatilgan deb belgilanadi
  const handleComplete = useCallback(() => {
    const secs = Math.round((Date.now() - startRef.current) / 1000)
    setSpokenSeconds(secs)
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
    }
    setStep('done')
  }, [userId, day.day, day.chunks, speakScore])

  const spokenLabel = spokenSeconds < 60
    ? `${spokenSeconds} soniya`
    : `${Math.round(spokenSeconds / 60)} daqiqa`

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

      {/* Progress bar — 4 qadam */}
      <div className="flex gap-1.5">
        {STEP_ORDER.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${i < doneCount ? 'bg-primary-600' : i === doneCount && step !== 'done' ? 'bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <p className={`text-[10px] text-center mt-1 font-semibold ${i <= doneCount ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`}>{STEP_LABEL[s]}</p>
          </div>
        ))}
      </div>

      {/* Joriy qadam */}
      {step === 'listen' && <ListenStep day={day} onNext={() => setStep('shadow')} />}
      {step === 'shadow' && <ShadowStep day={day} level={level} onNext={() => setStep('speak')} />}
      {step === 'speak' && <SpeakStep day={day} userId={userId} onNext={(avg) => { setSpeakScore(avg); setStep('converse') }} />}
      {step === 'converse' && <ConverseStep day={day} level={level} onNext={handleComplete} />}

      {step === 'done' && (
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
          <button
            onClick={onExit}
            className="mt-4 w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all"
          >
            Narvonga qaytish
          </button>
        </div>
      )}
    </div>
  )
}
