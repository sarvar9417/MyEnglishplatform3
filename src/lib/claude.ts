export {
  sendMessage,
  sendMessageStream,
  MODEL,
} from './claudeClient'
export type { ChatMessage } from './claudeClient'

export {
  checkGrammar,
  getWritingFeedback,
  explainWord,
  generateWordCard,
  checkVocabAnswer,
  checkPhraseTranslation,
  generateUzbekSentence,
  checkSentenceTranslation,
  generateSpeakingTask,
  generateWritingTask,
  generatePracticeExercises,
  generateLearningInsights,
  analyzePronunciation,
  analyzeWritingErrors,
  getSpeakingChatFeedback,
  getScenarioReport,
  checkDailyExerciseAnswers,
  generateDuelVerdict,
  generateDuoRoleplayReport,
} from './claudePrompts'
export type {
  WordCard,
  SentenceCheckResult,
  SpeakingTask,
  GeneratedWritingTask,
  GeneratedExercise,
  LearningSignals,
  LearningInsights,
  PronunciationIssue,
  PronunciationAnalysis,
  WritingError,
  ScenarioReport,
  DailyExerciseCheckItem,
} from './claudePrompts'

export {
  getGrammarFeedback,
  generateReadingQuestions,
  evaluateWriting,
  evaluateSpeech,
  generateExamples,
  analyzeGrammar,
  startSpeakingChat,
  startScenarioConversation,
  analyzeWritingIELTS,
} from './claudeChat'
export type {
  GrammarResult,
  ScenarioContext,
  WritingAnalysis,
} from './claudeChat'
