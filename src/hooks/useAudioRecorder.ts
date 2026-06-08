import { useState, useRef, useCallback, useEffect } from 'react'

export interface AudioRecorderState {
  isSupported: boolean
  isRecording: boolean
  duration: number
  audioUrl: string | null
  audioBlob: Blob | null
  start: () => Promise<void>
  stop: () => Promise<string | null>
  reset: () => void
}

function getMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return ''
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus'
  if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4'
  if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm'
  return ''
}

export function useAudioRecorder(): AudioRecorderState {
  const [isSupported] = useState(() => {
    return !!(typeof navigator.mediaDevices?.getUserMedia === 'function' && typeof MediaRecorder !== 'undefined' && getMimeType())
  })

  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)

  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const start = useCallback(async () => {
    if (!isSupported) return
    reset()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = getMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)

        stream.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }

      recorder.start(100)
      setIsRecording(true)
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 200)
    } catch {
      setIsRecording(false)
    }
  }, [isSupported])

  const stop = useCallback(async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return null

    return new Promise<string | null>((resolve) => {
      if (!mediaRecorderRef.current) return resolve(null)

      const recorder = mediaRecorderRef.current

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: getMimeType() || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)

        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        setIsRecording(false)
        timerRef.current && clearInterval(timerRef.current)

        resolve(url)
      }

      recorder.stop()
    })
  }, [])

  const reset = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    mediaRecorderRef.current = null
    chunksRef.current = []
    timerRef.current && clearInterval(timerRef.current)
    if (audioUrl) URL.revokeObjectURL(audioUrl)

    setIsRecording(false)
    setDuration(0)
    setAudioUrl(null)
    setAudioBlob(null)
  }, [audioUrl])

  return { isSupported, isRecording, duration, audioUrl, audioBlob, start, stop, reset }
}
