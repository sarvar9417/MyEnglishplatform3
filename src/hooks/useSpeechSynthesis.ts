// src/hooks/useSpeechSynthesis.ts
// Reactive React hook wrapping src/lib/tts.ts — voice selection, speed control, speaking state
import { monitoring } from '../lib/monitoring'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { speak, stopSpeaking, getVoices, getBestVoice, isSpeaking, isSpeechSupported, type TTSOptions } from '../lib/tts'

export interface VoiceOption {
  name: string
  lang: string
  voice: SpeechSynthesisVoice
}

export const SPEED_OPTIONS = [
  { label: 'Juda sekin', value: 0.5 },
  { label: 'Sekin',      value: 0.7 },
  { label: 'Normal',     value: 0.9 },
  { label: 'Tez',        value: 1.1 },
  { label: 'Juda tez',   value: 1.3 },
] as const

export interface UseSpeechSynthesisReturn {
  /** Whether the browser supports speech synthesis */
  supported: boolean
  /** Whether speech is currently playing */
  playing: boolean
  /** Available voices for the selected language */
  voices: VoiceOption[]
  /** Currently selected voice */
  selectedVoice: VoiceOption | null
  /** Currently selected speed (0.5–1.3) */
  speed: number
  /** Set voice by name */
  setVoice: (name: string) => void
  /** Set playback speed */
  setSpeed: (rate: number) => void
  /** Speak a text string (optional overrideRate to temporarily override global speed) */
  speak: (text: string, overrideRate?: number) => Promise<void>
  /** Stop current speech */
  stop: () => void
  /** Auto-detect and set best voice for a language */
  autoSelectVoice: (lang?: string) => void
}

const STORAGE_KEY = 'tts_preferences'

function loadPrefs(): { voiceName?: string; speed: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    monitoring.captureMessage('loadPrefs (TTS) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* ignore */ }
  return { speed: 0.9 }
}

function savePrefs(prefs: { voiceName?: string; speed: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (e) {
    monitoring.captureMessage('savePrefs (TTS) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* ignore */ }
}

/**
 * React hook for speech synthesis with voice selection, speed control,
 * and localStorage persistence.
 *
 * ```ts
 * const { playing, speak, stop, voices, speed, setSpeed } = useSpeechSynthesis()
 * speak('Hello world')
 * ```
 */
export function useSpeechSynthesis(lang = 'en-US'): UseSpeechSynthesisReturn {
  const prefs = loadPrefs()
  const [playing, setPlaying] = useState(false)
  const [voiceList, setVoiceList] = useState<VoiceOption[]>([])
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null)
  const [speed, setSpeedState] = useState(prefs.speed)
  const playCountRef = useRef(0)

  // Load voices when they become available (they load async)
  const refreshVoices = useCallback(() => {
    const raw = getVoices()
    const filtered = raw
      .filter((v) => v.lang.startsWith(lang.slice(0, 2)) || v.lang.startsWith('en'))
      .map((v) => ({ name: v.name, lang: v.lang, voice: v }))
    setVoiceList(filtered)

    // Try to restore saved voice
    if (prefs.voiceName) {
      const saved = filtered.find((v) => v.name === prefs.voiceName)
      if (saved) {
        setSelectedVoice(saved)
        return
      }
    }
    // Fallback to best available
    const best = getBestVoice(lang)
    if (best) {
      const match = filtered.find((v) => v.voice === best)
      if (match) setSelectedVoice(match)
    }
  }, [lang, prefs.voiceName])

  useEffect(() => {
    refreshVoices()
    // Chrome loads voices asynchronously — listen for the event
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = refreshVoices
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [refreshVoices])

  const setVoice = useCallback((name: string) => {
    const found = voiceList.find((v) => v.name === name)
    if (found) {
      setSelectedVoice(found)
      savePrefs({ voiceName: found.name, speed })
    }
  }, [voiceList, speed])

  const setSpeed = useCallback((rate: number) => {
    setSpeedState(rate)
    savePrefs({ voiceName: selectedVoice?.name, speed: rate })
  }, [selectedVoice])

  const speakText = useCallback(async (text: string, overrideRate?: number) => {
    const id = ++playCountRef.current
    setPlaying(true)
    try {
      const opts: TTSOptions = { rate: overrideRate ?? speed }
      if (selectedVoice) opts.voice = selectedVoice.voice
      await speak(text, opts)
    } finally {
      // Only update if this is still the latest call
      if (id === playCountRef.current && !isSpeaking()) {
        setPlaying(false)
      }
    }
  }, [speed, selectedVoice])

  const stop = useCallback(() => {
    playCountRef.current++
    stopSpeaking()
    setPlaying(false)
  }, [])

  const autoSelectVoice = useCallback((newLang?: string) => {
    const langKey = newLang ?? lang
    const best = getBestVoice(langKey)
    if (best) {
      const match = voiceList.find((v) => v.voice === best)
      if (match) {
        setSelectedVoice(match)
        savePrefs({ voiceName: match.name, speed })
      }
    }
  }, [voiceList, speed, lang])

  // Poll isSpeaking as fallback (Chrome sometimes doesn't fire onend)
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      if (!isSpeaking() && playCountRef.current > 0) {
        setPlaying(false)
        clearInterval(id)
      }
    }, 200)
    return () => clearInterval(id)
  }, [playing])

  return useMemo(() => ({
    supported: isSpeechSupported(),
    playing,
    voices: voiceList,
    selectedVoice,
    speed,
    setVoice,
    setSpeed,
    speak: speakText,
    stop,
    autoSelectVoice,
  }), [playing, voiceList, selectedVoice, speed, setVoice, setSpeed, speakText, stop, autoSelectVoice])
}
