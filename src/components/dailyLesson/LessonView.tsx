import { Trophy, Star, RotateCcw } from 'lucide-react'
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
import MixedReview from './MixedReview'

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
    combo,
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
            combo={combo}
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

      {/* ── MIXED REVIEW TAB ── */}
      {tab === 'mixed' && (
        <div role="tabpanel" aria-label="Mixed review" className="pt-2">
          <MixedReview lesson={lesson} addXP={addXP} />
        </div>
      )}

      {/* ── LESSON COMPLETE SUMMARY ── */}
      {allDone && (
        <div className="bg-gradient-to-br from-emerald-50 to-primary-50 dark:from-emerald-900/20 dark:to-primary-900/20 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
              <Trophy size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-800 dark:text-emerald-200 text-lg">Dars yakunlandi!</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Ajoyib natija! Davom eting.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-primary-600">{currentLessonScore ?? 0}%</p>
              <p className="text-xs text-gray-500 mt-1">Natija</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{lesson.exercises.length * 10}</p>
              <p className="text-xs text-gray-500 mt-1">XP olindi</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{lesson.vocabulary.length}</p>
              <p className="text-xs text-gray-500 mt-1">Yangi so'z</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="flex justify-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round((currentLessonScore ?? 0) / 20) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Yulduzlar</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onBack} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <RotateCcw size={16} /> Qaytadan o'qish
            </button>
            <button onClick={onBack} className="btn-ghost flex-1 flex items-center justify-center gap-2">
              Boshqa darslar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
