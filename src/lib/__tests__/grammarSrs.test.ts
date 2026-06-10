import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  scheduleReview,
  getDueReviews,
  getDueCount,
  getScheduledCount,
  getReviewStatus,
  strengthToPercent,
  getAllReviews,
  getWeakGrammarLessonIds,
} from '../grammarSrs'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('scheduleReview — FSRS-5 asosida', () => {
  it('yuqori natija (>=90) Easy grade beradi, box=5', () => {
    scheduleReview('lesson-a', 95)
    const r = getReviewStatus('lesson-a')!
    expect(r.box).toBe(5)
    expect(r.stability).toBeGreaterThan(0)
    expect(r.lapses).toBe(0)
    expect(r.nextReview > '2026-06-15').toBe(true)
  })

  it('yaxshi natija (70-89) Good grade beradi, box=3', () => {
    scheduleReview('lesson-b', 85)
    const r = getReviewStatus('lesson-b')!
    expect(r.box).toBe(3)
    expect(r.stability).toBeGreaterThan(0)
    expect(r.lapses).toBe(0)
  })

  it('zaif natija (<40) Again grade beradi, box=0, lapses+1', () => {
    scheduleReview('lesson-c', 20)
    const r = getReviewStatus('lesson-c')!
    expect(r.box).toBe(0)
    expect(r.lapses).toBe(1)
    expect(r.stability).toBeGreaterThan(0)
  })

  it('takroriy yaxshi natijalar stability ni oshiradi', () => {
    scheduleReview('lesson-d', 95)
    const r1 = getReviewStatus('lesson-d')!
    scheduleReview('lesson-d', 92)
    const r2 = getReviewStatus('lesson-d')!
    expect(r2.stability).toBeGreaterThanOrEqual(r1.stability)
  })

  it('zaif natijadan keyin stability pasayadi', () => {
    scheduleReview('lesson-e', 90)
    const r1 = getReviewStatus('lesson-e')!
    scheduleReview('lesson-e', 20)
    const r2 = getReviewStatus('lesson-e')!
    expect(r2.stability).toBeLessThan(r1.stability)
    expect(r2.lapses).toBe(1)
  })
})

describe('getDueReviews / getDueCount', () => {
  it("vaqt o'tgandan keyin due bo'ladi", () => {
    scheduleReview('due-1', 90)
    vi.setSystemTime(new Date('2027-01-01T12:00:00Z'))
    expect(getDueCount()).toBe(1)
    expect(getDueReviews()[0].lessonId).toBe('due-1')
  })

  it('hali vaqti kelmagan takror due emas', () => {
    scheduleReview('future-1', 90)
    expect(getDueCount()).toBe(0)
    expect(getScheduledCount()).toBe(1)
  })

  it('due reviewlar nextReview boyicha tartiblanadi', () => {
    scheduleReview('old', 90)
    vi.setSystemTime(new Date('2026-06-20T12:00:00Z'))
    scheduleReview('new', 90)
    vi.setSystemTime(new Date('2027-06-01T12:00:00Z'))
    const due = getDueReviews()
    expect(due[0].lessonId).toBe('old')
  })
})

describe('getWeakGrammarLessonIds', () => {
  it('lapses bor yoki stability<1 darslarni qaytaradi', () => {
    scheduleReview('weak-lapse', 30)
    scheduleReview('weak-lowbox', 85)
    scheduleReview('strong', 90)
    scheduleReview('strong', 95)
    scheduleReview('strong', 100)
    const weak = getWeakGrammarLessonIds()
    expect(weak).toContain('weak-lapse')
    expect(weak).not.toContain('strong')
  })

  it('lapses boyicha kamayish tartibida saralaydi', () => {
    scheduleReview('a', 30)
    scheduleReview('b', 30)
    scheduleReview('b', 30)
    const weak = getWeakGrammarLessonIds()
    expect(weak[0]).toBe('b')
  })

  it('limit ni hurmat qiladi', () => {
    for (let i = 0; i < 8; i++) scheduleReview(`w-${i}`, 30)
    expect(getWeakGrammarLessonIds(3)).toHaveLength(3)
  })
})

describe('yordamchi funksiyalar', () => {
  it('getAllReviews barcha yozuvlarni qaytaradi', () => {
    scheduleReview('x', 90)
    scheduleReview('y', 90)
    expect(getAllReviews()).toHaveLength(2)
  })

  it('strengthToPercent stability ni foizga aylantiradi', () => {
    expect(strengthToPercent(0)).toBe(0)
    expect(strengthToPercent(10)).toBe(100)
  })

  it('getReviewStatus mavjud bolmagan dars uchun null', () => {
    expect(getReviewStatus('nope')).toBeNull()
  })

  it("buzaq localStorage'da xato bermaydi", () => {
    localStorage.setItem('grammar-srs-v2', 'not-json{')
    expect(getAllReviews()).toEqual([])
    expect(getDueCount()).toBe(0)
  })
})
