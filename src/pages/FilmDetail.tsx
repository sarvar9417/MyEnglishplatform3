import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Search, BookOpen, Shuffle, CheckCircle,
  XCircle, Volume2, ChevronLeft, ChevronRight, RotateCcw,
  X, Target, Film, Volume,
  Eye, EyeOff, Zap,
} from 'lucide-react'
import { getFilmById, type FilmWord } from '../data/filmVocabulary'

const PAGE_SIZE = 20

const LEVEL_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'A1': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  'A2': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  'B1': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  'B1+': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  'B2': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500' },
}

function speak(text: string, lang = 'en-US') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = 0.9
  u.pitch = 1
  window.speechSynthesis.speak(u)
  // Chrome/Safari bug: cancel() pauses synthesis — need resume()
  window.speechSynthesis.resume()
}

type PracticeMode = 'list' | 'flashcard' | 'quiz'
type QuizDirection = 'en-uz' | 'uz-en'

export default function FilmDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const film = getFilmById(id ?? '')

  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('list')
  const [page, setPage] = useState(1)
  const [knownWords, setKnownWords] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`film_known_${id}`)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    localStorage.setItem(`film_known_${id}`, JSON.stringify([...knownWords]))
  }, [knownWords, id])

  const toggleKnown = useCallback((word: string) => {
    setKnownWords(prev => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }, [])

  if (!film) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Film size={28} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Film topilmadi</p>
        <button onClick={() => navigate('/films')}
          className="btn-primary text-sm">
          Filmlar ro'yxatiga qaytish
        </button>
      </div>
    )
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return film.words.filter((w) => {
      if (levelFilter !== 'all' && w.level !== levelFilter) return false
      if (!q) return true
      return (
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        w.example.toLowerCase().includes(q)
      )
    })
  }, [film.words, query, levelFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const levels = useMemo(() => {
    return Array.from(new Set(film.words.map(w => w.level))).sort()
  }, [film.words])

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    film.words.forEach(w => { counts[w.level] = (counts[w.level] || 0) + 1 })
    return counts
  }, [film.words])

  const knownCount = knownWords.size

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-5 sm:p-6 text-white animate-fade-in">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-2 -right-2 text-7xl rotate-12">{film.posterEmoji}</div>
          <div className="absolute bottom-0 left-4 text-5xl -rotate-6">📚</div>
        </div>
        <div className="relative z-10">
          <button onClick={() => navigate('/films')}
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-3 transition-colors">
            <ArrowLeft size={16} />
            Filmlar
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">
              {film.posterEmoji}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">{film.title}</h1>
              <p className="text-xs text-white/60 mt-0.5">
                {film.titleUz} · {film.year} · {film.genre}
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">{film.descriptionUz}</p>

          {/* Stats row */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-sm text-xs font-semibold">
              <BookOpen size={12} /> {film.words.length} so'z
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-sm text-xs font-semibold">
              <CheckCircle size={12} /> {knownCount} o'rganilgan
            </span>
            {Object.entries(levelCounts).sort(([a], [b]) => a.localeCompare(b)).map(([lv, count]) => (
              <span key={lv} className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold
                ${LEVEL_COLORS[lv]?.bg || 'bg-gray-100'} ${LEVEL_COLORS[lv]?.text || 'text-gray-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_COLORS[lv]?.dot || 'bg-gray-400'}`} />
                {lv}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-slide-up" style={{ animationDelay: '60ms' }}>
        {([
          { id: 'list' as PracticeMode, label: "So'zlar", icon: BookOpen, count: film.words.length },
          { id: 'flashcard' as PracticeMode, label: 'Flashcard', icon: Shuffle, count: null },
          { id: 'quiz' as PracticeMode, label: 'Test', icon: Target, count: null },
        ]).map(({ id: mode, label, icon: Icon, count }) => (
          <button
            key={mode}
            onClick={() => setPracticeMode(mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200
              ${practiceMode === mode
                ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            {count !== null && (
              <span className="text-[10px] opacity-60">({count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filter (only for list mode) */}
      {practiceMode === 'list' && (
        <div className="animate-fade-in">
          <div className="relative mb-3">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="So'z qidirish..."
              className="input pl-10 pr-10"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => { setLevelFilter('all'); setPage(1) }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${levelFilter === 'all'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}
            >
              Barchasi ({film.words.length})
            </button>
            {levels.map((lv) => {
              const colors = LEVEL_COLORS[lv] || { bg: '', text: '', dot: '' }
              return (
                <button
                  key={lv}
                  onClick={() => { setLevelFilter(lv); setPage(1) }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${levelFilter === lv
                      ? `${colors.bg} ${colors.text} border-current`
                      : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                >
                  {lv} ({film.words.filter(w => w.level === lv).length})
                </button>
              )
            })}
          </div>

          <WordList
            words={paginated}
            totalCount={filtered.length}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            knownWords={knownWords}
            onToggleKnown={toggleKnown}
          />
        </div>
      )}

      {practiceMode === 'flashcard' && (
        <FlashcardMode words={film.words} />
      )}

      {practiceMode === 'quiz' && (
        <QuizMode words={film.words} />
      )}
    </div>
  )
}

/* ─── Word List ────────────────────────────────────────────────────────────── */

function WordList({
  words, totalCount, page, totalPages, onPageChange, knownWords, onToggleKnown,
}: {
  words: FilmWord[]
  totalCount: number
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  knownWords: Set<string>
  onToggleKnown: (word: string) => void
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  if (words.length === 0) {
    return (
      <div className="card text-center py-16 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={24} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">So'z topilmadi</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Boshqa so'z bilan qidirib ko'ring</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-1.5 animate-stagger">
        {words.map((word, idx) => {
          const isKnown = knownWords.has(word.word)
          const colors = LEVEL_COLORS[word.level] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
          return (
            <div
              key={`${word.word}-${page}-${idx}`}
              className={`rounded-xl border overflow-hidden transition-all duration-200
                ${isKnown
                  ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
                }`}
            >
              <div className="flex items-center gap-2 p-3">
                <button
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isKnown ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      {word.word}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                      {word.level}
                    </span>
                    {isKnown && <CheckCircle size={12} className="text-emerald-500 shrink-0" />}
                  </div>
                  <p className={`text-sm mt-0.5 ${isKnown ? 'text-emerald-600/70 dark:text-emerald-400/60' : 'text-primary-600 dark:text-primary-400'}`}>
                    {word.translation}
                  </p>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleKnown(word.word) }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200
                    ${isKnown
                      ? 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                      : 'text-gray-300 dark:text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    }`}
                  title={isKnown ? "O'rganilmagan deb belgilash" : "O'rganilgan deb belgilash"}
                >
                  {isKnown ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(word.word) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600
                    hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shrink-0"
                  title="Eshitish"
                >
                  <Volume2 size={15} />
                </button>
              </div>

              {expandedIdx === idx && (
                <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
                  <div className="mt-2.5 space-y-2">
                    <p className="text-xs text-gray-400 font-mono">{word.phonetic}</p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Misol</p>
                        <button
                          onClick={() => speak(word.example)}
                          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Volume size={10} />
                          Eshitish
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{word.example}"
                      </p>
                      {word.exampleUz && (
                        <p className="text-sm text-primary-600 dark:text-primary-400 mt-1.5 leading-relaxed">
                          "{word.exampleUz}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 tabular-nums">
            {totalCount} ta so'z · {page}/{totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
                hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (page <= 4) {
                pageNum = i + 1
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200
                    ${page === pageNum
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500
                hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Flashcard Mode ──────────────────────────────────────────────────────── */

function FlashcardMode({ words }: { words: FilmWord[] }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffled, setShuffled] = useState<FilmWord[]>(() => shuffleArray([...words]))
  const [known, setKnown] = useState<Set<number>>(new Set())

  const current = shuffled[currentIdx]
  const progress = shuffled.length > 0 ? ((currentIdx + 1) / shuffled.length) * 100 : 0

  const next = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => {
      const n = (i + 1) % shuffled.length
      setTimeout(() => speak(shuffled[n].word), 100)
      return n
    })
  }, [shuffled.length])

  const prev = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => {
      const p = (i - 1 + shuffled.length) % shuffled.length
      setTimeout(() => speak(shuffled[p].word), 100)
      return p
    })
  }, [shuffled.length])

  const reshuffle = useCallback(() => {
    setShuffled(shuffleArray([...words]))
    setCurrentIdx(0)
    setFlipped(false)
    setKnown(new Set())
    setTimeout(() => speak(words[0]?.word), 100)
  }, [words])

  const markKnown = useCallback(() => {
    setKnown(prev => new Set(prev).add(currentIdx))
    next()
  }, [currentIdx, next])

  const markUnknown = useCallback(() => {
    next()
  }, [next])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f) }
      else if (e.key === '1') markUnknown()
      else if (e.key === '2') markKnown()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, markKnown, markUnknown])

  if (shuffled.length === 0) {
    return (
      <div className="card text-center py-16 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <Shuffle size={24} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">So'zlar topilmadi</p>
      </div>
    )
  }

  const colors = LEVEL_COLORS[current.level] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }

  return (
    <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            {currentIdx + 1} / {shuffled.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-emerald-500">
              <Eye size={10} /> {known.size}
            </span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        <button
          onClick={() => {
            if (!flipped) speak(current.word)
            else speak(current.example)
            setFlipped(!flipped)
          }}
          className="w-full aspect-[4/3] rounded-2xl border-2 border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center justify-center
            p-6 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200
            select-none active:scale-[0.98]"
        >
          {!flipped ? (
            <>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold mb-4 ${colors.bg} ${colors.text}`}>
                {current.level}
              </span>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {current.word}
              </p>
              <p className="text-sm text-gray-400 font-mono">{current.phonetic}</p>
              <p className="text-xs text-primary-500 mt-4 flex items-center gap-1">
                <Zap size={12} />
                Tekshirish uchun bosing
              </p>
            </>
          ) : (
            <>
              <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3">
                {current.translation}
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-2.5 max-w-full">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic leading-relaxed">
                  "{current.example}"
                </p>
                {current.exampleUz && (
                  <p className="text-sm text-primary-500 dark:text-primary-400 text-center mt-1.5 leading-relaxed">
                    "{current.exampleUz}"
                  </p>
                )}
              </div>
            </>
          )}
        </button>

        {/* Speaker buttons under card */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => speak(current.word)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
              bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400
              hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Volume2 size={13} />
            So'z
          </button>
          <button
            onClick={() => speak(current.example)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
              bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400
              hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
          >
            <Volume size={13} />
            Misol
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={prev}
          className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <button onClick={markUnknown}
          className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center
            text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors active:scale-95"
          title="O'rganilmagan (1)">
          <XCircle size={20} />
        </button>
        <button onClick={reshuffle}
          className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center
            text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors active:scale-95">
          <RotateCcw size={18} />
        </button>
        <button onClick={markKnown}
          className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center
            text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors active:scale-95"
          title="O'rganilgan (2)">
          <CheckCircle size={20} />
        </button>
        <button onClick={next}
          className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
        ← → harakat · Space aylantirish · 1 noto'g'ri · 2 to'g'ri
      </p>
    </div>
  )
}

/* ─── Quiz Mode ───────────────────────────────────────────────────────────── */

const QUIZ_SIZES = [10, 20, 30] as const

function QuizMode({ words }: { words: FilmWord[] }) {
  const [direction, setDirection] = useState<QuizDirection>('en-uz')
  const [quizSize, setQuizSize] = useState(10)
  const [quizWords, setQuizWords] = useState<FilmWord[]>(() => shuffleArray([...words]).slice(0, quizSize))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const current = quizWords[currentIdx]

  const options = useMemo(() => {
    if (!current) return []
    const correct = direction === 'en-uz' ? current.translation : current.word
    const others = words
      .filter((w) => w.word !== current.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => direction === 'en-uz' ? w.translation : w.word)
    return shuffleArray([correct, ...others])
  }, [current, direction, words])

  const handleAnswer = (opt: string) => {
    if (answered) return
    setAnswered(true)
    setSelectedOpt(opt)
    const correct = direction === 'en-uz' ? current.translation : current.word
    if (opt === correct) {
      setScore((s) => s + 1)
      setStreak(s => s + 1)
      setBestStreak(prev => Math.max(prev, streak + 1))
      speak(current.word)
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    if (currentIdx + 1 >= quizWords.length) {
      setFinished(true)
    } else {
      setCurrentIdx((i) => i + 1)
      setAnswered(false)
      setSelectedOpt(null)
      const next = quizWords[currentIdx + 1]
      if (next) speak(next.word)
    }
  }

  const restart = (size?: number) => {
    const s = size ?? quizSize
    setQuizSize(s)
    const newWords = shuffleArray([...words]).slice(0, s)
    setQuizWords(newWords)
    setCurrentIdx(0)
    setScore(0)
    setAnswered(false)
    setSelectedOpt(null)
    setFinished(false)
    setStreak(0)
    setBestStreak(0)
    if (newWords[0]) speak(newWords[0].word)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (finished) return
      if (answered) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextQuestion() }
        return
      }
      const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 }
      const idx = keyMap[e.key]
      if (idx !== undefined && idx < options.length) {
        e.preventDefault()
        handleAnswer(options[idx])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  if (quizWords.length === 0) {
    return (
      <div className="card text-center py-16 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <Target size={24} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">So'zlar yetarli emas</p>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / quizWords.length) * 100)
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎯' : pct >= 50 ? '📝' : '💪'
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-5xl mb-4">{emoji}</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {score} / {quizWords.length}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {pct >= 90 ? 'Ajoyib natija! Mukammal!' :
           pct >= 70 ? 'Juda yaxshi! Davom eting!' :
           pct >= 50 ? 'Yaxshi harakat! Yana sinab ko\'ring!' :
           pct >= 30 ? 'O\'rtacha. Ko\'proq mashq qiling!' :
           "Qaytadan urinib ko'ring!"}
        </p>

        <div className="flex items-center justify-center gap-6 my-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
            <p className="text-[10px] text-gray-400 font-medium">To'g'ri</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500 dark:text-red-400">{quizWords.length - score}</p>
            <p className="text-[10px] text-gray-400 font-medium">Noto'g'ri</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{pct}%</p>
            <p className="text-[10px] text-gray-400 font-medium">Foiz</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{bestStreak}</p>
            <p className="text-[10px] text-gray-400 font-medium">Eng uzun streak</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button onClick={() => restart()}
            className="btn-primary text-sm">
            Qaytadan
          </button>
          <button onClick={() => { setFinished(false); setCurrentIdx(0); setScore(0); setAnswered(false); setSelectedOpt(null); setStreak(0) }}
            className="btn-secondary text-sm">
            O'zgartirish
          </button>
        </div>
      </div>
    )
  }

  const questionText = direction === 'en-uz' ? current.word : current.translation
  const correctAnswer = direction === 'en-uz' ? current.translation : current.word

  return (
    <div className="max-w-md mx-auto py-4 animate-fade-in">
      {/* Direction toggle + Streak */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            onClick={() => { setDirection('en-uz'); restart() }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
              ${direction === 'en-uz'
                ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            EN → UZ
          </button>
          <button
            onClick={() => { setDirection('uz-en'); restart() }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
              ${direction === 'uz-en'
                ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            UZ → EN
          </button>
        </div>
        {streak >= 2 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/30 animate-pop-in">
            <Zap size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span>
          </div>
        )}
      </div>

      {/* Quiz size selector */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
        <span className="text-[10px] text-gray-400 font-semibold shrink-0 mr-1">SAVOL:</span>
        {QUIZ_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => restart(size)}
            className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all
              ${quizSize === size
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {size}
          </button>
        ))}
        <button
          onClick={() => restart(words.length)}
          className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all
            ${quizSize === words.length
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          Barchasi
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 tabular-nums">
          {currentIdx + 1} / {quizWords.length}
        </span>
        <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold tabular-nums">
          {score} ball
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / quizWords.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 mb-2 font-medium">
          {direction === 'en-uz' ? 'Tarjimasini toping' : 'Inglizchasini toping'}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {questionText}
        </p>
        {!answered && (
          <p className="text-[10px] text-gray-400 mt-2">1-4 tugmalar bilan javob bering</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt, i) => {
          const isCorrect = opt === correctAnswer
          const isSelected = opt === selectedOpt

          let bgClass = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          if (answered) {
            if (isCorrect) bgClass = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600'
            else if (isSelected && !isCorrect) bgClass = 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
            else bgClass = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-40'
          }

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`p-3.5 rounded-xl border text-left font-medium transition-all duration-200 ${bgClass}
                ${!answered ? 'active:scale-[0.98]' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                  ${answered && isCorrect ? 'bg-emerald-500 text-white' :
                    answered && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  {i + 1}
                </span>
                {answered && isCorrect && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
                <span className="text-gray-900 dark:text-gray-100">{opt}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Correct answer hint when wrong */}
      {answered && selectedOpt !== correctAnswer && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 animate-fade-in">
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            <span className="font-semibold">To'g'ri javob:</span> {correctAnswer}
          </p>
        </div>
      )}

      {/* Next */}
      {answered && (
        <button onClick={nextQuestion}
          className="w-full mt-4 py-3 rounded-xl btn-primary animate-slide-up">
          {currentIdx + 1 >= quizWords.length ? "Natijani ko'rish" : 'Keyingisi'}
        </button>
      )}
    </div>
  )
}

/* ─── Utils ───────────────────────────────────────────────────────────────── */

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
