import type { DailyLesson } from '../../data/dailyLessons'
import { getConfusablePairs } from './lessonHelpers'
import { useLessonState } from './useLessonState'
import ReadingSection from './ReadingSection'
import WritingSection from './WritingSection'
import ListeningSection from './ListeningSection'
import SpeakingSection from './SpeakingSection'
import ConfusableBanner from './ConfusableBanner'
import TheoryTab from './TheoryTab'
import DrillTab from './DrillTab'
import LessonHeader from './LessonHeader'
import LessonNavigation from './LessonNavigation'
import SelfAssessment from '../ui/SelfAssessment'

type Props = { lesson: DailyLesson; onBack: () => void }

export default function LessonView({ lesson: lessonProp, onBack }: Props) {
  const {
    lesson,
    tab,
    setTab,
    navigate,
    addXP,
    addLearnedWords,
    updateSkillProgress,
    section,
    sectionExercises,
    isLastSection,
    storyBeat,
    prevScore,
    allDone,
    currentLessonScore,
    shuffledTestOptionsMap,
    submitted,
    score,
    answers,
    aiResults,
    isAiChecking,
    completedSections,
    sectionCelebration,
    currentSection,
    testSection,
    testAnswers,
    testSubmitted,
    testScore,
    testResults,
    completedTestSections,
    setTestAnswers,
    setVocabDone,
    setVocabPushedCount,
    handleJumpToSection,
    handleSubmitSection,
    handleClearSection,
    handleNextSection,
    handleChangeAnswer,
    handleJumpToTestSection,
    handleSubmitTest,
    handleClearTest,
  } = useLessonState(lessonProp)

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
      <SelfAssessment lessonId={lesson.id} />

      <LessonHeader
        lesson={lesson}
        prevScore={prevScore}
        allDone={allDone}
        currentLessonScore={currentLessonScore}
        onBack={onBack}
      />

      {/* Pill-style tab bar */}
      <LessonNavigation lesson={lesson} tab={tab} onTabChange={setTab} />

      {/* ── THEORY TAB ── */}
      {tab === 'theory' && (
        <div role="tabpanel" aria-label="Theory content">
          <TheoryTab
            lesson={lesson}
            storyBeat={storyBeat}
            navigate={navigate}
            addXP={addXP}
            onVocabDone={(pushedCount) => {
              setVocabDone(true)
              setVocabPushedCount(prev => Math.max(prev, pushedCount))
              if (pushedCount > 0) addLearnedWords(pushedCount)
            }}
          />
        </div>
      )}

      {/* ── DRILL TAB: Exercises ── */}
      {tab === 'drill' && (
        <div role="tabpanel" aria-label="Drill exercises">
          <DrillTab
            lessonId={lesson.id}
            exerciseSections={lesson.exerciseSections}
            exercises={lesson.exercises}
            testSections={lesson.testSections}
            tests={lesson.tests}
            section={section}
            sectionExercises={sectionExercises}
            isLastSection={isLastSection}
            currentSection={currentSection}
            sectionTotal={lesson.exerciseSections.length}
            shuffledTestOptionsMap={shuffledTestOptionsMap}
            submitted={submitted}
            score={score}
            answers={answers}
            aiResults={aiResults}
            isAiChecking={isAiChecking}
            completedSections={completedSections}
            sectionCelebration={sectionCelebration}
            testSection={testSection}
            testAnswers={testAnswers}
            testSubmitted={testSubmitted}
            testScore={testScore}
            testResults={testResults}
            completedTestSections={completedTestSections}
            onJumpToSection={handleJumpToSection}
            onSubmitSection={handleSubmitSection}
            onClearSection={handleClearSection}
            onNextSection={handleNextSection}
            onChangeAnswer={handleChangeAnswer}
            onJumpToTestSection={handleJumpToTestSection}
            onSubmitTest={handleSubmitTest}
            onClearTest={handleClearTest}
            onTestAnswerChange={(id, value) => setTestAnswers((prev) => ({ ...prev, [id]: value }))}
          />
        </div>
      )}

      {/* ── READING TAB ── */}
      {tab === 'reading' && lesson.reading && (
        <div role="tabpanel" aria-label="Reading content" className="pt-2">
          <ReadingSection section={lesson.reading} addXP={addXP} />
        </div>
      )}

      {/* ── SPEAKING TAB ── */}
      {tab === 'speaking' && (
        <div role="tabpanel" aria-label="Speaking content" className="pt-2 space-y-4">
          <ConfusableBanner pairs={getConfusablePairs(lesson.vocabulary)} navigate={navigate} variant="speaking" />
          <SpeakingSection
            topic={lesson.title}
            level={lesson.level}
            addXP={addXP}
            onSkillProgress={(pct) => updateSkillProgress('todaySpeakingPct', pct)}
            formulas={lesson.formulas}
            rules={lesson.rules}
            vocabulary={lesson.vocabulary}
          />
        </div>
      )}

      {/* ── WRITING TAB ── */}
      {tab === 'writing' && (
        <div role="tabpanel" aria-label="Writing content" className="pt-2 space-y-4">
          <ConfusableBanner pairs={getConfusablePairs(lesson.vocabulary)} navigate={navigate} variant="writing" />
          <WritingSection
            section={lesson.writing}
            level={lesson.level}
            addXP={addXP}
            lesson={{ title: lesson.title, level: lesson.level, formulas: lesson.formulas, rules: lesson.rules, vocabulary: lesson.vocabulary }}
          />
        </div>
      )}

      {/* ── LISTENING TAB ── */}
      {tab === 'listening' && lesson.listening && (
        <div role="tabpanel" aria-label="Listening content" className="pt-2">
          <ListeningSection section={lesson.listening} addXP={addXP} />
        </div>
      )}
    </div>
  )
}
