import { describe, it, expect } from 'vitest'
import { normalizeAnswer, checkAnswer, OPTION_LABELS, getExerciseContext, getCorrectText } from '../helpers'
import type { DailyExercise } from '../../../data/dailyLessons'

describe('normalizeAnswer', () => {
  it('trims whitespace', () => {
    expect(normalizeAnswer('  hello  ')).toBe('hello')
  })

  it('lowercases', () => {
    expect(normalizeAnswer('HELLO')).toBe('hello')
  })

  it('removes punctuation', () => {
    expect(normalizeAnswer('hello, world!')).toBe('hello world')
  })

  it('replaces n\'t with not', () => {
    expect(normalizeAnswer('don\'t')).toBe('do not')
    expect(normalizeAnswer('can\'t')).toBe('cannot')
    expect(normalizeAnswer('isn\'t')).toBe('is not')
  })

  it('collapses multiple spaces', () => {
    expect(normalizeAnswer('hello    world')).toBe('hello world')
  })

  it('handles empty string', () => {
    expect(normalizeAnswer('')).toBe('')
  })

  it('handles mixed case with punctuation and contractions', () => {
    expect(normalizeAnswer('  I don\'t like, apples!  ')).toBe('i do not like apples')
  })
})

describe('checkAnswer', () => {
  it('returns false for empty answers', () => {
    expect(checkAnswer({ type: 'multiple-choice' } as DailyExercise, [])).toBe(false)
    expect(checkAnswer({ type: 'fill-blank' } as DailyExercise, [])).toBe(false)
  })

  it('checks fill-blank type', () => {
    const ex: DailyExercise = {
      type: 'fill-blank',
      blanks: ['hello', 'world'],
      question: '___ ___',
      explanation: '',
    }
    expect(checkAnswer(ex, ['hello', 'world'])).toBe(true)
    expect(checkAnswer(ex, ['HELLO', 'WORLD!'])).toBe(true)
    expect(checkAnswer(ex, ['goodbye', 'world'])).toBe(false)
  })

  it('checks multiple-choice type', () => {
    const ex: DailyExercise = {
      type: 'multiple-choice',
      question: 'Choose:',
      options: ['A', 'B', 'C'],
      correct: 'B',
      explanation: '',
    }
    expect(checkAnswer(ex, ['B'])).toBe(true)
    expect(checkAnswer(ex, ['b'])).toBe(true)
    expect(checkAnswer(ex, ['A'])).toBe(false)
  })

  it('checks error-correction type', () => {
    const ex: DailyExercise = {
      type: 'error-correction',
      question: 'He go to school',
      errorPart: 'go',
      correct: 'goes',
      explanation: '',
    }
    expect(checkAnswer(ex, ['goes'])).toBe(true)
    expect(checkAnswer(ex, ['GOES'])).toBe(true)
    expect(checkAnswer(ex, ['go'])).toBe(false)
  })

  it('checks transformation type', () => {
    const ex: DailyExercise = {
      type: 'transformation',
      question: 'Change to past',
      hint: 'I play',
      correct: 'I played',
      explanation: '',
    }
    expect(checkAnswer(ex, ['I played'])).toBe(true)
    expect(checkAnswer(ex, ['i played!'])).toBe(true)
    expect(checkAnswer(ex, ['I play'])).toBe(false)
  })

  it('checks fill-table type', () => {
    const ex: DailyExercise = {
      type: 'fill-table',
      question: 'Fill the table',
      instruction: 'Complete',
      rows: [
        { adj: 'big', comp: 'bigger', sup: 'biggest' },
        { adj: 'small', comp: 'smaller', sup: 'smallest' },
      ],
      explanation: '',
    }
    expect(checkAnswer(ex, ['bigger', 'biggest', 'smaller', 'smallest'])).toBe(true)
    expect(checkAnswer(ex, ['bigger', 'biggest', 'wrong', 'smallest'])).toBe(false)
  })

  it('handles fill-table with empty expected cells', () => {
    const ex: DailyExercise = {
      type: 'fill-table',
      question: 'Fill',
      instruction: '',
      rows: [
        { adj: 'good', comp: '', sup: '' },
      ],
      explanation: '',
    }
    expect(checkAnswer(ex, [''])).toBe(true)
  })

  it('checks passage type (contextual fill-blank)', () => {
    const ex: DailyExercise = {
      type: 'passage',
      instruction: 'Fill blanks',
      passage: 'He is ___(1) than me. She is the ___(2).',
      blanks: ['taller', 'best'],
      explanation: '',
    }
    expect(checkAnswer(ex, ['taller', 'best'])).toBe(true)
    expect(checkAnswer(ex, ['TALLER', 'Best!'])).toBe(true)
    expect(checkAnswer(ex, ['taller', 'worst'])).toBe(false)
  })

  it('checks passage type with acceptedAnswers alternatives', () => {
    const ex: DailyExercise = {
      type: 'passage',
      instruction: '',
      passage: '___(1)',
      blanks: ['happiest'],
      acceptedAnswers: [['happiest', 'best']],
      explanation: '',
    }
    expect(checkAnswer(ex, ['happiest'])).toBe(true)
    expect(checkAnswer(ex, ['best'])).toBe(true)
    expect(checkAnswer(ex, ['saddest'])).toBe(false)
  })

  it('checks connection type (completed when non-empty)', () => {
    const ex: DailyExercise = {
      type: 'connection',
      instruction: '',
      prompt: 'Write 3 sentences',
      hints: ['hint'],
      exampleAnswer: 'My sister is older than me.',
    }
    expect(checkAnswer(ex, ['I am taller than my brother.'])).toBe(true)
    expect(checkAnswer(ex, ['   '])).toBe(false)
    expect(checkAnswer(ex, [''])).toBe(false)
  })
})

describe('getExerciseContext / getCorrectText', () => {
  it('returns context for every exercise type', () => {
    expect(getExerciseContext({ type: 'fill-blank', question: 'Q', blanks: ['a'], instruction: '', explanation: '' } as DailyExercise)).toBe('Q')
    expect(getExerciseContext({ type: 'vocab-match', word: 'cat', options: [], correct: '', instruction: '', explanation: '' } as DailyExercise)).toBe('cat')
    expect(getExerciseContext({ type: 'passage', passage: 'P', blanks: [], instruction: '', explanation: '' } as DailyExercise)).toBe('P')
    expect(getExerciseContext({ type: 'connection', prompt: 'Pr', hints: [], exampleAnswer: '', instruction: '' } as DailyExercise)).toBe('Pr')
  })

  it('returns correct-answer text for passage and connection', () => {
    expect(getCorrectText({ type: 'passage', passage: '', blanks: ['a', 'b'], instruction: '', explanation: '' } as DailyExercise)).toBe('a / b')
    expect(getCorrectText({ type: 'connection', prompt: '', hints: [], exampleAnswer: 'Example.', instruction: '' } as DailyExercise)).toBe('Example.')
  })
})

describe('OPTION_LABELS', () => {
  it('has labels A through D', () => {
    expect(OPTION_LABELS).toEqual(['A', 'B', 'C', 'D'])
  })

  it('has at least 4 labels for MCQ options', () => {
    expect(OPTION_LABELS.length).toBeGreaterThanOrEqual(4)
  })
})
