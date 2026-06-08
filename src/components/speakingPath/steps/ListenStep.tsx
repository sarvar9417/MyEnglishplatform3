// Speaking Path — Qadam 1: Eshit (Listen)
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Kunning barcha bloklarini en+uz ko'rsatadi, har biriga TTS 🔊, tezlik selektori.

import { Volume2, Gauge, ArrowRight, BookOpen, VolumeX } from 'lucide-react'
import { useSpeechSynthesis, SPEED_OPTIONS } from '../../../hooks/useSpeechSynthesis'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  onNext: () => void
}

export default function ListenStep({ day, onNext }: Props) {
  const { speak, playing, speed, setSpeed, supported } = useSpeechSynthesis()

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">🔊 Tinglang va tushuning</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Har bir iborani bosib tinglang</p>
      </div>

      {/* Pronunciation Focus — Phase 1 */}
      {day.pronunciationFocus && (
        <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center gap-2">
            <VolumeX size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">Bugungi tovush</span>
          </div>
          <div className="mt-1.5 flex items-start gap-3">
            <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-300 leading-none">{day.pronunciationFocus.sound}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400">{day.pronunciationFocus.ipaExample}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{day.pronunciationFocus.tipUz}</p>
              {day.pronunciationFocus.commonError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">⚠️ {day.pronunciationFocus.commonError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tezlik selektori */}
      {supported && (
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <Gauge size={14} className="text-gray-400" />
          {SPEED_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSpeed(opt.value)}
              className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors
                ${speed === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Bloklar — grammar tip bilan */}
      <div className="space-y-2">
        {day.chunks.map(c => (
          <button
            key={c.id}
            onClick={() => supported && speak(c.en)}
            disabled={!supported}
            className="w-full flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
          >
            <div className="w-10 h-10 mt-0.5 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
              <Volume2 size={18} className="text-primary-600 dark:text-primary-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{c.en}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.uz}</p>
              {c.ipa && <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">{c.ipa}</p>}
              {c.grammarTip && (
                <div className="mt-1 flex items-start gap-1">
                  <BookOpen size={11} className="text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-[10px] leading-tight text-primary-600 dark:text-primary-400">{c.grammarTip}</span>
                </div>
              )}
              {c.stressWord && (
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">🎯 Urg'u: <span className="underline decoration-amber-400">{c.stressWord}</span></span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={playing}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        Tushundim, davom etish <ArrowRight size={16} />
      </button>
    </div>
  )
}
