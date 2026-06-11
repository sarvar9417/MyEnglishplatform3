// ═══════════════════════════════════════════════════════════════════════════
// Confusable Pairs — page rendering tests
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const mockSupabase = vi.hoisted(() => {
  const qb: Record<string, unknown> = {}
  const chain = () => qb
  const methods = ['select', 'insert', 'upsert', 'update', 'delete', 'eq', 'gte', 'lte',
    'order', 'limit', 'range', 'single', 'maybeSingle', 'in', 'or', 'neq', 'gt', 'lt', 'not']
  for (const m of methods) qb[m] = vi.fn(chain)
  qb.then = vi.fn((f: (x: unknown) => void) => f({ data: [], error: null, count: 0 }))
  qb.catch = vi.fn()
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1' } } },
        error: null,
      }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => qb),
    rpc: vi.fn(() => qb),
  }
})

const mockToast = vi.hoisted(() => vi.fn())
const mockDelayConfusable = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockPushSRS = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

// ─── Module mocks ────────────────────────────────────────────────────────────

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabase }))
vi.mock('../../utils/toastStore', () => ({
  useToastStore: { getState: () => ({ toast: mockToast }) },
}))
vi.mock('../../services/vocabularyService', () => ({
  delayConfusablePartners: mockDelayConfusable,
  pushWordsToSRS_FSRS: mockPushSRS,
}))

// ─── Imports (after mocks) ───────────────────────────────────────────────────

import Confusable from '../Confusable'

function renderPage() {
  return render(<MemoryRouter><Confusable /></MemoryRouter>)
}

/** Find a card button by text content */
function findCard(text: string): HTMLElement | undefined {
  return screen.getAllByRole('button').find(b =>
    b.textContent?.toLowerCase().includes(text.toLowerCase()) &&
    !b.textContent?.includes('Test') &&
    !b.textContent?.includes('Orqaga')
  )
}

describe('Confusable browse view', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('renders page title and description', () => {
    renderPage()
    expect(screen.getByText("Chalkash So'zlar")).toBeInTheDocument()
    expect(screen.getByText(/chalkash/)).toBeInTheDocument()
    expect(screen.getByText("🧪 Test")).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/Qidirish/)).toBeInTheDocument()
  })

  it('filters pairs when searching', () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(input, { target: { value: 'make' } })
    expect(screen.getByText(/make/)).toBeInTheDocument()
    fireEvent.change(input, { target: { value: '' } })
    expect(screen.getByText(/lend/)).toBeInTheDocument()
  })

  it('shows empty state when search matches nothing', () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText(/Qidirish/), { target: { value: 'zzzzz' } })
    expect(screen.getByText('Hech narsa topilmadi')).toBeInTheDocument()
  })

  it('navigates to detail view when clicking a card', () => {
    renderPage()
    const card = findCard('make')
    expect(card).toBeDefined()
    if (card) fireEvent.click(card)
    expect(screen.getByText(/Qoida/)).toBeInTheDocument()
    expect(screen.getByText(/Yodda Saqlash/)).toBeInTheDocument()
    expect(screen.getByText(/Misollar/)).toBeInTheDocument()
  })
})

describe('Confusable detail view', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  function goToDetail() {
    renderPage()
    const card = findCard('make')
    if (card) fireEvent.click(card)
    return card !== undefined
  }

  it('shows rule, memory hook and examples', () => {
    goToDetail()
    // Use getAllByText since /MAKE/ matches multiple elements (title + card)
    const makeElements = screen.getAllByText(/MAKE/)
    expect(makeElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Yodda Saqlash/)).toBeInTheDocument()
    expect(screen.getByText(/Misollar/)).toBeInTheDocument()
  })

  it('shows SRS sections', () => {
    goToDetail()
    expect(screen.getByText(/Sherikni kechiktirish/)).toBeInTheDocument()
    expect(screen.getByText(/SRS ga saqlash/)).toBeInTheDocument()
  })

  it('back button returns to browse', () => {
    goToDetail()
    fireEvent.click(screen.getByText(/Orqaga/))
    expect(screen.getByText("Chalkash So'zlar")).toBeInTheDocument()
  })

  it('delay button calls delayConfusablePartners', async () => {
    goToDetail()
    const btn = screen.getAllByRole('button').find(b =>
      b.textContent?.includes('kechiktirish') && b.textContent?.includes('make')
    )
    expect(btn).toBeDefined()
    if (btn) {
      fireEvent.click(btn)
      await vi.waitUntil(() => mockDelayConfusable.mock.calls.length > 0)
      expect(mockDelayConfusable).toHaveBeenCalledWith('user-1', ['make'])
    }
  })

  it('SRS push button calls pushWordsToSRS_FSRS and shows toast', async () => {
    goToDetail()
    const btn = screen.getAllByRole('button').find(b =>
      b.textContent?.includes('SRS ga') && b.textContent?.includes('make')
    )
    expect(btn).toBeDefined()
    if (btn) {
      fireEvent.click(btn)
      await vi.waitUntil(() => mockPushSRS.mock.calls.length > 0)
      expect(mockPushSRS).toHaveBeenCalled()
      expect(mockToast).toHaveBeenCalledWith(
        expect.stringContaining('saqlandi'),
        'success'
      )
    }
  })
})

describe('Confusable quiz view', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  function goToQuiz() {
    renderPage()
    fireEvent.click(screen.getByText("🧪 Test"))
  }

  it('shows quiz with progress and options', () => {
    goToQuiz()
    expect(screen.getByText(/Orqaga/)).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    // Should have back button + at least 2 answer options + next button
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it('selecting an answer shows explanation', async () => {
    goToQuiz()
    // Find an answer option (not back or next)
    const opt = screen.getAllByRole('button').find(b =>
      /^[A-D]$/.test(b.textContent?.trim()?.charAt(0) ?? '') &&
      !b.textContent?.includes('Orqaga') &&
      !b.textContent?.includes('Keyingi')
    )
    expect(opt).toBeDefined()
    if (opt) {
      fireEvent.click(opt)
      await waitFor(() => {
        expect(screen.getByText(/Izoh/)).toBeInTheDocument()
      })
    }
  })
})
