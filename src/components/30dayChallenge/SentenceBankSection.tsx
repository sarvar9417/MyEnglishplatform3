import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Search, Copy, Check, Volume2, Filter, Mic, Square, RotateCcw, Loader2, MessageSquare, List, Edit3, Clock } from 'lucide-react'
import type { SentenceBank, TranscriptSection, Phrase } from '../../data/30dayChallenge'
import { speak, stopSpeaking } from '../../lib/tts'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { evaluateTranslation } from '../../lib/openaiChat'

/** Fisher-Yates shuffle */
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Phrase matnini normalizatsiya qilish (taqqoslash uchun) */
function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s']/g, '').trim()
}

/** StructuredTranscript dan speaker/timestamp ma'lumotlarini phrase ga moslash */
function enrichPhrasesWithDialogue(
  phrases: Phrase[],
  transcript?: TranscriptSection[]
): (Phrase & { _sortKey?: string })[] {
  if (!transcript || transcript.length === 0) return phrases

  // Transcript lines dan lookup map yaratish
  const lookup = new Map<string, { speaker: string; timestamp: string }>()
  for (const section of transcript) {
    for (const line of section.lines) {
      if (line.speaker && line.timestamp) {
        const key = normalizeText(line.text)
        // Faqat birinchi moslikni saqlaymiz
        if (!lookup.has(key)) {
          lookup.set(key, { speaker: line.speaker, timestamp: line.timestamp })
        }
      }
    }
  }

  return phrases.map(p => {
    const key = normalizeText(p.en)
    const match = lookup.get(key)
    if (match) {
      return { ...p, speaker: match.speaker, timestamp: match.timestamp, _sortKey: match.timestamp }
    }
    // Agar to'liq mos kelmasa, uzunroq matnni tekshiramiz (gap ichida qidirish)
    for (const [lineKey, val] of lookup) {
      if (key.includes(lineKey) || lineKey.includes(key)) {
        return { ...p, speaker: val.speaker, timestamp: val.timestamp, _sortKey: val.timestamp }
      }
    }
    // Timestampsiz phrase'lar category nomi bo'yicha sortlanadi
    return { ...p, _sortKey: 'zzz_' + p.en.slice(0, 20) }
  })
}

