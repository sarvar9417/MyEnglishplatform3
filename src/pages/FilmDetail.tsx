import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Search, BookOpen, Shuffle, CheckCircle,
  XCircle, Volume2, ChevronLeft, ChevronRight, RotateCcw,
  X, Target, Trophy, Film, Volume,
} from 'lucide-react'
import { getFilmById, type FilmWord } from '../data/filmVocabulary'

const PAGE_SIZE = 20

function speak(text: string, lang = 'en-US') {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = 0.9
  u.pitch = 1
  window.speechSynthesis.speak(u)
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

  if (!film) {
    return (
      <div className="p-6 text-center">
        <Film size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 mb-4">Film topilmadi</p>
        <button onClick={() => navigate('/films')}
          className="text-primary-600 hover:underline text-sm">
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
    const set = new Set(film.words.map(w => w.level))
    return Array.from(set).sort()
  }, [film.words])

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    film.words.forEach(w => { counts[w.level] = (counts[w.level] || 0) + 1 })
    return counts
  }, [film.words])

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <button onClick={() => navigate('/films')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-3 transition-colors">
          <ArrowLeft size={16} />
          Filmlar
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100
            dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-2xl">
            {film.posterEmoji}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {film.title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {film.titleUz} • {film.year} • {film.genre}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {film.descriptionUz}
        </p>

        {/* Stats chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold
            bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            <BookOpen size={12} /> {film.words.length} so'z
          </span>
          {Object.entries(levelCounts).sort(([a], [b]) => a.localeCompare(b)).map(([lv, count]) => (
            <span key={lv} className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-semibold
              ${lv === 'A1' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                lv === 'A2' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                lv === 'B1' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                lv === 'B1+' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
              {lv}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {([
          { id: 'list' as PracticeMode, label: "So'zlar", icon: BookOpen },
          { id: 'flashcard' as PracticeMode, label: 'Flashcard', icon: Shuffle },
          { id: 'quiz' as PracticeMode, label: 'Test', icon: Target },
        ]).map(({ id: mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setPracticeMode(mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all
              ${practiceMode === mode
                ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Search & Filter (only for list mode) */}
      {practiceMode === 'list' && (
        <>
          <div className="relative mb-3">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="So'z qidirish..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => { setLevelFilter('all'); setPage(1) }}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${levelFilter === 'all'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Barchasi ({film.words.length})
            </button>
            {levels.map((lv) => (
              <button
                key={lv}
                onClick={() => { setLevelFilter(lv); setPage(1) }}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${levelFilter === lv
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {lv} ({film.words.filter(w => w.level === lv).length})
              </button>
            ))}
          </div>

          <WordList words={paginated} totalCount={filtered.length} page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
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

function WordList({ words, totalCount, page, totalPages, onPageChange }: { words: FilmWord[]; totalCount: number; page: number; totalPages: number; onPageChange: (p: number) => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  if (words.length === 0) {
    return (
      <div className="card text-center py-12">
        <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">So'z topilmadi</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Boshqa so'z bilan qidiring</p>
      </div>
    )
  }

  const LEVEL_COLORS: Record<string, string> = {
    'A1': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'A2': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'B1': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'B1+': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'B2': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <>
      <div className="space-y-2">
        {words.map((word, idx) => (
          <div
            key={`${word.word}-${page}-${idx}`}
            className="rounded-xl border border-gray-100 dark:border-gray-800
              bg-white dark:bg-gray-900 overflow-hidden transition-all"
          >
          <button
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {word.word}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${LEVEL_COLORS[word.level] ?? ''}`}>
                  {word.level}
                </span>
              </div>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">
                {word.translation}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); speak(word.word) }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shrink-0"
              title="Eshitish"
            >
              <Volume2 size={16} />
            </button>
          </button>

          {expandedIdx === idx && (
            <div className="px-3.5 pb-3.5 border-t border-gray-100 dark:border-gray-800">
              <div className="mt-2.5 space-y-1.5">
                <p className="text-xs text-gray-400 font-mono">{word.phonetic}</p>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Misol</p>
                    <button
                      onClick={() => speak(word.example)}
                      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Volume size={10} />
                      Eshitish
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{word.example}"
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">
            {totalCount} ta so'z • {page}/{totalPages}
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
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                    ${page === pageNum
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
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

  const current = shuffled[currentIdx]
  const progress = shuffled.length > 0 ? ((currentIdx + 1) / shuffled.length) * 100 : 0

  const next = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => {
      const next = (i + 1) % shuffled.length
      setTimeout(() => speak(shuffled[next].word), 100)
      return next
    })
  }, [shuffled.length])

  const prev = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => {
      const prev = (i - 1 + shuffled.length) % shuffled.length
      setTimeout(() => speak(shuffled[prev].word), 100)
      return prev
    })
  }, [shuffled.length])

  const reshuffle = useCallback(() => {
    setShuffled(shuffleArray([...words]))
    setCurrentIdx(0)
    setFlipped(false)
    setTimeout(() => speak(words[0]?.word), 100)
  }, [words])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  if (shuffled.length === 0) {
    return (
      <div className="card text-center py-12">
        <Shuffle size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">So'zlar topilmadi</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentIdx + 1} / {shuffled.length}
          </span>
          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
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
          className="w-full aspect-[3/2] rounded-2xl border-2 border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center justify-center
            p-6 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all
            select-none active:scale-[0.98]"
        >
          {!flipped ? (
            <>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {current.word}
              </p>
              <p className="text-sm text-gray-400 font-mono">{current.phonetic}</p>
              <p className="text-xs text-primary-500 mt-3">Tap to reveal</p>
            </>
          ) : (
            <>
              <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {current.translation}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                "{current.example}"
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium
                  ${current.level === 'A1' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    current.level === 'A2' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    current.level === 'B1' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    current.level === 'B1+' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {current.level}
                </span>
              </div>
            </>
          )}
        </button>

        {/* Speaker buttons under card */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={() => speak(current.word)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400
              hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Volume2 size={14} />
            So'z
          </button>
          <button
            onClick={() => speak(current.example)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400
              hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
          >
            <Volume size={14} />
            Misol
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={prev}
          className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={reshuffle}
          className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center
            text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
          <RotateCcw size={18} />
        </button>
        <button onClick={next}
          className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500">
        ← → harakat • Space / Enter — aylantirish
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
      speak(current.word)
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
      <div className="card text-center py-12">
        <Target size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">So'zlar yetarli emas</p>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / quizWords.length) * 100)
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center
          bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
          {pct >= 80 ? (
            <Trophy size={40} className="text-purple-600 dark:text-purple-400" />
          ) : (
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{pct}%</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {score} / {quizWords.length} to'g'ri
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {pct >= 90 ? 'Ajoyib natija! Mukammal!' :
           pct >= 80 ? 'Juda yaxshi! Davom eting!' :
           pct >= 60 ? 'Yaxshi harakat! Yana sinab ko\'ring!' :
           pct >= 40 ? 'O\'rtacha. Ko\'proq mashq qiling!' :
           "Qaytadan urinib ko'ring!"}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{score}</p>
            <p className="text-[10px] text-gray-400">To'g'ri</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{quizWords.length - score}</p>
            <p className="text-[10px] text-gray-400">Noto'g'ri</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{pct}%</p>
            <p className="text-[10px] text-gray-400">Foiz</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button onClick={() => restart()}
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
            Qaytadan
          </button>
          <button onClick={() => { setFinished(false); setCurrentIdx(0); setScore(0); setAnswered(false); setSelectedOpt(null) }}
            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            O'zgartirish
          </button>
        </div>
      </div>
    )
  }

  const questionText = direction === 'en-uz' ? current.word : current.translation
  const correctAnswer = direction === 'en-uz' ? current.translation : current.word

  return (
    <div className="max-w-md mx-auto py-4">
      {/* Direction toggle */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => { setDirection('en-uz'); restart() }}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all
            ${direction === 'en-uz'
              ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          EN → UZ
        </button>
        <button
          onClick={() => { setDirection('uz-en'); restart() }}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all
            ${direction === 'uz-en'
              ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          UZ → EN
        </button>
      </div>

      {/* Quiz size selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-400">Savollar:</span>
        {QUIZ_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => restart(size)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
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
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
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
        <span className="text-xs text-gray-500">
          {currentIdx + 1} / {quizWords.length}
        </span>
        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
          {score} ball
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-5">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / quizWords.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 mb-2">
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
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => {
          const isCorrect = opt === correctAnswer
          const isSelected = opt === selectedOpt

          let bgClass = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
          if (answered) {
            if (isCorrect) bgClass = 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
            else if (isSelected && !isCorrect) bgClass = 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
            else bgClass = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
          }

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`p-3.5 rounded-xl border text-left font-medium transition-all ${bgClass}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                  {i + 1}
                </span>
                {answered && isCorrect && <CheckCircle size={18} className="text-green-500 shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
                <span className="text-gray-900 dark:text-gray-100">{opt}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Correct answer hint when wrong */}
      {answered && selectedOpt !== correctAnswer && (
        <div className="mt-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400">
            <span className="font-semibold">To'g'ri javob:</span> {correctAnswer}
          </p>
        </div>
      )}

      {/* Next */}
      {answered && (
        <button onClick={nextQuestion}
          className="w-full mt-4 py-3 rounded-xl bg-primary-600 text-white font-medium
            hover:bg-primary-700 transition-colors">
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
