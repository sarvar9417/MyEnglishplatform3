import { day1 } from './day1'
import { day2 } from './day2'
import { getChallengeDayFromDB } from '../../services/challengeDayService'

export const STATIC_DAYS = [
  day1,
  day2,
]

export const TOTAL_CHALLENGE_DAYS = 30

export function getStaticDay(day: number) {
  return STATIC_DAYS.find(d => d.day === day) ?? null
}

export async function getChallengeDay(day: number) {
  const fromDB = await getChallengeDayFromDB(day)
  if (fromDB) return fromDB
  return getStaticDay(day)
}

export { getChallengeDayFromDB } from '../../services/challengeDayService'

export type { ChallengeDay, SentenceBank, SentenceCategory, ChallengeVocab, LessonHighlight, ChallengeExercise, RoleplayExercise, ChallengeQuiz, ChallengeSpeaking, ChallengeReview, ChallengeVideo, Timestamp, DialogueLine, TranscriptSection, TranscriptLine } from './types'
