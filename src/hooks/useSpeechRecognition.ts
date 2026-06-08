import { useState, useRef, useEffect, useCallback } from 'react'

interface SrAlternative { readonly transcript: string }
interface SrResult { readonly isFinal: boolean; readonly length: number; readonly [i: number]: SrAlternative }
interface SrResultList { readonly length: number; readonly [i: number]: SrResult }
interface SrEvent extends Event { readonly results: SrResultList; readonly resultIndex: number }

type SrCtor = new () => {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SrEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: Event) => void) | null
}

declare global {
  interface Window { SpeechRecognition?: SrCtor; webkitSpeechRecognition?: SrCtor }
}

export interface SpeechRecognitionState {
  isSupported: boolean
  isRecording: boolean
  transcript: string
  interim: string
  start(): void
  stop(): void
  reset(): void
}

export function useSpeechRecognition(): SpeechRecognitionState {
  const [isSupported, setIsSupported] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const recRef = useRef<InstanceType<SrCtor> | null>(null)
  // Final va interim natijalarni ref'da saqlaymiz — stop()/onend paytida ishlatish uchun
  const transcriptRef = useRef('')
  const interimRef = useRef('')

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) setIsSupported(false)
  }, [])

  useEffect(() => {
    return () => { try { recRef.current?.abort() } catch { /* noop */ } }
  }, [])

  const start = useCallback(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) return

    // Avvalgi instansiyani to'xtatamiz (dublikat tanishni oldini olish)
    try { recRef.current?.abort() } catch { /* noop */ }

    transcriptRef.current = ''
    interimRef.current = ''

    const rec = new Ctor()
    rec.lang = 'en-US'
    // continuous=true HAMMA qurilmada: foydalanuvchi STOP bosgunicha tinglaydi.
    // (Mobil non-continuous rejimda pauzada o'z-o'zidan tugab, stop'ni buzar edi.)
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (e: SrEvent) => {
      let final = ''
      let inter = ''
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) final += r[0].transcript + ' '
        else inter = r[0].transcript
      }
      if (final) { transcriptRef.current = final; setTranscript(final) }
      interimRef.current = inter
      setInterim(inter)
    }

    rec.onend = () => {
      // Mobil: final kelmasdan onend bo'lishi mumkin → interim'ni natija sifatida olamiz
      if (!transcriptRef.current.trim() && interimRef.current.trim()) {
        transcriptRef.current = interimRef.current.trim()
        setTranscript(interimRef.current.trim())
      }
      setInterim('')
      setIsRecording(false)
    }

    rec.onerror = () => {
      setIsRecording(false)
    }

    recRef.current = rec
    try { rec.start() } catch { /* noop */ }
    setIsRecording(true)
  }, [])

  const stop = useCallback(() => {
    // Final hali kelmagan bo'lsa, interim'ni natija sifatida olamiz (mobil ishonchliligi)
    if (!transcriptRef.current.trim() && interimRef.current.trim()) {
      transcriptRef.current = interimRef.current.trim()
      setTranscript(interimRef.current.trim())
    }
    // Mobil Chrome'da stop() onend'ni ishonchli ishga tushirmaydi — shuning uchun
    // holatni darhol o'zimiz yangilaymiz (UI darrov javob beradi, natija yuboriladi).
    try { recRef.current?.stop() } catch { /* noop */ }
    setInterim('')
    setIsRecording(false)
  }, [])

  const reset = useCallback(() => {
    try { recRef.current?.abort() } catch { /* noop */ }
    transcriptRef.current = ''
    interimRef.current = ''
    setTranscript('')
    setInterim('')
    setIsRecording(false)
  }, [])

  return { isSupported, isRecording, transcript, interim, start, stop, reset }
}
