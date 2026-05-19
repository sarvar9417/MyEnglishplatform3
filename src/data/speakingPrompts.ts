export interface SpeakingPrompt {
  id: string
  category: 'personal' | 'opinion' | 'description' | 'narrative' | 'abstract'
  prompt: string
  tips: string[]
  timeSeconds: number
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  // ── Personal ──────────────────────────────────────────────────────────────────
  {
    id: 'daily-routine',
    category: 'personal',
    prompt: 'Describe your typical daily routine. What time do you wake up? What do you usually do in the morning, afternoon, and evening?',
    tips: ['Use present simple tense', 'Include time expressions: first, then, after that, finally', 'Mention 4–5 activities'],
    timeSeconds: 60,
  },
  {
    id: 'hometown',
    category: 'personal',
    prompt: 'Describe your hometown or city. What do you like most about it? Is there anything you would change?',
    tips: ['Use descriptive adjectives (busy, quiet, modern, historic)', 'Mention location, size, and special features', 'Compare past and present if possible'],
    timeSeconds: 90,
  },
  {
    id: 'favourite-food',
    category: 'personal',
    prompt: 'Tell me about your favourite food or meal. How is it made? When do you usually eat it? Why do you enjoy it?',
    tips: ['Use sensory words: taste, smell, texture', 'Explain the key ingredients', 'Talk about occasions when you eat it'],
    timeSeconds: 60,
  },
  {
    id: 'learning-english',
    category: 'personal',
    prompt: 'Why are you learning English? How long have you been studying? What do you find most challenging about it?',
    tips: ['Use present perfect for experiences: I have been learning...', 'Be honest about challenges', 'Talk about your future goals'],
    timeSeconds: 60,
  },
  {
    id: 'free-time',
    category: 'personal',
    prompt: 'What do you enjoy doing in your free time? How often do you do these activities? Have your hobbies changed over the years?',
    tips: ['Use frequency adverbs: always, usually, sometimes, rarely', "Say how long you've had each hobby", 'Compare past and present hobbies'],
    timeSeconds: 60,
  },

  // ── Opinion ───────────────────────────────────────────────────────────────────
  {
    id: 'social-media-opinion',
    category: 'opinion',
    prompt: 'Do you think social media has had a positive or negative effect on society overall? Give clear reasons for your view.',
    tips: ['State your opinion clearly at the start: "I believe..."', 'Give 2–3 reasons with examples', 'Acknowledge the opposite view briefly'],
    timeSeconds: 90,
  },
  {
    id: 'remote-work',
    category: 'opinion',
    prompt: 'Do you think working from home is better or worse than working in a traditional office? Why?',
    tips: ['Compare advantages and disadvantages of both', 'Give your personal preference and explain why', 'Use comparative language: better than, more... than'],
    timeSeconds: 90,
  },
  {
    id: 'technology-education',
    category: 'opinion',
    prompt: 'Should students be allowed to use smartphones freely in classrooms? Discuss both sides and give your own opinion.',
    tips: ['Present both sides: "On one hand... On the other hand..."', 'Support each point with an example', 'Give a clear conclusion with your opinion'],
    timeSeconds: 90,
  },
  {
    id: 'gap-year',
    category: 'opinion',
    prompt: 'Do you think taking a gap year before university is a good idea? What are the advantages and disadvantages?',
    tips: ['Structure: introduction → pros → cons → your view', 'Use phrases: "In my opinion...", "However..."', 'Give real-world examples'],
    timeSeconds: 90,
  },

  // ── Description ───────────────────────────────────────────────────────────────
  {
    id: 'describe-person',
    category: 'description',
    prompt: 'Describe someone you admire — a family member, teacher, or public figure. What qualities make them special to you?',
    tips: ['Describe personality rather than just appearance', 'Give specific examples of what they have done', 'Explain why they inspire you'],
    timeSeconds: 60,
  },
  {
    id: 'dream-holiday',
    category: 'description',
    prompt: 'Describe your ideal holiday destination. Where would you go, who would you go with, and what would you do there?',
    tips: ['Use "would" for hypothetical situations', 'Include why that destination appeals to you', 'Describe at least 2–3 specific activities or experiences'],
    timeSeconds: 60,
  },

  // ── Narrative ─────────────────────────────────────────────────────────────────
  {
    id: 'best-memory',
    category: 'narrative',
    prompt: 'Tell me about one of your favourite childhood memories. What happened? Who was there? Why do you remember it so clearly?',
    tips: ['Set the scene first: where, when, who', 'Use past simple and past continuous', 'Explain why it was special or meaningful'],
    timeSeconds: 90,
  },
  {
    id: 'difficult-situation',
    category: 'narrative',
    prompt: 'Tell me about a time when you faced a difficult situation or challenge. How did you handle it? What did you learn?',
    tips: ['Structure: situation → problem → action → result → lesson', 'Use past tenses correctly', "It's fine to talk about failure — focus on what you learned"],
    timeSeconds: 90,
  },
  {
    id: 'first-time',
    category: 'narrative',
    prompt: 'Describe the first time you did something new or challenging — a new sport, a job, travelling abroad, or a performance.',
    tips: ['Describe your feelings before and after', 'Use past simple for key actions', 'Use past continuous for background: I was feeling nervous when...'],
    timeSeconds: 90,
  },

  // ── Abstract ──────────────────────────────────────────────────────────────────
  {
    id: 'success-meaning',
    category: 'abstract',
    prompt: 'What does success mean to you personally? Is it about money, happiness, achievement, or something else entirely?',
    tips: ['Define the concept in your own words first', 'Give personal examples to support your definition', 'Consider whether your idea of success has changed over time'],
    timeSeconds: 90,
  },
  {
    id: 'future-world',
    category: 'abstract',
    prompt: 'How do you think the world will be different in 50 years? Consider technology, the environment, or the way people work and live.',
    tips: ['Use "will" for certain predictions, "might/could" for uncertain ones', 'Give reasons or evidence for your predictions', 'Mention at least two different areas of life'],
    timeSeconds: 90,
  },
  {
    id: 'language-learning',
    category: 'abstract',
    prompt: 'What is the most effective way to learn a foreign language? Is grammar study or speaking practice more important?',
    tips: ['Give your view on the key factors for success', 'Draw on your own learning experience as evidence', 'Compare different methods (classes, apps, immersion)'],
    timeSeconds: 90,
  },
]

// 3 ta bugungi savol — kun raqamiga ko'ra o'zgaradi
export function getDailyPrompts(dayNumber: number): SpeakingPrompt[] {
  const i = ((dayNumber - 1) * 3) % SPEAKING_PROMPTS.length
  return [
    SPEAKING_PROMPTS[i % SPEAKING_PROMPTS.length],
    SPEAKING_PROMPTS[(i + 1) % SPEAKING_PROMPTS.length],
    SPEAKING_PROMPTS[(i + 2) % SPEAKING_PROMPTS.length],
  ]
}

export const CATEGORY_LABEL: Record<SpeakingPrompt['category'], string> = {
  personal:    'Shaxsiy',
  opinion:     'Fikr',
  description: 'Tasvir',
  narrative:   'Hikoya',
  abstract:    'Abstrakt',
}

export const CATEGORY_COLOR: Record<SpeakingPrompt['category'], string> = {
  personal:    'bg-primary-100 text-primary-700',
  opinion:     'bg-orange-100 text-orange-700',
  description: 'bg-b1-100 text-b1-700',
  narrative:   'bg-purple-100 text-purple-700',
  abstract:    'bg-gray-100 text-gray-700',
}
