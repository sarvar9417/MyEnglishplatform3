// Re-export type
export type { DailyLesson } from '../dailyLessons'

// Re-export A0 lesson constants
export {
  greetingsAndNames,
  numbersAndAlphabet,
  familyAndMe,
} from './a0Part1'

// Re-export A1 lesson constants
export {
  alphabetAndGreetings,
  numbers,
  colorsAndShapes,
  family,
  daysAndMonths,
  timeAndRoutines,
  foodAndDrinks,
  animals,
  bodyParts,
  clothes,
} from './a1Part1'

export {
  demonstratives,
  thereIsAre,
  canCant,
  haveGot,
  presentSimple,
  questionWords,
  conjunctions,
  a1Review,
  prepositionsOfPlace,
  basicAdjectives,
} from './a1Part2'

export { articles as articlesA1 } from './a1Articles'

// Re-export individual lesson constants
export {
  modalVerbs,
  articles,
  prepositions,
  questionsLesson,
  countableUncountable,
} from './a2Part1'

export {
  adjectiveAdverb,
  gerundsInfinitives,
  passiveVoice,
  reportedSpeech,
  firstConditional,
} from './a2Part2'

export {
  thereIsThereAre,
  possessives,
  someAnyNoEvery,
  verbPatterns,
  timePrepositions,
} from './a2Part3'

export {
  presentContinuousFuture,
  quantifiers,
  tooEnough,
  soSuch,
  a2Review2,
} from './a2Part4'

export {
  futureFormsReview,
  modalsObligation,
  modalsSpeculation,
  pastHabits,
  causatives,
  questionTags,
  bothEitherNeither,
  timeClauses,
  indirectQuestions,
  soNeitherAuxiliaries,
  wishesRegrets,
} from './b1Part1'

export { pragmaticsFormalInformal } from './b1Pragmatics'

export {
  narrativeTensesB1plus,
  advancedRelativeClausesB1plus,
  participleClausesB1plus,
  infinitiveGerundAdvancedB1plus,
  modalPerfectsB1plus,
  emphasisDoesB1plus,
  frontingB1plus,
  ellipsisSubstitutionB1plus,
  concessionB1plus,
} from './b1plusPart1'

export {
  linkingWordsAdvanced,
  collocationsMakeDoHaveTake,
  advancedPhrasalVerbs,
  idiomsCommon,
  prepositionalPhrases,
  wordFormation,
  reportingVerbs,
  determinersAdvanced,
  b1plusReview,
} from './b1plusPart2'

export {
  unrealPastB2,
  advancedConditionalsB2,
  nominalizationB2,
  subjunctiveB2,
  hedgingB2,
  complexPrepositionsB2,
  cohesionB2,
  registerB2,
} from './b2Part1'

export {
  britishAmericanDifferencesB2,
} from './b2BritishAmerican'

export {
  modalsPragmaticsB2,
} from './b2ModalsPragmatics'

export {
  complexSentencesB2,
  advancedModalsB2,
  contrastiveStructuresB2,
  punctuationB2,
  academicCollocationsB2,
  criticalThinkingB2,
  b2Review,
} from './b2Part2'

export {
  argumentStructureB2,
  stanceMarkersB2,
  paraphrasingB2,
  advancedVerbPatternsB2,
  b2ComprehensiveReview,
} from './b2Part3'

// Combined export arrays
import { alphabetAndGreetings, numbers, colorsAndShapes, family, daysAndMonths, timeAndRoutines, foodAndDrinks, animals, bodyParts, clothes } from './a1Part1'
import { demonstratives, thereIsAre, canCant, haveGot, questionWords, conjunctions, a1Review, prepositionsOfPlace, basicAdjectives } from './a1Part2'
import { articles as articlesA1 } from './a1Articles'
// A1 zamon darslari — bu yerda ketma-ketlikka qo'shiladi (oldin loadAllLessons'da
// A1_TENSES alohida, lug'at darslaridan OLDIN kelib, tartibni buzar edi)
import { simplePresent, presentContinuous, simplePast, simpleFuture } from '../tenses/tensesData'
// A2/B1/B1+/B2 daraja massivlari endi lessonsX.ts da YAGONA manba sifatida saqlanadi
// va pastda re-export qilinadi (oldin bu yerda eski tartibda dublikat turardi).
import { A2_LESSONS } from './lessonsA2'
import { B1_LESSONS_NEW } from './lessonsB1'
import { B1PLUS_LESSONS_NEW } from './lessonsB1plus'
import { B2_LESSONS_NEW } from './lessonsB2'
import { greetingsAndNames, numbersAndAlphabet, familyAndMe } from './a0Part1'
import type { DailyLesson } from '../dailyLessons'

// A1 darslari — pedagogik ketma-ketlikda (loadAllLessons day raqamini massiv
// indeksidan beradi, shuning uchun TARTIB shu yerda hal bo'ladi):
//   1) Hayotiy lug'at  2) Asosiy tuzilmalar  3) Fe'l zamonlari  4) Gap qurish + takror
export const A1_LESSONS_NEW: DailyLesson[] = [
  // ─── A0: Boshlang'ich (kun 1-3) ───
  greetingsAndNames,
  numbersAndAlphabet,
  familyAndMe,
  // ─── Hayotiy lug'at (kun 4-13) ───
  alphabetAndGreetings,
  numbers,
  colorsAndShapes,
  family,
  daysAndMonths,
  timeAndRoutines,
  foodAndDrinks,
  animals,
  bodyParts,
  clothes,
  // ─── Asosiy tuzilmalar (kun 11-16) ───
  demonstratives,
  thereIsAre,
  prepositionsOfPlace,
  basicAdjectives,
  articlesA1,
  haveGot,
  canCant,
  // ─── Fe'l zamonlari (kun 17-20) — Present Simple bu yerda (a1Part2 dublikati olib tashlandi) ───
  simplePresent,
  presentContinuous,
  simplePast,
  simpleFuture,
  // ─── Gap qurish + takrorlash (kun 21-23) ───
  questionWords,
  conjunctions,
  a1Review,
]

// Daraja massivlari — YAGONA manba lessonsX.ts (loadAllLessons aynan shularni ishlatadi;
// zamonlar va comparatives pedagogik tartibda o'sha fayllarga singdirilgan)

/** Barcha darslarni bitta massivga jamlash */
export function getAllLessons(): DailyLesson[] {
  return [
    ...A1_LESSONS_NEW,
    ...A2_LESSONS,
    ...B1_LESSONS_NEW,
    ...B1PLUS_LESSONS_NEW,
    ...B2_LESSONS_NEW,
  ]
}
