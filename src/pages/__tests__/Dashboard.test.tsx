/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const mockStoreState = vi.hoisted(() => ({
  currentLevel: 'B1',
  currentWeek: 3,
  currentDay: 15,
  streak: 5,
  targetDate: '2026-10-01',
  userName: 'TestUser',
  dailyGoalMinutes: 120,
  todayGrammarPct: 70,
  todayVocabPct: 50,
  todayListeningPct: 30,
  todayReadingPct: 40,
  todaySpeakingPct: 10,
  todayWritingPct: 80,
  todayMinutes: 30,
  todayXP: 100,
  totalXP: 1500,
  lessonProgress: {} as Record<string, number>,
  lessons: [] as any[],
  lastActiveDate: '2026-06-15',
  totalWordsLearned: 25,
  avatarId: '',
  // Actions
  fetchAndSetLessons: vi.fn(),
}))

const mockAuth = vi.hoisted(() => ({
  displayName: 'Ali',
  signOut: vi.fn(),
}))

const mockProgress = vi.hoisted(() => ({
  todayProgress: {
    date: '2026-06-15',
    grammar_pct: 70,
    vocab_pct: 50,
    listening_pct: 30,
    reading_pct: 40,
    speaking_pct: 10,
    writing_pct: 80,
  },
  lastMockTest: null,
  dbStreak: 5,
  loading: false,
  error: null,
  recentGrammar: [],
  recentListening: [],
  recentReading: [],
  recentSpeaking: [],
  recentWriting: [],
  refresh: vi.fn(),
  upsertTodayProgress: vi.fn(),
}))

// ─── Supabase mock container (populated by vi.mock factory) ──────────────
const mockSupabase = vi.hoisted(() => ({}) as Record<string, unknown>)

// ─── Supabase mock — uses shared buildQB via vi.importActual ───────────────
vi.mock('../../lib/supabase', async () => {
  const { buildQB } = await vi.importActual('../../test/supabaseMock')
  const qb = buildQB().qb as unknown as Record<string, unknown>
  ;(qb as unknown as Promise<unknown>).then = (onfulfilled: (v: unknown) => void) =>
    Promise.resolve({ data: [], error: null, count: 0 }).then(onfulfilled)
  ;(qb as unknown as Promise<unknown>).catch = (onrejected: (v: unknown) => void) =>
    Promise.resolve({ data: [], error: null, count: 0 }).catch(onrejected)

  const supabase = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => qb),
    rpc: vi.fn(() => qb),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({ subscribe: vi.fn(() => 'SUBSCRIBED') })),
      send: vi.fn(),
    })),
    removeChannel: vi.fn(),
  }

  Object.assign(mockSupabase, supabase)
  return { supabase }
})

// ─── Module mocks ────────────────────────────────────────────────────────────

vi.mock('../../store/useStore', () => ({
  useStore: Object.assign(
    (selector?: (state: typeof mockStoreState) => unknown) =>
      selector ? selector(mockStoreState) : mockStoreState,
    { getState: () => mockStoreState, setState: vi.fn(), subscribe: vi.fn() }
  ),
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockAuth,
}))

vi.mock('../../hooks/useProgress', () => ({
  useProgress: () => mockProgress,
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
  addDaysTashkent: (d: number) => {
    const date = new Date('2026-06-15T00:00:00Z')
    date.setUTCDate(date.getUTCDate() + d)
    return date.toISOString().split('T')[0]
  },
}))

vi.mock('../../components/notifications/StreakWarning', () => ({
  default: () => <div data-testid="streak-warning">Streak Warning</div>,
}))

vi.mock('../../components/notifications/ReviewReminder', () => ({
  default: () => <div data-testid="review-reminder">Review Reminder</div>,
}))

// ─── Imports (after mocks) ───────────────────────────────────────────────────

import Dashboard from '../Dashboard'

function renderPage() {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )
}

