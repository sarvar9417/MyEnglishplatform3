import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react'
import type { SpeakingDay } from '../../../data/speakingPath/types'

const { mockSpeak, mockAnalyzePronunciation, mockCaptureException, mockTrackErrors } = vi.hoisted(() => ({
  mockSpeak: vi.fn(),
  mockAnalyzePronunciation: vi.fn(),
  mockCaptureException: vi.fn(),
  mockTrackErrors: vi.fn(() => Promise.resolve()),  // Must return Promise for .catch() chain
}))

vi.mock('../../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({ speak: mockSpeak, supported: true }),
  SPEED_OPTIONS: [],
}))

// Mutable SR mock — changes trigger re-evaluation only when React re-renders (via rerender)
const srState = { isRecording: false, transcript: '', interim: '' }

vi.mock('../../../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({
    isSupported: true,
    isRecording: srState.isRecording,
    transcript: srState.transcript,
    interim: srState.interim,
    start: vi.fn(() => { srState.isRecording = true }),
    stop: vi.fn(() => { srState.isRecording = false }),
    reset: vi.fn(() => { srState.transcript = ''; srState.interim = ''; srState.isRecording = false }),
  }),
}))

vi.mock('../../../hooks/useAudioRecorder', () => ({
  useAudioRecorder: () => ({
    isSupported: true,
    isRecording: false,
    duration: 0,
    audioUrl: null,
    audioBlob: null,
    start: vi.fn(),
    stop: vi.fn(),
    reset: vi.fn(),
  }),
}))

vi.mock('../../../hooks/useAudioAnalyser', () => ({
  analyzeAudio: vi.fn(() => Promise.resolve({ pitchMean: 150, pitchStddev: 30, fluency: { avgEnergy: 0.5, energyVariation: 0.2 } })),
}))

vi.mock('../../../lib/claude', () => ({
  analyzePronunciation: mockAnalyzePronunciation,
}))

vi.mock('../../../lib/monitoring', () => ({
  monitoring: { captureException: mockCaptureException },
}))

vi.mock('../../../services/pronunciationErrorService', () => ({
  trackPronunciationErrors: mockTrackErrors,
}))

import ShadowStep from '../steps/ShadowStep'

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

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  srState.isRecording = false
  srState.transcript = ''
  srState.interim = ''
})

function pressRelease(btn: Element) {
  // Push-to-talk: bosib turish (pointerDown) → qo'yib yuborish (pointerUp)
  fireEvent.pointerDown(btn)
  fireEvent.pointerUp(btn)
}

function startRecording(component: HTMLElement) {
  // Find the circular (rounded-full) icon-only button inside the mic area
  const allBtns = component.querySelectorAll('button')
  for (const btn of allBtns) {
    if (btn.className.includes('rounded-full') && !btn.textContent?.trim()) {
      pressRelease(btn)
      return
    }
  }
  // Fallback: just press any icon-only button
  const svgBtns = Array.from(allBtns).filter(b => b.querySelector('svg') && !b.textContent?.trim())
  if (svgBtns.length > 0) pressRelease(svgBtns[0])
}

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

  it('mikrofon orqali yozib olish analyzePronunciation ni chaqiradi', async () => {
    mockAnalyzePronunciation.mockResolvedValueOnce({
      score: 90,
      issues: [],
      encouragement: "Zo'r!",
    })

    const { container, rerender } = render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    expect(screen.getByText('Bosib turib takrorlang')).toBeInTheDocument()

    // Click mic → starts recording
    startRecording(container)

    // Simulate SR completion: transcript ready, isRecording stops
    await act(async () => {
      srState.transcript = 'Hello'
      srState.isRecording = false
      // Force re-render so the effect re-evaluates with new srState values
      rerender(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    })

    await waitFor(() => {
      expect(mockAnalyzePronunciation).toHaveBeenCalledWith(
        expect.stringContaining('Hello'), 'Hello', '/həˈloʊ/', 'A1', undefined
      )
    })
    await waitFor(() => {
      expect(screen.getByText('90')).toBeInTheDocument()
    })
  })

  it('analyzePronunciation xato bersa monitoring chaqiriladi', async () => {
    mockAnalyzePronunciation.mockRejectedValueOnce(new Error('API error'))

    const { container, rerender } = render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    startRecording(container)

    await act(async () => {
      srState.transcript = 'Hello'
      srState.isRecording = false
      rerender(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    })

    await waitFor(() => {
      expect(mockCaptureException).toHaveBeenCalled()
    })
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

    const { container, rerender } = render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    startRecording(container)

    await act(async () => {
      srState.transcript = 'Hello'
      srState.isRecording = false
      rerender(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    })

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
    const { container, rerender } = render(<ShadowStep day={singleDay} level="A1" onNext={onNext} />)
    startRecording(container)

    await act(async () => {
      srState.transcript = 'Hello'
      srState.isRecording = false
      rerender(<ShadowStep day={singleDay} level="A1" onNext={onNext} />)
    })

    await waitFor(() => expect(screen.getByText('85')).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Yakunlash/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('"Qayta" tugmasi natijani tozalab qayta urinishga ruxsat beradi', async () => {
    mockAnalyzePronunciation.mockResolvedValue({
      score: 50,
      issues: [{ word: 'Hello', heard: 'Hallo', ipa: '/həˈloʊ/', tip: 'E diqqat' }],
      encouragement: "Yana urinib ko'ring",
    })

    const { container, rerender } = render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    startRecording(container)

    await act(async () => {
      srState.transcript = 'Hello'
      srState.isRecording = false
      rerender(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    })

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Qayta/))

    await waitFor(() => {
      expect(screen.getByText('Bosib turib takrorlang')).toBeInTheDocument()
    })
  })

  it('STT qo\'llab-quvvatlanganda "Takrorladim" tugmasi ko\'rinmaydi', () => {
    render(<ShadowStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    // With sr.isSupported=true, the "Takrorladim" button should NOT appear
    expect(screen.queryByText(/Takrorladim/)).not.toBeInTheDocument()
  })
})
