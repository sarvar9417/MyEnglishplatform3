// Speaking Path — qayta ishlatiladigan mikrofon tugmasi
// Reja: docs/speaking-path-roadmap.md (Faza 2/3)
// useSpeechRecognition (STT) ni o'raydi: bosilganda yozadi, qayta bosilganda
// to'xtaydi va transcript'ni onResult orqali qaytaradi. STT yo'q brauzerda
// disabled holatda ko'rsatiladi (parent fallback beradi).

import { useEffect, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

interface Props {
  onResult: (transcript: string) => void
  /** STT qo'llab-quvvatlanmasligi haqida parent'ni xabardor qilish */
  onSupportChange?: (supported: boolean) => void
  label?: string
  disabled?: boolean
}

export default function MicButton({ onResult, onSupportChange, label = 'Gapiring', disabled }: Props) {
  const { isSupported, isRecording, transcript, interim, start, stop, reset } = useSpeechRecognition()
  const wasRecording = useRef(false)

  useEffect(() => {
    onSupportChange?.(isSupported)
  }, [isSupported, onSupportChange])

  // yozish tugagan paytni ushlaymiz → transcript'ni qaytaramiz
  useEffect(() => {
    if (wasRecording.current && !isRecording) {
      const t = transcript.trim()
      if (t) onResult(t)
    }
    wasRecording.current = isRecording
  }, [isRecording, transcript, onResult])

  const toggle = () => {
    if (isRecording) {
      stop()
    } else {
      reset()
      start()
    }
  }

  if (!isSupported) {
    return (
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        🎤 Mikrofon bu brauzerda ishlamaydi
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={toggle}
        disabled={disabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95
          ${isRecording
            ? 'bg-rose-500 animate-pulse ring-4 ring-rose-200 dark:ring-rose-900'
            : 'bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        aria-label={isRecording ? "To'xtatish" : label}
      >
        {isRecording ? <Square size={22} className="text-white" fill="white" /> : <Mic size={26} className="text-white" />}
      </button>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 min-h-[16px] text-center">
        {isRecording ? (interim || 'Tinglayapman…') : label}
      </p>
    </div>
  )
}
