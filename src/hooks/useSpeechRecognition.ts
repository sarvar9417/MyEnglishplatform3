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

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) setIsSupported(false)
  }, [])

  useEffect(() => {
    return () => { recRef.current?.abort() }
  }, [])

  const start = useCallback(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) return

    // Abort previous instance to prevent duplicate recognitions
    recRef.current?.abort()

    const rec = new Ctor()
    rec.lang = 'en-US'
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
      setTranscript(final)
      setInterim(inter)
    }

    rec.onend = () => {
      setInterim('')
      setIsRecording(false)
    }

    rec.onerror = () => {
      setIsRecording(false)
    }

    recRef.current = rec
    rec.start()
    setIsRecording(true)
  }, [])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setIsRecording(false)
    setInterim('')
  }, [])

  const reset = useCallback(() => {
    recRef.current?.abort()
    setTranscript('')
    setInterim('')
    setIsRecording(false)
  }, [])

  return { isSupported, isRecording, transcript, interim, start, stop, reset }
}