/** Timestamp string ni sanoqli daqiqalarga aylantirish ('2:35' → 155) */
function timestampToSeconds(ts: string): number {
  if (ts.startsWith('zzz_')) return 99999  // non-dialogue → eng oxiriga
  const parts = ts.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

interface Props {
  sentenceBank: SentenceBank
  structuredTranscript?: TranscriptSection[]
  level?: string
}

type Mode = 'translate' | 'browse'

const MODES: { key: Mode; icon: string; label: string; color: string }[] = [
  { key: 'translate', icon: 'edit',   label: 'Tarjima',   color: 'from-violet-500 to-purple-500' },
  { key: 'browse',    icon: 'list',   label: 'Ko\'rish',   color: 'from-blue-500 to-cyan-500' },
]

const ICON_MAP: Record<string, React.ReactNode> = {
  list: <List size={14} />,
  edit: <Edit3 size={14} />,
}

export default function SentenceBankSection({ sentenceBank, structuredTranscript, level = 'A2' }: Props) {
  const [mode, setMode] = useState<Mode>('browse')

  const categories = sentenceBank.categories
  const allPhrases = useMemo(
    () => sentenceBank.all ?? categories.flatMap(c => c.phrases),
    [categories, sentenceBank.all],
  )

  // ── Browse state ─────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const source = activeCategory
      ? categories.find(c => c.category === activeCategory)?.phrases ?? allPhrases
      : allPhrases
    if (!search.trim()) return source
    const q = search.toLowerCase()
    return source.filter(p => p.en.toLowerCase().includes(q) || p.uz.toLowerCase().includes(q))
  }, [search, activeCategory, categories, allPhrases])

  // ── Browse uchun dialogue-enriched va timestamp bo'yicha sorted view ───
  const browsePhrases = useMemo(() => {
    const enriched = enrichPhrasesWithDialogue(filtered, structuredTranscript)
    return [...enriched].sort((a, b) => timestampToSeconds(a._sortKey!) - timestampToSeconds(b._sortKey!))
  }, [filtered, structuredTranscript])

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {}
  }, [])

  const handleSpeak = useCallback((text: string) => {
    stopSpeaking()
    speak(text, { rate: 0.85 })
  }, [])

  // ── Translate state ─────────────────────────────────────────────────────
  const [trIndex, setTrIndex] = useState(0)
  const [trAnswer, setTrAnswer] = useState('')
  const [trResult, setTrResult] = useState<boolean | null>(null)
  const [trShuffled, setTrShuffled] = useState(true)
  const [trFinished, setTrFinished] = useState(false)
  const [trMicMode, setTrMicMode] = useState(false)
  const [trAiLoading, setTrAiLoading] = useState(false)
  const [trFeedback, setTrFeedback] = useState('')
  const [trFlipped, setTrFlipped] = useState(false)
  const trSR = useSpeechRecognition()
  const trInputRef = useRef<HTMLInputElement>(null)

  const trList = useMemo(() => {
    return trShuffled ? fisherYatesShuffle(filtered) : filtered
  }, [filtered, trShuffled])

  const currentTr = trList[trIndex]

  useEffect(() => {
    if (currentTr) {
      setTrAnswer('')
      setTrResult(null)
      setTrFeedback('')
      setTrMicMode(false)
      trSR.reset()
      trInputRef.current?.focus()
    }
    // trSR har renderda yangi reference → deps ga qo'yilsa micMode har safar o'chib qoladi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTr])

  useEffect(() => {
    if (trMicMode && trSR.transcript) {
      setTrAnswer(trSR.transcript)
    }
  }, [trSR.transcript, trMicMode])

  const trCheckAnswer = useCallback(() => {
    if (!currentTr || !trAnswer.trim()) return

    // Mic ni to'xtatamiz (agar yoqilgan bo'lsa)
    trSR.stop()
    setTrMicMode(false)

    // 1) Quick exact-match (tinish belgilarsiz)
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
    if (normalize(trAnswer) === normalize(currentTr.en)) {
      setTrResult(true)
      return
    }

    // 2) AI evaluation — status maydonini ishlatamiz
    setTrAiLoading(true)
    setTrFeedback('')
    evaluateTranslation(trAnswer, currentTr.en, currentTr.uz, level)
      .then(fb => {
        if (fb.status === 'CORRECT') {
          setTrResult(true)
        } else {
          setTrResult(false)
          setTrFeedback(fb.tip || `Xato. To'g'ri javob: ${currentTr.en}`)
        }
      })
      .catch(() => {
        setTrResult(false)
        setTrFeedback(`Xato. To'g'ri javob: ${currentTr.en}`)
      })
      .finally(() => {
        setTrAiLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTr, trAnswer, level])

  const trNext = useCallback(() => {
    if (trIndex < trList.length - 1) {
      setTrIndex(i => i + 1)
    } else {
      setTrFinished(true)
    }
  }, [trIndex, trList.length])

  const resetTr = useCallback(() => {
    setTrIndex(0)
    setTrAnswer('')
    setTrResult(null)
    setTrFinished(false)
    setTrMicMode(false)
    trSR.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Mode switch ─────────────────────────────────────────────────────────
  const switchMode = useCallback((m: Mode) => {
    setMode(m)
    stopSpeaking()
    trSR.stop() // safe when not recording — recRef.current?.stop() uses optional chaining
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Render: Translate ──────────────────────────────────────────────────
  const renderTranslate = () => {
    if (trList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <Edit3 size={32} className="mb-3 text-gray-300 dark:text-gray-600" />
          <p className="font-medium text-sm">Jumlalar topilmadi</p>
        </div>
      )
    }

    if (trFinished) {
      return (
        <div className="text-center py-12 space-y-4 animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg">
            <Check size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tarjima tugadi!</h3>
          <button
            onClick={resetTr}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            Qaytadan boshlash
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {trIndex + 1} / {trList.length}
          </span>
          <button
            onClick={() => setTrShuffled(s => !s)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              trShuffled
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <RotateCcw size={12} />
            Tasodifiy
          </button>
        </div>

        <div
          onClick={() => setTrFlipped(f => !f)}
          className="relative cursor-pointer perspective-1000 h-40"
        >
          <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${trFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg backface-hidden flex flex-col items-center justify-center text-center">
              <span className="text-xs text-gray-400 mb-3 font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">O'zbekcha</span>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed px-2">{currentTr.uz}</p>
            </div>
            <div className="absolute inset-0 p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-primary-300 dark:border-primary-700 shadow-lg backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-primary-600 dark:text-primary-400 mb-3 font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30">English</span>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed px-2">{currentTr.en}</p>
            </div>
          </div>
        </div>

        {/* Input+buttons — result vaqtida yashirin (faqat result + action buttons) */}
        {trResult === null && (
          <div className="flex gap-2">
            <input
              ref={trInputRef}
              type="text"
              value={trAnswer}
              onChange={e => setTrAnswer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') trCheckAnswer() }}
              placeholder="Ingliz tilida yozing..."
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
            />
            <button
              onClick={trCheckAnswer}
              disabled={!trAnswer.trim()}
              className="px-5 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-40 shadow-md"
            >
              Tekshirish
            </button>
            <button
              onClick={() => {
                if (trSR.isRecording) {
                  const captured = trSR.transcript || trSR.interim || ''
                  trSR.stop()
                  if (captured) setTrAnswer(captured)
                  setTrMicMode(false)
                } else {
                  trSR.reset()
                  trSR.start()
                  setTrMicMode(true)
                }
              }}
              className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                trSR.isRecording
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-700 animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Mic size={18} />
            </button>
          </div>
        )}

        {/* Recording panel — faqat active recording paytida */}
        {trSR.isRecording && trMicMode && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-red-600 dark:text-red-400 font-bold text-sm">Yozib olinmoqda...</span>
            </div>
            {trSR.interim && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">"{trSR.interim}"</p>
            )}
            <div className="text-center">
              <button
                onClick={() => {
                  const captured = trSR.transcript || trSR.interim || ''
                  trSR.stop()
                  if (captured) setTrAnswer(captured)
                  setTrMicMode(false)
                }}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all active:scale-95"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Square size={14} />
                  To'xtatish
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Permission error */}
        {trSR.permissionError && trMicMode && !trSR.isRecording && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Mikrofonga ruxsat berilmagan. Brauzer sozlamalaridan ruxsat bering.
            </p>
          </div>
        )}

        {trResult !== null && (
          <div className={`p-4 rounded-xl text-center font-bold text-sm animate-pop-in ${
            trResult
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}>
            {trResult ? (
              <span className="flex items-center justify-center gap-2">To'g'ri!</span>
            ) : (
              <div className="space-y-2">
                <span className="flex items-center justify-center gap-2">Xato</span>
                {trAiLoading ? (
                  <span className="flex items-center justify-center gap-2 text-sm font-normal">
                    <Loader2 size={14} className="animate-spin" />
                    AI tahlil qilmoqda...
                  </span>
                ) : trFeedback ? (
                  <span className="text-sm font-normal block">{trFeedback}</span>
                ) : (
                  <span className="text-sm font-normal block">To'g'ri javob: <strong className="text-green-600 dark:text-green-400">{currentTr.en}</strong></span>
                )}
              </div>
            )}
          </div>
        )}

        {trResult !== null && (
          <div className="flex gap-2">
            {!trResult && (
              <button
                onClick={() => { setTrResult(null); setTrAnswer(''); setTrFeedback(''); trInputRef.current?.focus() }}
                className="flex-1 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <RotateCcw size={14} />
                  Qayta urinish
                </span>
              </button>
            )}
            <button
              onClick={trNext}
              className={`py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98] shadow-md ${
                trResult
                  ? 'w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'flex-1 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {trResult ? 'Davom etish' : 'Keyingi'}
                <Check size={14} />
              </span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Render: Browse ──────────────────────────────────────────────────────
  const renderBrowse = () => (
    <div className="space-y-3">
      <div className="relative group">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Jumlalarni qidirish..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            showFilters ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Filter size={12} />
          Kategoriyalar
        </button>
        {search && (
          <p className="text-xs text-gray-400">{filtered.length} ta natija topildi</p>
        )}
      </div>

      {showFilters && (
        <div className="flex gap-1.5 flex-wrap animate-slide-down">
          <button
            onClick={() => { setActiveCategory(null); setShowFilters(false) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !activeCategory
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Hammasi ({allPhrases.length})
          </button>
          {categories.map(c => (
            <button
              key={c.category}
              onClick={() => { setActiveCategory(c.category); setShowFilters(false) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === c.category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {c.category} ({c.phrases.length})
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {browsePhrases.map((p, i) => {
          const id = `sent-${activeCategory ?? 'all'}-${i}`
          const isDialogue = p.speaker && p.timestamp

          if (isDialogue) {
            // ── Dialogue-style bubble ───────────────────────────────────
            const speakerColors: Record<string, string> = {
              Massu: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
              Fizu: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
              Waiter: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
              Friend: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
              Stranger: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
              Student: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
            }
            const bubbleColor = speakerColors[p.speaker!] || 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            const speakerInitials: Record<string, string> = {
              Massu: 'M', Fizu: 'F', Waiter: 'W', Friend: 'Fr', Stranger: 'S', Student: 'St',
            }

            return (
              <div key={id} className="group">
                <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${bubbleColor} transition-all hover:shadow-md`}>
                  {/* Speaker avatar */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    p.speaker === 'Massu' ? 'bg-blue-500' :
                    p.speaker === 'Fizu' ? 'bg-purple-500' :
                    p.speaker === 'Waiter' ? 'bg-amber-500' :
                    p.speaker === 'Friend' ? 'bg-green-500' :
                    p.speaker === 'Stranger' ? 'bg-teal-500' : 'bg-gray-500'
                  }`}>
                    {speakerInitials[p.speaker!] || p.speaker![0]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.speaker}</span>
                      {p.timestamp && (
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                          <Clock size={10} />
                          {p.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">{p.en}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed italic">{p.uz}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={() => handleSpeak(p.en)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors active:scale-90"
                      title="Ovoz chiqarib o'qish"
                    >
                      <Volume2 size={13} />
                    </button>
                    <button
                      onClick={() => handleCopy(p.en, id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors active:scale-90"
                      title="Nusxa olish"
                    >
                      {copiedId === id ? (
                        <Check size={13} className="text-green-600 animate-pop-in" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </div>
                {copiedId === id && (
                  <div className="ml-12 mt-1 px-2 py-0.5 rounded-md bg-green-600 text-white text-[10px] font-bold animate-pop-in shadow-lg w-fit">
                    Nusxalandi!
                  </div>
                )}
              </div>
            )
          }

          // ── Normal (non-dialogue) card ────────────────────────────────
          return (
            <div
              key={id}
              className="group relative p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">{p.en}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{p.uz}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 opacity-30 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => handleSpeak(p.en)}
                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors active:scale-90"
                    title="Ovoz chiqarib o'qish"
                  >
                    <Volume2 size={14} />
                  </button>
                  <button
                    onClick={() => handleCopy(p.en, id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors active:scale-90"
                    title="Nusxa olish"
                  >
                    {copiedId === id ? (
                      <Check size={14} className="text-green-600 animate-pop-in" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
              {copiedId === id && (
                <div className="absolute -top-2 right-2 px-2 py-0.5 rounded-md bg-green-600 text-white text-xs font-bold animate-pop-in shadow-lg">
                  Nusxalandi!
                </div>
              )}
            </div>
          )
        })}
      </div>

      {browsePhrases.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <Search size={32} className="mb-3 text-gray-300 dark:text-gray-600" />
          <p className="font-medium text-sm">"{search}" bo'yicha hech narsa topilmadi</p>
          <button onClick={() => setSearch('')} className="mt-3 text-sm text-primary-600 hover:underline font-medium">
            Qidiruvni tozalash
          </button>
        </div>
      )}
    </div>
  )

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
          <MessageSquare size={16} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Jumlalar</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{allPhrases.length} ta ibora</p>
        </div>
      </div>

      <div className="relative flex gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/80 overflow-x-auto scrollbar-thin">
        {MODES.map(m => {
          const isActive = mode === m.key
          return (
            <button
              key={m.key}
              onClick={() => switchMode(m.key)}
              className={`
                relative flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-1
                ${isActive
                  ? 'text-white shadow-lg scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }
              `}
            >
              {isActive && (
                <span className={`absolute inset-0 rounded-xl bg-gradient-to-r ${m.color} animate-gradientMove`} />
              )}
              <span className="relative z-10">{ICON_MAP[m.icon]}</span>
              <span className="relative z-10 hidden sm:inline">{m.label}</span>
            </button>
          )
        })}
      </div>

      {mode === 'translate' && renderTranslate()}
      {mode === 'browse' && renderBrowse()}
    </div>
  )
}
