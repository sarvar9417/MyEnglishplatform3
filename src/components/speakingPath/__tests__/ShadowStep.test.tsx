import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'

const { mockSpeak, mockAnalyzePronunciation, mockCaptureException, mockTrackErrors } = vi.hoisted(() => ({
  mockSpeak: vi.fn(),
  mockAnalyzePronunciation: vi.fn(),
  mockCaptureException: vi.fn(),
  mockTrackErrors: vi.fn(),
}))

vi.mock('../../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({ speak: mockSpeak, supported: true }),
  SPEED_OPTIONS: [],
}))

// Mock MicButton as a simple text input so we can test shadow step flow without STT
vi.mock('../MicButton', () => ({
  default: ({ onResult, onSupportChange }: {
    onResult: (text: string) => void
    onSupportChange?: (supported: boolean) => void
    label?: string
  }) => {
    // Notify parent that STT is supported
    onSupportChange?.(true)
    return (
      <div data-testid="mock-mic">
        <input
          data-testid="mic-text-input"
          placeholder="…yoki bu yerga yozing"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
              onResult((e.target as HTMLInputElement).value.trim())
            }
          }}
        />
        <button
          data-testid="mic-submit"
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>('[data-testid="mic-text-input"]')
            if (input?.value.trim()) onResult(input.value.trim())
          }}
          aria-label="Tekshirish"
        >
          Tekshirish
        </button>
      </div>
    )
  },
}))

vi.mock('../../../lib/claude', () => ({
  analyzePronunciation: mockAnalyzePronunciation,
}))

vi.mock('../../../lib/monitoring', () => ({
  monitoring: {
    captureException: mockCaptureException,
  },
}))

vi.mock('../../../services/pronunciationErrorService', () => ({
  trackPronunciationErrors: mockTrackErrors,
}))

import ShadowStep from '../steps/ShadowStep'
import type { SpeakingDay } from '../../../data/speakingPath/types'

const makeDay = (overrides?: Partial<SpeakingDay>): SpeakingDay => ({
  day: 1,
  cefr: 'A0',
  title: 'Salomlashish',
  subtitle: 'Test',
  goalUz: 'Salom berish',
  chunks: [
    { id: 'c1', en: 'Hello', uz: 'Salom', ipa: '/həˈloʊ/' },
    { id: 'c2', en: 'Goodbye', uz: 'Xayr' },
  ],
  scenario: { aiRole: 'stranger', userRole: 'guest', opening: 'Hi', goalUz: 'test' },
  estMinutes: 10,
  ...overrides,
})

afterEach(() => { cleanup(); vi.clearAllMocks() })

describe('ShadowStep', () => {
  it('joriy chunk ni en/uz/ipa bilan ko\'rsatadi', () => {
    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Salom')).toBeInTheDocument()
    expect(screen.getByText('/həˈloʊ/')).toBeInTheDocument()
  })

  it('progress counter to\'g\'ri: "1 / 2"', () => {
    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('Tinglash tugmasi speak() ni chaqiradi', () => {
    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    fireEvent.click(screen.getByText('Tinglash'))
    expect(mockSpeak).toHaveBeenCalledWith('Hello')
  })

  it('matn yozib tekshirish analyzePronunciation ni chaqiradi', async () => {
    mockAnalyzePronunciation.mockResolvedValueOnce({
      score: 90,
      issues: [],
      encouragement: "Zo'r!",
    })

    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    const input = screen.getByTestId('mic-text-input')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))

    await waitFor(() => {
      expect(mockAnalyzePronunciation).toHaveBeenCalledWith('Hello', 'Hello', '/həˈloʊ/', 'A1')
    })
    await waitFor(() => {
      expect(screen.getByText('90')).toBeInTheDocument()
    })
  })

  it('analyzePronunciation xato bersa monitoring chaqiriladi', async () => {
    mockAnalyzePronunciation.mockRejectedValueOnce(new Error('API error'))

    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    const input = screen.getByTestId('mic-text-input')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))

    await waitFor(() => {
      expect(mockCaptureException).toHaveBeenCalled()
    })
    // Xatodan keyin score 0 va fallback matni
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  it('"Keyingi" tugmasi chunk ni almashtiradi', async () => {
    mockAnalyzePronunciation.mockResolvedValueOnce({
      score: 80,
      issues: [],
      encouragement: 'Yaxshi!',
    })

    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    const input = screen.getByTestId('mic-text-input')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))

    await waitFor(() => expect(screen.getByText('80')).toBeInTheDocument())

    fireEvent.click(screen.getByText(/Keyingi/))
    expect(screen.getByText('Goodbye')).toBeInTheDocument()
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
  })

  it('oxirgi chunk da "Yakunlash" tugmasi onNext ni chaqiradi', async () => {
    mockAnalyzePronunciation.mockResolvedValue({
      score: 85,
      issues: [],
      encouragement: 'Ajoyib!',
    })

    const singleDay = makeDay({ chunks: [{ id: 'c1', en: 'Hello', uz: 'Salom' }] })
    const onNext = vi.fn()
    render(<ShadowStep day={singleDay} level="A1" onNext={onNext} />)

    const input = screen.getByTestId('mic-text-input')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))

    await waitFor(() => expect(screen.getByText('85')).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Yakunlash/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('"Qayta" tugmasi natijani tozalab qayta urinishga ruxsat beradi', async () => {
    mockAnalyzePronunciation.mockResolvedValueOnce({
      score: 50,
      issues: [{ word: 'Hello', heard: 'Hallo', ipa: '/həˈloʊ/', tip: 'E diqqat' }],
      encouragement: "Yana urinib ko'ring",
    })

    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    const input = screen.getByTestId('mic-text-input')
    fireEvent.change(input, { target: { value: 'Hallo' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))

    await waitFor(() => expect(screen.getByText('50')).toBeInTheDocument())

    fireEvent.click(screen.getByText(/Qayta/))
    // Qayta dan keyin Mock MicButton qayta ko'rinishi kerak
    expect(screen.getByTestId('mock-mic')).toBeInTheDocument()
  })

  it('"Takrorladim" tugmasi mavjud (natija bo\'lmasa)', () => {
    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    expect(screen.getByText(/Takrorladim/)).toBeInTheDocument()
  })
})
