import { lazy } from 'react'

const PersonalVocabularyPage = lazy(() => import('../components/personalVocabulary/PersonalVocabularyPage'))

export default function PersonalVocabulary() {
  return <PersonalVocabularyPage />
}
