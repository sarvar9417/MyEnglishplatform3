export interface WritingPrompt {
  id:          string
  type:        'opinion' | 'discussion' | 'problem-solution' | 'advantage-disadvantage'
  prompt:      string
  wordLimit:   number
  timeMinutes: number
  tips:        string[]
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id:   'big-city',
    type: 'discussion',
    prompt:    'Discuss the advantages and disadvantages of living in a large city. Give your own opinion at the end.',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Write a short introduction that introduces the topic',
      'Paragraph 2: 2 advantages with brief examples',
      'Paragraph 3: 2 disadvantages with brief examples',
      'Conclusion: give your personal opinion clearly',
    ],
  },
  {
    id:   'technology-complicated',
    type: 'opinion',
    prompt:    'Some people believe that modern technology has made our lives more complicated rather than easier. Do you agree or disagree? Give reasons and examples to support your view.',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'State your opinion clearly in the first paragraph',
      'Give 2–3 reasons with real-life examples',
      'Briefly acknowledge the opposite point of view',
      'End with a strong conclusion that restates your position',
    ],
  },
  {
    id:   'remote-work-future',
    type: 'advantage-disadvantage',
    prompt:    'Working from home has become very common in recent years. What are the main advantages and disadvantages of remote working for both employees and employers?',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Consider both employee and employer perspectives',
      'Use linking words: Furthermore, However, On the other hand',
      'Give specific examples to support each point',
      'Write a balanced conclusion',
    ],
  },
  {
    id:   'social-media-relationships',
    type: 'opinion',
    prompt:    'Social media has had a largely negative impact on personal relationships and society as a whole. To what extent do you agree or disagree with this statement?',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Give a clear position: strongly agree, partially agree, or disagree',
      'Support your argument with evidence and examples',
      'Acknowledge the positive aspects of social media if you partly disagree',
      'Use formal vocabulary: It is argued that... / While it is true that...',
    ],
  },
  {
    id:   'education-work',
    type: 'opinion',
    prompt:    'Some people believe that education should focus mainly on preparing students for the world of work. Others think that education should have broader aims. Discuss both views and give your opinion.',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Present both views fairly before giving your own',
      'Use phrases: "Proponents of this view argue that..." / "On the other hand..."',
      'Think about what "broader aims" might mean (critical thinking, citizenship)',
      'Your opinion should follow logically from your discussion',
    ],
  },
  {
    id:   'climate-change',
    type: 'problem-solution',
    prompt:    'Climate change is one of the most serious challenges facing the world today. What do you think are the main causes of climate change, and what measures can governments and individuals take to address it?',
    wordLimit: 250,
    timeMinutes: 40,
    tips: [
      'Paragraph 1: introduction + mention of main causes',
      'Paragraph 2: solutions at government level',
      'Paragraph 3: solutions at individual level',
      'Conclusion: emphasise urgency and need for action',
    ],
  },
  {
    id:   'online-vs-traditional',
    type: 'discussion',
    prompt:    'Online shopping is increasingly replacing traditional shopping in physical stores. What are the effects of this trend on consumers, businesses, and society? Is this change positive or negative overall?',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Consider at least three different groups affected',
      'Think about both short-term and long-term effects',
      'Use a range of vocabulary related to commerce and society',
      'Give a clear final judgement in your conclusion',
    ],
  },
  {
    id:   'healthy-lifestyle',
    type: 'problem-solution',
    prompt:    'In many countries, people are living increasingly unhealthy lifestyles. What are the main reasons for this problem, and what steps can be taken to encourage healthier choices?',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Identify 2–3 clear causes (e.g. diet, lack of exercise, busy lifestyles)',
      'Suggest practical solutions for each cause',
      'Mention the role of governments, schools, and individuals',
      'Use modal verbs for suggestions: could, should, might',
    ],
  },
  {
    id:   'reading-vs-screens',
    type: 'discussion',
    prompt:    'Some people believe that reading books is essential for developing language skills and imagination. Others prefer watching films and using digital media. Compare both views and give your own opinion.',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Discuss the benefits of books (vocabulary, concentration, imagination)',
      'Discuss the benefits of films and digital media (visual learning, accessibility)',
      'Give your personal view with reasons',
      'Avoid being too one-sided — acknowledge the merits of both sides',
    ],
  },
  {
    id:   'renewable-energy',
    type: 'opinion',
    prompt:    'Governments should invest much more in renewable energy and completely phase out the use of fossil fuels within the next twenty years. Do you agree or disagree? Give reasons and examples.',
    wordLimit: 250,
    timeMinutes: 35,
    tips: [
      'Define what "renewable energy" and "fossil fuels" are briefly',
      'Consider economic, environmental, and practical arguments',
      'Address the challenges of such a transition',
      'Support your view with facts or examples if possible',
    ],
  },
]

export function getDailyWritingPrompt(dayNumber: number): WritingPrompt {
  return WRITING_PROMPTS[(dayNumber - 1) % WRITING_PROMPTS.length]
}

export const TYPE_LABEL: Record<WritingPrompt['type'], string> = {
  'opinion':               'Fikr bildirish',
  'discussion':            'Muhokama',
  'problem-solution':      'Muammo va yechim',
  'advantage-disadvantage':'Foyda va zarar',
}

export const TYPE_COLOR: Record<WritingPrompt['type'], string> = {
  'opinion':               'bg-primary-100 text-primary-700',
  'discussion':            'bg-b1-100 text-b1-700',
  'problem-solution':      'bg-orange-100 text-orange-700',
  'advantage-disadvantage':'bg-b2-100 text-b2-700',
}
