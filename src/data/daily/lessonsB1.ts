import type { DailyLesson } from '../dailyLessons'
import {
  futureFormsReview, modalsObligation, modalsSpeculation, pastHabits,
  causatives, questionTags, bothEitherNeither, timeClauses,
  indirectQuestions, soNeitherAuxiliaries, wishesRegrets,
} from './b1Part1'
// B1 zamonlari — darajaga singdirildi (oldin 5 tasi B1 oxiriga to'plangan edi)
import {
  presentPerfectContinuous, pastPerfect, pastPerfectContinuous,
  futureContinuous, futurePerfect,
} from '../tenses/tensesData'
// Kurikulum bo'shliqlari to'ldirildi (Supabase'dan): asosiy Relative Clauses va Phrasal Verbs
import { relativeClausesB1, phrasalVerbsB1 } from './b1Extra'

// B1 — perfect/continuous zamonlari oldinroq, keyin modallar va murakkab tuzilmalar:
//   perfect zamonlar → past habits → kelasi zamonlar → modallar → relative → struktura → phrasal → wishes
export const B1_LESSONS_NEW: DailyLesson[] = [
  presentPerfectContinuous,
  pastPerfect,
  pastPerfectContinuous,
  pastHabits,
  futureFormsReview,
  futureContinuous,
  futurePerfect,
  modalsObligation,
  modalsSpeculation,
  causatives,
  relativeClausesB1,
  questionTags,
  indirectQuestions,
  bothEitherNeither,
  soNeitherAuxiliaries,
  timeClauses,
  phrasalVerbsB1,
  wishesRegrets,
]
