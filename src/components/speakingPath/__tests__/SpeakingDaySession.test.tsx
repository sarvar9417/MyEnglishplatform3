import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import type { SpeakingDay } from '../../../data/speakingPath/types'

// ── Mock service funksiyalari ──
const { mockSaveProgress, mockEnrollChunks } = vi.hoisted(() => ({
  mockSaveProgress: vi.fn(() => Promise.resolve()),
  mockEnrollChunks: vi.fn(() => Promise.resolve()),
}))

vi.mock('../../../services/speakingPathService', () => ({
  saveSpeakingDayProgress: mockSaveProgress,
  enrollChunks: mockEnrollChunks,
}))

// ── Mock 4 step komponentlari (level conversion testi uchun saqlaymiz) ──
const capturedLevel = { current: '' }

vi.mock('../steps/ListenStep', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="listen-step">
      <button data-testid="mock-listen-next" onClick={onNext}>Listen → Shadow</button>
    </div>
  ),
}))

vi.mock('../steps/ShadowStep', () => ({
  default: ({ level, onNext }: { level: string; onNext: () => void }) => {
    capturedLevel.current = level
    return (
      <div data-testid="shadow-step">
        <button data-testid="mock-shadow-next" onClick={onNext}>Shadow → Speak</button>
      </div>
    )
  },
}))

vi.mock('../steps/SpeakStep', () => ({
  default: ({ onNext }: { onNext: (avg: number) => void }) => (
    <div data-testid="speak-step">
      <button data-testid="mock-speak-next" onClick={() => onNext(85)}>Speak → Converse</button>
    </div>
  ),
}))

vi.mock('../steps/ConverseStep', () => ({
  default: ({ level, onNext }: { level: string; onNext: () => void }) => {
    capturedLevel.current = level
    return (
      <div data-testid="converse-step">
        <button data-testid="mock-converse-next" onClick={onNext}>Converse → Done</button>
      </div>
    )
  },
}))

import SpeakingDaySession from '../SpeakingDaySession'

const makeDay = (overrides?: Partial<SpeakingDay>): SpeakingDay => ({
  day: 3,
  cefr: 'A0',
  title: 'Raqamlar va yosh',
  subtitle: 'Test',
  goalUz: 'Yoshingizni ayta olasiz',
  chunks: [
    { id: 'sp-d3-c1', en: 'I am twenty', uz: 'Men yigirmaman' },
    { id: 'sp-d3-c2', en: 'How old', uz: 'Necha yosh' },
  ],
  scenario: { topic: 'age', aiRole: 'friend', userRole: 'you', opening: 'How old?', goalUz: 'test' },
  estMinutes: 12,
  ...overrides,
})

afterEach(() => { cleanup(); vi.clearAllMocks() })
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

describe('SpeakingDaySession', () => {
  it('header bilan day ma\'lumotlarini ko\'rsatadi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)
    expect(screen.getByText(/3-kun/)).toBeInTheDocument()
    expect(screen.getByText(/Raqamlar va yosh/)).toBeInTheDocument()
    expect(screen.getByText(/Yoshingizni ayta olasiz/)).toBeInTheDocument()
  })

  it('boshlang\'ich holatda ListenStep ko\'rinadi, progress bar 0/4', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)
    expect(screen.getByTestId('listen-step')).toBeInTheDocument()
    expect(screen.getByTestId('mock-listen-next')).toBeInTheDocument()
    // 4 qadam label
    expect(screen.getByText('Eshit')).toBeInTheDocument()
    expect(screen.getByText('Shadow')).toBeInTheDocument()
    expect(screen.getByText('Gapir')).toBeInTheDocument()
    expect(screen.getByText('Suhbat')).toBeInTheDocument()
  })

  it('Listen → Shadow → Speak → Converse ketma-ketlikda o\'tadi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)

    // Qadam 1: Listen → Shadow
    fireEvent.click(screen.getByTestId('mock-listen-next'))
    expect(screen.getByTestId('shadow-step')).toBeInTheDocument()

    // Qadam 2: Shadow → Speak
    fireEvent.click(screen.getByTestId('mock-shadow-next'))
    expect(screen.getByTestId('speak-step')).toBeInTheDocument()

    // Qadam 3: Speak → Converse (avg=85)
    fireEvent.click(screen.getByTestId('mock-speak-next'))
    expect(screen.getByTestId('converse-step')).toBeInTheDocument()
  })

  it('Converse tugagandan so\'ng done ekrani ko\'rinadi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)

    // 4 qadamni tez o'tamiz
    fireEvent.click(screen.getByTestId('mock-listen-next'))
    fireEvent.click(screen.getByTestId('mock-shadow-next'))
    fireEvent.click(screen.getByTestId('mock-speak-next'))
    fireEvent.click(screen.getByTestId('mock-converse-next'))

    expect(screen.getByText(/3-kun yakunlandi/)).toBeInTheDocument()
    expect(screen.getByText(/85%/)).toBeInTheDocument() // speakScore=85
  })

  it('done ekranida "Narvonga qaytish" tugmasi onExit ni chaqiradi', () => {
    const onExit = vi.fn()
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={onExit} />)

    fireEvent.click(screen.getByTestId('mock-listen-next'))
    fireEvent.click(screen.getByTestId('mock-shadow-next'))
    fireEvent.click(screen.getByTestId('mock-speak-next'))
    fireEvent.click(screen.getByTestId('mock-converse-next'))

    fireEvent.click(screen.getByText('Narvonga qaytish'))
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('userId bilan tugaganda saveSpeakingDayProgress va enrollChunks chaqiriladi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)

    fireEvent.click(screen.getByTestId('mock-listen-next'))
    fireEvent.click(screen.getByTestId('mock-shadow-next'))
    fireEvent.click(screen.getByTestId('mock-speak-next'))
    fireEvent.click(screen.getByTestId('mock-converse-next'))

    expect(mockSaveProgress).toHaveBeenCalledWith('u1', expect.objectContaining({
      day: 3,
      completed: true,
      bestSpeakScore: 85,
    }))
    expect(mockEnrollChunks).toHaveBeenCalledWith('u1', ['sp-d3-c1', 'sp-d3-c2'])
  })

  it('userId yo\'q bo\'lsa save/enroll chaqirilmaydi', () => {
    render(<SpeakingDaySession day={makeDay()} onExit={vi.fn()} />)

    fireEvent.click(screen.getByTestId('mock-listen-next'))
    fireEvent.click(screen.getByTestId('mock-shadow-next'))
    fireEvent.click(screen.getByTestId('mock-speak-next'))
    fireEvent.click(screen.getByTestId('mock-converse-next'))

    expect(mockSaveProgress).not.toHaveBeenCalled()
    expect(mockEnrollChunks).not.toHaveBeenCalled()
  })

  it('X tugmasi onExit ni chaqiradi', () => {
    const onExit = vi.fn()
    const { container } = render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={onExit} />)
    // X icon — header'dagi birinchi button (X ikonka svg)
    const xButton = container.querySelector('button')
    expect(xButton).not.toBeNull()
    fireEvent.click(xButton!)
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('A0 level → level="A1" sifatida uzatiladi', () => {
    render(<SpeakingDaySession day={makeDay({ cefr: 'A0' })} userId="u1" onExit={vi.fn()} />)
    // ShadowStep ga level="A1" (A0 → A1 konvertatsiyasi) uzatilgan
    // capturedLevel ShadowStep mock'i render bo'lganda saqlangan
    fireEvent.click(screen.getByTestId('mock-listen-next'))
    expect(capturedLevel.current).toBe('A1')
  })
})
