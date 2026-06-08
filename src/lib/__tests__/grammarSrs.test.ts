import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  scheduleReview,
  getDueReviews,
  getDueCount,
  getScheduledCount,
  getReviewStatus,
  boxToStrength,
  daysUntilReview,
  getAllReviews,
  getWeakGrammarLessonIds,
  BOX_INTERVALS,
  MAX_BOX,
} from '../grammarSrs'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('scheduleReview — box progression', () => {
  it('yaxshi natija (>=80) box ni oshiradi va 1 kundan keyin belgilaydi', () => {
    scheduleReview('lesson-a', 90)
    const r = getReviewStatus('lesson-a')!
    expect(r.box).toBe(0)                 // -1 + 1 = 0
    expect(r.lapses).toBe(0)
    expect(r.nextReview).toBe('2026-06-16') // +1 kun (BOX_INTERVALS[0])
  })

  it('ketma-ket yaxshi natijalar box ni bosqichma-bosqich oshiradi', () => {
    scheduleReview('lesson-b', 90) // box 0
    scheduleReview('lesson-b', 85) // box 1
    scheduleReview('lesson-b', 100) // box 2
    expect(getReviewStatus('lesson-b')!.box).toBe(2)
    // box 2 intervali = BOX_INTERVALS[2] = 7 kun
    expect(getReviewStatus('lesson-b')!.nextReview).toBe('2026-06-22')
  })

  it("o'rtacha natija (50-79) shu box'da qoldiradi", () => {
    scheduleReview('lesson-c', 90) // box 0
    scheduleReview('lesson-c', 60) // box 0 (o'zgarmaydi)
    expect(getReviewStatus('lesson-c')!.box).toBe(0)
    expect(getReviewStatus('lesson-c')!.lapses).toBe(0)
  })

  it('zaif natija (<50) box ni 0 ga tushiradi va lapses oshiradi', () => {
    scheduleReview('lesson-d', 90) // box 0
    scheduleReview('lesson-d', 85) // box 1
    scheduleReview('lesson-d', 30) // box 0, lapse +1
    const r = getReviewStatus('lesson-d')!
    expect(r.box).toBe(0)
    expect(r.lapses).toBe(1)
  })

  it('box MAX_BOX dan oshmaydi', () => {
    for (let i = 0; i < 10; i++) scheduleReview('lesson-e', 100)
    expect(getReviewStatus('lesson-e')!.box).toBe(MAX_BOX)
  })

  it('nextReview har box uchun BOX_INTERVALS ga mos', () => {
    scheduleReview('lesson-f', 100) // box 0 → +1
    expect(daysUntilReview(getReviewStatus('lesson-f')!)).toBe(BOX_INTERVALS[0])
  })
})

describe('getDueReviews / getDueCount', () => {
  it("bugun yoki o'tib ketgan takrorlarni qaytaradi", () => {
    scheduleReview('due-1', 90)   // nextReview = ertaga (due emas)
    // Vaqtni 2 kun oldinga suramiz → due bo'ladi
    vi.setSystemTime(new Date('2026-06-18T12:00:00Z'))
    expect(getDueCount()).toBe(1)
    expect(getDueReviews()[0].lessonId).toBe('due-1')
  })

  it('hali vaqti kelmagan takror due emas', () => {
    scheduleReview('future-1', 90) // ertaga
    expect(getDueCount()).toBe(0)
    expect(getScheduledCount()).toBe(1)
  })

  it('due reviewlar nextReview bo\'yicha tartiblanadi', () => {
    scheduleReview('old', 90)
    vi.setSystemTime(new Date('2026-06-20T12:00:00Z'))
    scheduleReview('new', 90)
    vi.setSystemTime(new Date('2026-07-01T12:00:00Z'))
    const due = getDueReviews()
    expect(due[0].lessonId).toBe('old') // eski nextReview oldinroq
  })
})

describe('getWeakGrammarLessonIds', () => {
  it('lapses bor yoki box<=1 darslarni qaytaradi', () => {
    scheduleReview('weak-lapse', 30)   // box 0, lapse 1
    scheduleReview('weak-lowbox', 90)  // box 0
    scheduleReview('strong', 90)       // box 0
    scheduleReview('strong', 90)       // box 1
    scheduleReview('strong', 90)       // box 2 (zaif emas)
    const weak = getWeakGrammarLessonIds()
    expect(weak).toContain('weak-lapse')
    expect(weak).toContain('weak-lowbox')
    expect(weak).not.toContain('strong')
  })

  it('lapses bo\'yicha kamayish tartibida saralaydi', () => {
    scheduleReview('a', 30) // lapse 1
    scheduleReview('b', 30) // lapse 1
    scheduleReview('b', 30) // lapse 2
    const weak = getWeakGrammarLessonIds()
    expect(weak[0]).toBe('b') // ko'proq lapse oldinda
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

  it('boxToStrength box ni foizga aylantiradi', () => {
    expect(boxToStrength(0)).toBe(0)
    expect(boxToStrength(MAX_BOX)).toBe(100)
  })

  it('getReviewStatus mavjud bo\'lmagan dars uchun null', () => {
    expect(getReviewStatus('nope')).toBeNull()
  })

  it("buzuq localStorage'da xato bermaydi", () => {
    localStorage.setItem('grammar-srs-v1', 'not-json{')
    expect(getAllReviews()).toEqual([])
    expect(getDueCount()).toBe(0)
  })
})
