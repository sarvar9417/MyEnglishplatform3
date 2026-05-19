export interface TranscriptLine {
  startSec: number
  text: string
  speaker?: string
}

export interface FillBlankExercise {
  id: number
  sentence: string   // _____ = blank
  answer: string
}

export interface TrueFalseExercise {
  id: number
  statement: string
  answer: boolean
  explanation: string
}

export interface ListeningLesson {
  id: string
  title: string
  source: string
  level: 'B1' | 'B1+' | 'B2'
  duration: string
  youtubeId: string
  topic: string
  description: string
  vocabulary: { word: string; definition: string }[]
  transcript: TranscriptLine[]
  fillBlanks: FillBlankExercise[]
  trueFalse: TrueFalseExercise[]
}

export const LISTENING_LESSONS: ListeningLesson[] = [
  // ── Lesson 1 ─────────────────────────────────────────────────────────────────
  {
    id: 'working-from-home',
    title: 'Working from Home: Is It Really Better?',
    source: 'BBC 6 Minute English',
    level: 'B1',
    duration: '6:00',
    youtubeId: '7ICMT3HiUOM',
    topic: 'Work & Lifestyle',
    description: 'Explore the pros and cons of remote work and how it changed our work culture forever.',
    vocabulary: [
      { word: 'remote work',       definition: 'Working from a location outside the office, usually at home' },
      { word: 'productivity',      definition: 'How much useful work you produce in a given time' },
      { word: 'work-life balance', definition: 'A healthy division between professional and personal time' },
      { word: 'commute',           definition: 'Regular travel between home and workplace' },
      { word: 'hybrid working',    definition: 'Splitting work time between home and the office' },
    ],
    transcript: [
      { startSec: 0,   speaker: 'Sam', text: "Hello, and welcome to 6 Minute English. Today we're talking about one of the biggest changes to happen to our working lives — working from home." },
      { startSec: 12,  speaker: 'Rob', text: "That's right. Since the global pandemic, millions of people started working remotely, and many companies discovered their employees could be just as productive at home." },
      { startSec: 26,  speaker: 'Sam', text: "However, it's not all positive. Many people find it difficult to separate their work life from their personal life when both happen in the same place." },
      { startSec: 40,  speaker: 'Rob', text: "Studies show that remote workers often feel more isolated and miss the social connections that come from being in an office with colleagues." },
      { startSec: 55,  speaker: 'Sam', text: "On the other hand, working from home saves time on commuting. The average worker saves almost an hour every day by not travelling to the office." },
      { startSec: 70,  speaker: 'Rob', text: "Many employees say they appreciate the flexibility, but they also want the option to go into the office sometimes — the best of both worlds." },
      { startSec: 85,  speaker: 'Sam', text: "This has led to a new model called 'hybrid working', where employees split their time between home and the office." },
      { startSec: 100, speaker: 'Rob', text: "Companies that offer hybrid working tend to attract more talented employees, as it is seen as a major benefit. And that's our six minutes up!" },
    ],
    fillBlanks: [
      { id: 1, sentence: 'Working from home has become very _____ since the global pandemic.',                          answer: 'common' },
      { id: 2, sentence: 'It can be difficult to _____ your work life from your personal life when both happen at home.', answer: 'separate' },
      { id: 3, sentence: 'Remote workers often feel more _____ because they miss social connections.',                   answer: 'isolated' },
      { id: 4, sentence: "The new model called '_____ working' lets employees split time between home and the office.",  answer: 'hybrid' },
    ],
    trueFalse: [
      { id: 1, statement: 'Working from home was already very popular before 2020.',              answer: false, explanation: 'Remote work became widespread only after the global pandemic.' },
      { id: 2, statement: 'Some employees struggle to separate work and personal life at home.',  answer: true,  explanation: 'This is a common challenge when home and office are the same place.' },
      { id: 3, statement: 'Remote workers never feel lonely or isolated.',                        answer: false, explanation: 'Studies show remote workers often miss office social connections.' },
      { id: 4, statement: 'Working from home saves time on commuting.',                          answer: true,  explanation: 'Workers save about an hour per day by not travelling to the office.' },
      { id: 5, statement: 'Hybrid working means employees only ever work from home.',             answer: false, explanation: 'Hybrid working splits time between home and office.' },
    ],
  },

  // ── Lesson 2 ─────────────────────────────────────────────────────────────────
  {
    id: 'social-media-mental-health',
    title: 'Social Media and Mental Health',
    source: 'TED-Ed',
    level: 'B1+',
    duration: '8:30',
    youtubeId: 'Czg_9C7gL0A',
    topic: 'Technology & Wellbeing',
    description: 'How does social media use affect our mental health — especially for young people? What does science say?',
    vocabulary: [
      { word: 'mental health',     definition: "A person's emotional and psychological wellbeing" },
      { word: 'self-esteem',       definition: 'Confidence in your own worth and abilities' },
      { word: 'anxiety',           definition: 'Feelings of worry and nervousness about the future' },
      { word: 'social comparison', definition: 'Measuring yourself against others to evaluate your own worth' },
      { word: 'digital wellbeing', definition: 'Maintaining a healthy relationship with technology' },
    ],
    transcript: [
      { startSec: 0,   text: 'Social media platforms now have billions of users worldwide. But what effect are they having on our mental health?' },
      { startSec: 12,  text: 'Research suggests that heavy social media use is linked to increased levels of anxiety and depression, especially in teenagers.' },
      { startSec: 26,  text: 'One reason is social comparison — when we look at other people\'s lives online, we often compare ourselves negatively to them.' },
      { startSec: 40,  text: "People tend to share only their best moments online, creating an unrealistic image of perfect lives that few people actually have." },
      { startSec: 55,  text: 'However, social media can also have positive effects. It allows people to connect with others, share ideas, and find communities of support.' },
      { startSec: 70,  text: 'Experts recommend limiting your daily screen time and taking regular breaks from social media to protect your mental health.' },
      { startSec: 85,  text: 'Being aware of how social media makes you feel is the first step. If scrolling makes you feel worse about yourself, it may be time to take a break.' },
      { startSec: 100, text: 'Some schools and governments are now introducing digital literacy programmes to help young people use social media more mindfully.' },
    ],
    fillBlanks: [
      { id: 1, sentence: 'Heavy social media use is linked to increased levels of _____ and depression.',  answer: 'anxiety' },
      { id: 2, sentence: 'People often compare themselves _____ to others when looking at social media.',  answer: 'negatively' },
      { id: 3, sentence: 'People tend to share only their _____ moments online.',                         answer: 'best' },
      { id: 4, sentence: 'Experts recommend taking regular _____ from social media to protect mental health.', answer: 'breaks' },
    ],
    trueFalse: [
      { id: 1, statement: 'Social media has no proven effect on mental health.',                                      answer: false, explanation: 'Research links heavy social media use to higher anxiety and depression.' },
      { id: 2, statement: 'People usually share a realistic picture of their lives on social media.',                 answer: false, explanation: 'People typically share only their best moments, creating an unrealistic image.' },
      { id: 3, statement: 'Social media can help people find communities of support.',                                answer: true,  explanation: 'Positive uses include connecting with supportive communities.' },
      { id: 4, statement: 'Limiting screen time can benefit mental health.',                                         answer: true,  explanation: 'Experts recommend regular breaks from social media.' },
      { id: 5, statement: 'Social comparison on social media always makes people feel better about themselves.',      answer: false, explanation: 'Comparison often leads to negative feelings about oneself.' },
    ],
  },

  // ── Lesson 3 ─────────────────────────────────────────────────────────────────
  {
    id: 'science-of-sleep',
    title: 'Sleep is Your Superpower',
    source: 'TED',
    level: 'B2',
    duration: '19:18',
    youtubeId: '5MgBikgcWnY',
    topic: 'Health & Science',
    description: 'Sleep scientist Matt Walker explains why sleep is the single most effective thing you can do for your health and your brain.',
    vocabulary: [
      { word: 'cognitive',     definition: 'Relating to mental processes such as thinking and learning' },
      { word: 'immune system', definition: "The body's defence system against illness and disease" },
      { word: 'deprivation',   definition: 'The state of not having something you need' },
      { word: 'consolidation', definition: 'The process of strengthening and making something more stable' },
      { word: 'toxic',         definition: 'Poisonous; harmful to living things' },
    ],
    transcript: [
      { startSec: 0,   text: "I'd like to start by asking: how many of you got eight hours of sleep last night?" },
      { startSec: 12,  text: "For those of you who did not, I have some important news — sleep deprivation is one of the greatest public health challenges we face today." },
      { startSec: 26,  text: "Adults need between seven and nine hours of sleep each night to function at their best, both mentally and physically." },
      { startSec: 44,  text: "During sleep, your brain is cleaned of toxic proteins associated with Alzheimer's disease. This cleaning process only happens when you sleep." },
      { startSec: 60,  text: "Sleep also strengthens your immune system. People who sleep less than six hours are four times more likely to catch a cold." },
      { startSec: 76,  text: "One of the most important functions of sleep is memory consolidation. While you sleep, the brain transfers learning from short-term to long-term memory." },
      { startSec: 90,  text: "Drowsy driving causes more road accidents than alcohol and drugs combined, yet it receives far less public attention." },
      { startSec: 105, text: "The good news: sleep is free, natural, and powerful. Make it a priority, and you will transform your health, your brain, and your life." },
    ],
    fillBlanks: [
      { id: 1, sentence: 'Adults need between seven and _____ hours of sleep each night.',                     answer: 'nine' },
      { id: 2, sentence: 'During sleep, the brain clears out _____ proteins linked to Alzheimer\'s disease.', answer: 'toxic' },
      { id: 3, sentence: 'Sleep helps transfer learning from short-term to _____ memory.',                    answer: 'long-term' },
      { id: 4, sentence: 'Drowsy driving causes more accidents than _____ and drugs combined.',               answer: 'alcohol' },
    ],
    trueFalse: [
      { id: 1, statement: 'Six hours of sleep is sufficient for most adults.',                                  answer: false, explanation: 'Adults need 7–9 hours per night to function at their best.' },
      { id: 2, statement: 'The brain removes harmful proteins during sleep.',                                   answer: true,  explanation: 'Sleep clears toxic proteins linked to Alzheimer\'s disease.' },
      { id: 3, statement: 'You can fully recover from lost sleep by sleeping extra at the weekend.',           answer: false, explanation: 'Research shows you cannot fully catch up on lost sleep.' },
      { id: 4, statement: 'Sleep helps form long-term memories.',                                              answer: true,  explanation: 'The brain consolidates memories from short-term to long-term storage during sleep.' },
      { id: 5, statement: 'Lack of sleep has no effect on the immune system.',                                 answer: false, explanation: 'Sleep-deprived people are significantly more vulnerable to illness.' },
    ],
  },
]
