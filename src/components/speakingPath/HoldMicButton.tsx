// Yagona "bosib turib gapirish" (push-to-talk) mikrofon tugmasi.
// Barcha Speaking Path qadamlari shu komponentni ishlatadi — izchil tajriba.
//
// Mobil ishonchliligi: setPointerCapture bilan barmoq qimirlaganda ham
// pointer tugmada qoladi (onPointerLeave ishlatilmaydi — u mobil'da mikro-
// harakatда yozishni darhol to'xtatib qo'yardi). touch-none + preventDefault
// brauzer scroll/zoom/long-press menyusini bloklaydi.

import { Mic, Square } from 'lucide-react'

interface Props {
  /** Hozir yozilyaptimi (parent holati) */
  isRecording: boolean
  /** Bosilganda yozishni boshlash */
  onStart: () => void
  /** Qo'yib yuborilganda yozishni to'xtatish (va natijani yuborish) */
  onStop: () => void
  disabled?: boolean
  /** Tinch holatdagi yozuv (default: "Bosib turib gapiring") */
  idleLabel?: string
  /** Yozayotgandagi jonli matn (STT interim) — bo'lsa ko'rsatiladi */
  interim?: string
  size?: 'md' | 'lg'
}

export default function HoldMicButton({
  isRecording, onStart, onStop, disabled, idleLabel = 'Bosib turib gapiring', interim, size = 'lg',
}: Props) {
  const dim = size === 'lg' ? 'w-16 h-16' : 'w-14 h-14'

  const start = () => { if (!disabled && !isRecording) onStart() }
  const stop = () => { if (isRecording) onStop() }

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault()
          try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* noop */ }
          start()
        }}
        onPointerUp={(e) => {
          try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* noop */ }
          stop()
        }}
        onPointerCancel={(e) => {
          try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* noop */ }
          stop()
        }}
        onContextMenu={(e) => e.preventDefault()}
        disabled={disabled}
        aria-label={isRecording ? "Yozilmoqda — qo'yib yuboring" : idleLabel}
        className={`${dim} rounded-full flex items-center justify-center text-white shadow-lg transition-all touch-none active:scale-95
          ${isRecording
            ? 'bg-rose-500 animate-pulse ring-4 ring-rose-200 dark:ring-rose-900'
            : 'bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {isRecording
          ? <Square size={size === 'lg' ? 22 : 20} className="text-white" fill="white" />
          : <Mic size={size === 'lg' ? 26 : 22} className="text-white" />}
      </button>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 min-h-[16px] text-center max-w-[220px]">
        {isRecording ? (interim || "Gapiring… (qo'yib yuboring)") : idleLabel}
      </p>
    </div>
  )
}