describe('Dashboard — page integration tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T10:00:00Z'))
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
    mockStoreState.currentLevel = 'B1'
    mockStoreState.streak = 5
    mockStoreState.userName = 'TestUser'
    mockStoreState.lessons = []
    mockStoreState.lessonProgress = {}
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    cleanup()
  })

  // ── TopBar ─────────────────────────────────────────────────────────────────

  it('renders greeting and user name in TopBar', () => {
    renderPage()
    expect(screen.getByText('Xayrli kun')).toBeInTheDocument()
    expect(screen.getByText('Ali 👋')).toBeInTheDocument()
  })

  it('renders level badge with current week/day', () => {
    renderPage()
    expect(screen.getByText('B1')).toBeInTheDocument()
    const haftaElements = screen.getAllByText(/3-hafta/)
    expect(haftaElements.length).toBeGreaterThanOrEqual(1)
    // dayInWeek = ((15-1)%7)+1 = 1
    const kunElements = screen.getAllByText(/1-kun/)
    expect(kunElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders streak count', () => {
    renderPage()
    expect(screen.getByText('streak')).toBeInTheDocument()
    expect(screen.getAllByText(/5 kun/).length).toBeGreaterThan(0)
  })

  it('renders days left to target', () => {
    renderPage()
    // targetDate is 2026-10-01, current date is 2026-06-15 → 108 days
    expect(screen.getByText(/108 kun/)).toBeInTheDocument()
  })

  it('renders logout button and triggers signOut on click', () => {
    renderPage()
    const logoutBtn = screen.getByTitle('Chiqish')
    expect(logoutBtn).toBeInTheDocument()
    fireEvent.click(logoutBtn)
    expect(mockAuth.signOut).toHaveBeenCalledOnce()
  })

  // ── TodayProgress ──────────────────────────────────────────────────────────

  it('renders TodayProgress section with skill rings', () => {
    renderPage()
    expect(screen.getByText('Bugungi Skill Progress')).toBeInTheDocument()
    expect(screen.getByText("O'rtacha 47%")).toBeInTheDocument()
    const grammarElements = screen.getAllByText('Grammar')
    expect(grammarElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("Lug'at")).toBeInTheDocument()
    expect(screen.getAllByText('Listening').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Reading').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Speaking').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Writing').length).toBeGreaterThanOrEqual(1)
  })

  // ── LessonProgressCard ─────────────────────────────────────────────────────

  it('does not render lesson progress when lessons array is empty', () => {
    renderPage()
    expect(screen.queryByText('Kunlik Darslar')).not.toBeInTheDocument()
  })

  it('renders lesson progress when lessons exist', () => {
    mockStoreState.lessons = [
      { id: 'l1', title: 'Present Simple' },
      { id: 'l2', title: 'Past Simple' },
    ]
    mockStoreState.lessonProgress = { l1: 80, l2: 30 }
    renderPage()
    expect(screen.getByText('Kunlik Darslar')).toBeInTheDocument()
    expect(screen.getByText('Present Simple')).toBeInTheDocument()
    expect(screen.getByText('Past Simple')).toBeInTheDocument()
    expect(screen.getByText('Bajarildi:')).toBeInTheDocument()
    expect(screen.getByText('2/2')).toBeInTheDocument()
  })

  // ── Alert sections ─────────────────────────────────────────────────────────

  it('renders streak warning and review reminder', () => {
    renderPage()
    expect(screen.getByTestId('streak-warning')).toBeInTheDocument()
    expect(screen.getByTestId('review-reminder')).toBeInTheDocument()
  })

  // ── Edge: user name falls back to store userName ───────────────────────────

  it('uses store userName when displayName is not available', () => {
    (mockAuth as unknown as { displayName: string | undefined }).displayName = undefined
    renderPage()
    expect(screen.getByText('TestUser 👋')).toBeInTheDocument()
    mockAuth.displayName = 'Ali'
  })

  // ── Edge: streak from useProgress overrides store streak ───────────────────

  it('uses dbStreak from useProgress when available', () => {
    mockProgress.dbStreak = 10
    renderPage()
    const tenElements = screen.getAllByText('10')
    expect(tenElements.length).toBeGreaterThanOrEqual(1)
    mockProgress.dbStreak = 5
  })
})
