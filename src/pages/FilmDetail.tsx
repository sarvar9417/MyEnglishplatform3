import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Search, BookOpen, Shuffle, CheckCircle,
  XCircle, Volume2, ChevronLeft, ChevronRight, RotateCcw,
} from 'lucide-react'
import { getFilmById, type FilmWord } from '../data/filmVocabulary'

type PracticeMode = 'list' | 'flashcard' | 'quiz'
type QuizDirection = 'en-uz' | 'uz-en'

export default function FilmDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const film = getFilmById(id ?? '')

  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('list')

  if (!film) {
    return (
      <div className="p-6 text-center">
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

  const levels = useMemo(() => {
    const set = new Set(film.words.map(w => w.level))
    return Array.from(set).sort()
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
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {film.descriptionUz}
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {([
          { id: 'list' as PracticeMode, label: "So'zlar ro'yxati", icon: BookOpen },
          { id: 'flashcard' as PracticeMode, label: 'Flashcard', icon: Shuffle },
          { id: 'quiz' as PracticeMode, label: 'Test', icon: CheckCircle },
        ]).map(({ id: mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setPracticeMode(mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="So'z qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setLevelFilter('all')}
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
                onClick={() => setLevelFilter(lv)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${levelFilter === lv
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {lv}
              </button>
            ))}
          </div>

          <WordList words={filtered} />
        </>
      )}

      {practiceMode === 'flashcard' && (
        <FlashcardMode words={filtered} />
      )}

      {practiceMode === 'quiz' && (
        <QuizMode words={filtered} />
      )}
    </div>
  )
}

/* ─── Word List ────────────────────────────────────────────────────────────── */

function WordList({ words }: { words: FilmWord[] }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">So'z topilmadi</p>
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
    <div className="space-y-2">
      {words.map((word, idx) => (
        <div
          key={`${word.word}-${idx}`}
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
            <Volume2 size={16} className="text-gray-400 shrink-0" />
          </button>

          {expandedIdx === idx && (
            <div className="px-3.5 pb-3.5 border-t border-gray-100 dark:border-gray-800">
              <div className="mt-2.5 space-y-1.5">
                <p className="text-xs text-gray-400">{word.phonetic}</p>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">Misol:</p>
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
  )
}

/* ─── Flashcard Mode ──────────────────────────────────────────────────────── */

function FlashcardMode({ words }: { words: FilmWord[] }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffled, setShuffled] = useState<FilmWord[]>(() => shuffleArray([...words]))

  const current = shuffled[currentIdx]

  const next = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => (i + 1) % shuffled.length)
  }, [shuffled.length])

  const prev = useCallback(() => {
    setFlipped(false)
    setCurrentIdx((i) => (i - 1 + shuffled.length) % shuffled.length)
  }, [shuffled.length])

  const reshuffle = useCallback(() => {
    setShuffled(shuffleArray([...words]))
    setCurrentIdx(0)
    setFlipped(false)
  }, [words])

  if (shuffled.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        So'zlar topilmadi
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Counter */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {currentIdx + 1} / {shuffled.length}
      </p>

      {/* Card */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full max-w-sm aspect-[3/2] rounded-2xl border-2 border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center justify-center
          p-6 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all
          select-none active:scale-[0.98]"
      >
        {!flipped ? (
          <>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {current.word}
            </p>
            <p className="text-sm text-gray-400">{current.phonetic}</p>
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
            <p className="text-xs text-gray-400 mt-2">{current.level}</p>
          </>
        )}
      </button>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button onClick={prev}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={reshuffle}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <RotateCcw size={18} />
        </button>
        <button onClick={next}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        ← → tugmalar bilan boshqaring
      </p>
    </div>
  )
}

/* ─── Quiz Mode ───────────────────────────────────────────────────────────── */

function QuizMode({ words }: { words: FilmWord[] }) {
  const [direction, setDirection] = useState<QuizDirection>('en-uz')
  const [quizWords, setQuizWords] = useState<FilmWord[]>(() => shuffleArray([...words]).slice(0, 10))
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
      .filter((w) => w !== current)
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
    if (opt === correct) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (currentIdx + 1 >= quizWords.length) {
      setFinished(true)
    } else {
      setCurrentIdx((i) => i + 1)
      setAnswered(false)
      setSelectedOpt(null)
    }
  }

  const restart = () => {
    setQuizWords(shuffleArray([...words]).slice(0, 10))
    setCurrentIdx(0)
    setScore(0)
    setAnswered(false)
    setSelectedOpt(null)
    setFinished(false)
  }

  if (quizWords.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        So'zlar yetarli emas
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / quizWords.length) * 100)
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center
          bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
          <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{pct}%</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {score} / {quizWords.length} to'g'ri
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {pct >= 80 ? 'Ajoyib natija!' : pct >= 50 ? 'Yaxshi harakat!' : "Qaytadan urinib ko'ring!"}
        </p>
        <button onClick={restart}
          className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
          Qaytadan boshlash
        </button>
      </div>
    )
  }

  const questionText = direction === 'en-uz' ? current.word : current.translation

  return (
    <div className="max-w-md mx-auto py-4">
      {/* Direction toggle */}
      <div className="flex gap-1 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
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

      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">
          {currentIdx + 1} / {quizWords.length}
        </span>
        <span className="text-xs text-primary-600 font-medium">
          {score} ball
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-5">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
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
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const correct = direction === 'en-uz' ? current.translation : current.word
          const isCorrect = opt === correct
          const isSelected = opt === selectedOpt

          let bgClass = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-300'
          if (answered) {
            if (isCorrect) bgClass = 'bg-green-50 dark:bg-green-900/20 border-green-400'
            else if (isSelected && !isCorrect) bgClass = 'bg-red-50 dark:bg-red-900/20 border-red-400'
            else bgClass = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
          }

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`p-3.5 rounded-xl border text-left font-medium transition-all ${bgClass}`}
            >
              <div className="flex items-center gap-2">
                {answered && isCorrect && <CheckCircle size={18} className="text-green-500 shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
                <span className="text-gray-900 dark:text-gray-100">{opt}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Next */}
      {answered && (
        <button onClick={nextQuestion}
          className="w-full mt-5 py-3 rounded-xl bg-primary-600 text-white font-medium
            hover:bg-primary-700 transition-colors">
          {currentIdx + 1 >= quizWords.length ? 'Natijani ko\'rish' : 'Keyingisi'}
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
