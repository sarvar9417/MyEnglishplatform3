import type { DailyLesson } from '../dailyLessons'
import { comparativesSuperlatives } from '../dailyLessons'
import { modalVerbs, articles, prepositions, questionsLesson, countableUncountable } from './a2Part1'
import { adjectiveAdverb, gerundsInfinitives, passiveVoice, reportedSpeech, firstConditional } from './a2Part2'
// thereIsThereAre — A1 'There is/are' (thereIsAre) bilan dublikat → ketma-ketlikdan chiqarildi
import { possessives, someAnyNoEvery, verbPatterns, timePrepositions } from './a2Part3'
import { presentContinuousFuture, quantifiers, tooEnough, soSuch, a2Review2 } from './a2Part4'
// A2 zamonlari — darajaga singdirildi (oldin alohida blok bo'lib oxirda turardi)
import { pastContinuous, presentPerfect } from '../tenses/tensesData'

// A2 — pedagogik tartibda (soddadan murakkabga), zamonlar singdirilgan, takror oxirida:
//   asoslar → sifat/comparatives → gerund → ZAMONLAR → passive/reported → qolgan → review
export const A2_LESSONS: DailyLesson[] = [
  modalVerbs,
  articles,
  prepositions,
  questionsLesson,
  countableUncountable,
  adjectiveAdverb,
  comparativesSuperlatives,
  gerundsInfinitives,
  pastContinuous,
  presentPerfect,
  passiveVoice,
  reportedSpeech,
  firstConditional,
  verbPatterns,
  timePrepositions,
  possessives,
  someAnyNoEvery,
  presentContinuousFuture,
  quantifiers,
  tooEnough,
  soSuch,
  a2Review2,
]
