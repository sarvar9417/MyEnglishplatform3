// Mock test question banks — B1 (30 Qs) and B2 (30 Qs)
// Sections: grammar (15) + vocabulary (10) + reading (5) per level

export interface TQ {
  id:       number
  level:    'B1' | 'B2'
  section:  'grammar' | 'vocabulary' | 'reading'
  passage?: string   // displayed above the question for reading Qs
  q:        string
  opts:     [string, string, string, string]
  ans:      number   // 0 = A, 1 = B, 2 = C, 3 = D
}

// ── B1 Questions ──────────────────────────────────────────────────────────────

export const B1_QUESTIONS: TQ[] = [
  // ── Grammar ──────────────────────────────────────────────────────────────
  { id:1,  level:'B1', section:'grammar', q:'She ___ that film twice already.',
    opts:['saw','has seen','was seeing','have seen'], ans:1 },

  { id:2,  level:'B1', section:'grammar', q:'If I ___ you, I would apologize immediately.',
    opts:['am','was','were','had been'], ans:2 },

  { id:3,  level:'B1', section:'grammar', q:'The report ___ by the manager last night.',
    opts:['wrote','was written','has written','writes'], ans:1 },

  { id:4,  level:'B1', section:'grammar', q:'You ___ smoke here. It is strictly forbidden.',
    opts:["mustn't","don't have to","shouldn't","couldn't"], ans:0 },

  { id:5,  level:'B1', section:'grammar', q:'He said that he ___ very tired after the meeting.',
    opts:['is','was','has been','will be'], ans:1 },

  { id:6,  level:'B1', section:'grammar', q:'The woman ___ helped me was a local doctor.',
    opts:['which','what','who','whom'], ans:2 },

  { id:7,  level:'B1', section:'grammar', q:'She doesn\'t mind ___ overtime occasionally.',
    opts:['to work','working','work','worked'], ans:1 },

  { id:8,  level:'B1', section:'grammar', q:'This exercise is ___ than the last one.',
    opts:['more easy','easier','most easy','easiest'], ans:1 },

  { id:9,  level:'B1', section:'grammar', q:'___ Nile is the longest river in the world.',
    opts:['A','An','The','—'], ans:2 },

  { id:10, level:'B1', section:'grammar', q:'She has worked in this company ___ 2019.',
    opts:['for','since','during','in'], ans:1 },

  { id:11, level:'B1', section:'grammar', q:'When I arrived at the cinema, the film ___ already.',
    opts:['started','has started','had started','starts'], ans:2 },

  { id:12, level:'B1', section:'grammar', q:'You ___ bring a gift — it\'s not necessary.',
    opts:["mustn't","couldn't","don't have to","shouldn't"], ans:2 },

  { id:13, level:'B1', section:'grammar', q:'I wish I ___ taller — I can never reach the top shelf.',
    opts:['am','was','were','will be'], ans:2 },

  { id:14, level:'B1', section:'grammar', q:'Neither of the answers ___ correct, unfortunately.',
    opts:['are','were','is','have been'], ans:2 },

  { id:15, level:'B1', section:'grammar', q:'She asked me if I ___ help her move the furniture.',
    opts:['can','could','will','shall'], ans:1 },

  // ── Vocabulary ────────────────────────────────────────────────────────────
  { id:16, level:'B1', section:'vocabulary', q:'She was very ___ of her son\'s achievements at school.',
    opts:['proud','jealous','curious','satisfied'], ans:0 },

  { id:17, level:'B1', section:'vocabulary', q:'Choose the word closest in meaning to "sufficient":',
    opts:['enough','extra','scarce','excessive'], ans:0 },

  { id:18, level:'B1', section:'vocabulary', q:'"Don\'t give ___ — the exam is almost finished!"',
    opts:['in','up','out','off'], ans:1 },

  { id:19, level:'B1', section:'vocabulary', q:'The lecture was so boring that I found it hard to ___.',
    opts:['concentrate','relax','manage','improve'], ans:0 },

  { id:20, level:'B1', section:'vocabulary', q:'He works extremely hard in order to ___ his goals.',
    opts:['make','do','achieve','perform'], ans:2 },

  { id:21, level:'B1', section:'vocabulary', q:'She\'s very ___; she always sees the positive side of things.',
    opts:['pessimistic','optimistic','realistic','cynical'], ans:1 },

  { id:22, level:'B1', section:'vocabulary', q:'We need to ___ a decision before the end of the week.',
    opts:['do','make','take','have'], ans:1 },

  { id:23, level:'B1', section:'vocabulary', q:'There was no ___ for his rude behaviour at the meeting.',
    opts:['excuse','reason','cause','purpose'], ans:0 },

  { id:24, level:'B1', section:'vocabulary', q:'The opposite of "expand" is:',
    opts:['grow','shrink','extend','develop'], ans:1 },

  { id:25, level:'B1', section:'vocabulary', q:'She ___ to arrive early, but the traffic was terrible.',
    opts:['managed','succeeded','attempted','achieved'], ans:2 },

  // ── Reading ───────────────────────────────────────────────────────────────
  { id:26, level:'B1', section:'reading',
    passage:'Every year, millions of tourists visit Rome to see its historic monuments. The city offers a unique combination of past and present — modern restaurants sit beside 2,000-year-old ruins. However, the large number of visitors is causing damage to some famous sites.',
    q:'Why do tourists visit Rome, according to the text?',
    opts:['For modern restaurants','To see historic sites','For ancient technology','To learn Italian'], ans:1 },

  { id:27, level:'B1', section:'reading',
    passage:'Every year, millions of tourists visit Rome to see its historic monuments. The city offers a unique combination of past and present — modern restaurants sit beside 2,000-year-old ruins. However, the large number of visitors is causing damage to some famous sites.',
    q:'What problem is mentioned in the text?',
    opts:['Lack of restaurants','Tourism is declining','Damage to historic sites','Poor public transport'], ans:2 },

  { id:28, level:'B1', section:'reading',
    passage:'Remote working has become increasingly popular in recent years. Many employees report feeling more productive at home due to fewer distractions and no commute. However, some companies worry that employees may feel isolated and miss the social benefits of office life.',
    q:'Why do employees feel more productive at home?',
    opts:['Better salaries','Fewer distractions','Longer hours','Better equipment'], ans:1 },

  { id:29, level:'B1', section:'reading',
    passage:'Remote working has become increasingly popular in recent years. Many employees report feeling more productive at home due to fewer distractions and no commute. However, some companies worry that employees may feel isolated and miss the social benefits of office life.',
    q:'What concern do some companies have about remote working?',
    opts:['Higher costs','Employee isolation','Reduced hours','Lower productivity'], ans:1 },

  { id:30, level:'B1', section:'reading',
    passage:'Remote working has become increasingly popular in recent years. Many employees report feeling more productive at home due to fewer distractions and no commute. However, some companies worry that employees may feel isolated and miss the social benefits of office life.',
    q:'The word "commute" in this context means:',
    opts:['holiday','regular travel to work','break time','social interaction'], ans:1 },
]

// ── B2 Questions ──────────────────────────────────────────────────────────────

export const B2_QUESTIONS: TQ[] = [
  // ── Grammar ──────────────────────────────────────────────────────────────
  { id:31, level:'B2', section:'grammar', q:'Had I known about the delay, I ___ a different route.',
    opts:['would take','would have taken','had taken','took'], ans:1 },

  { id:32, level:'B2', section:'grammar', q:'Not only ___ late, but she also forgot her presentation.',
    opts:['she arrived','arrived she','did she arrive','she did arrive'], ans:2 },

  { id:33, level:'B2', section:'grammar', q:'The contract is said ___ next Monday.',
    opts:['to be signed','to sign','being signed','signing'], ans:0 },

  { id:34, level:'B2', section:'grammar', q:'The manager suggested that the report ___ rewritten.',
    opts:['be','is','was','should be'], ans:0 },

  { id:35, level:'B2', section:'grammar', q:'By this time next year, I ___ for the company for a decade.',
    opts:['will work','am working','will have been working','would work'], ans:2 },

  { id:36, level:'B2', section:'grammar', q:'He was accused ___ the confidential documents.',
    opts:['to leak','of leaking','for leaking','with leaking'], ans:1 },

  { id:37, level:'B2', section:'grammar', q:'It was ___ who first proposed the new strategy.',
    opts:['her','she','hers','herself'], ans:1 },

  { id:38, level:'B2', section:'grammar', q:'I\'d rather you ___ mention this to anyone else.',
    opts:['don\'t','didn\'t','wouldn\'t','not'], ans:1 },

  { id:39, level:'B2', section:'grammar', q:'Barely ___ sat down when the phone rang again.',
    opts:['I had','had I','I','did I'], ans:1 },

  { id:40, level:'B2', section:'grammar', q:'She finished first, ___ surprised all of the judges.',
    opts:['that','who','which','what'], ans:2 },

  { id:41, level:'B2', section:'grammar', q:'It\'s high time the government ___ action on climate change.',
    opts:['takes','took','would take','has taken'], ans:1 },

  { id:42, level:'B2', section:'grammar', q:'She denied ever ___ to the man before.',
    opts:['speaking','to speak','having spoken','spoke'], ans:2 },

  { id:43, level:'B2', section:'grammar', q:'The painting, ___ for two centuries, was finally found.',
    opts:['lost','losing','having lost','been lost'], ans:0 },

  { id:44, level:'B2', section:'grammar', q:'No sooner ___ than it started to rain heavily.',
    opts:['we left','had we left','we had left','did we leave'], ans:1 },

  { id:45, level:'B2', section:'grammar', q:'"I didn\'t take the money," she said. She denied ___ the money.',
    opts:['taking','to take','that she takes','took'], ans:0 },

  // ── Vocabulary ────────────────────────────────────────────────────────────
  { id:46, level:'B2', section:'vocabulary', q:'Choose the word closest in meaning to "conceal":',
    opts:['reveal','hide','display','protect'], ans:1 },

  { id:47, level:'B2', section:'vocabulary', q:'She gave a very ___ analysis of the company\'s financial problems.',
    opts:['thorough','complete','full','inclusive'], ans:0 },

  { id:48, level:'B2', section:'vocabulary', q:'The manager ___ the less urgent tasks to a junior colleague.',
    opts:['delegated','transferred','passed','abandoned'], ans:0 },

  { id:49, level:'B2', section:'vocabulary', q:'Despite all the obstacles, she ___ to complete the marathon.',
    opts:['managed','succeeded','achieved','accomplished'], ans:0 },

  { id:50, level:'B2', section:'vocabulary', q:'Which word does NOT fit with the others?',
    opts:['hesitate','delay','postpone','accelerate'], ans:3 },

  { id:51, level:'B2', section:'vocabulary', q:'The new evidence completely ___ his carefully constructed alibi.',
    opts:['confirmed','established','demolished','proved'], ans:2 },

  { id:52, level:'B2', section:'vocabulary', q:'The government announced new ___ to tackle rising inflation.',
    opts:['methods','measures','strategies','procedures'], ans:1 },

  { id:53, level:'B2', section:'vocabulary', q:'His proposal was ___ by the board without discussion.',
    opts:['turned off','turned down','turned over','turned out'], ans:1 },

  { id:54, level:'B2', section:'vocabulary', q:'"She has a natural ___ for languages — she picks them up effortlessly."',
    opts:['talent','gift','flair','instinct'], ans:2 },

  { id:55, level:'B2', section:'vocabulary', q:'The scientist\'s claims were ___ by independent research teams.',
    opts:['confirmed','ratified','substantiated','corroborated'], ans:3 },

  // ── Reading ───────────────────────────────────────────────────────────────
  { id:56, level:'B2', section:'reading',
    passage:'Artificial intelligence is increasingly being used in healthcare to assist doctors in diagnosing diseases. AI algorithms can analyse thousands of medical scans in minutes — a task that would take human doctors considerably longer. Critics, however, raise concerns about patient privacy and the potential for errors in automated systems.',
    q:'What is the primary use of AI in healthcare mentioned in the text?',
    opts:['Treating patients directly','Diagnosing diseases','Replacing surgeons','Managing hospital budgets'], ans:1 },

  { id:57, level:'B2', section:'reading',
    passage:'Artificial intelligence is increasingly being used in healthcare to assist doctors in diagnosing diseases. AI algorithms can analyse thousands of medical scans in minutes — a task that would take human doctors considerably longer. Critics, however, raise concerns about patient privacy and the potential for errors in automated systems.',
    q:'What advantage of AI over human doctors is mentioned?',
    opts:['It is always accurate','It is cheaper to operate','It processes scans far more quickly','It never makes errors'], ans:2 },

  { id:58, level:'B2', section:'reading',
    passage:'Artificial intelligence is increasingly being used in healthcare to assist doctors in diagnosing diseases. AI algorithms can analyse thousands of medical scans in minutes — a task that would take human doctors considerably longer. Critics, however, raise concerns about patient privacy and the potential for errors in automated systems.',
    q:'What concerns do critics raise about AI in healthcare?',
    opts:['High financial cost','Privacy and potential errors','Loss of doctor jobs','Slow processing speed'], ans:1 },

  { id:59, level:'B2', section:'reading',
    passage:'The so-called "gig economy" — characterised by short-term contracts and freelance work — has grown rapidly over the past decade. While workers appreciate the flexibility it offers, many lack the job security and benefits that come with traditional employment. Governments in several countries are now debating legislation to extend greater protections to gig workers.',
    q:'What characterises the "gig economy" according to the passage?',
    opts:['Long-term employment contracts','High salaries and bonuses','Short-term and freelance work','Government-funded positions'], ans:2 },

  { id:60, level:'B2', section:'reading',
    passage:'The so-called "gig economy" — characterised by short-term contracts and freelance work — has grown rapidly over the past decade. While workers appreciate the flexibility it offers, many lack the job security and benefits that come with traditional employment. Governments in several countries are now debating legislation to extend greater protections to gig workers.',
    q:'What are some governments currently considering?',
    opts:['Banning the gig economy entirely','Reducing gig workers\' tax obligations','Legislation to protect gig workers','Limiting the number of freelance platforms'], ans:2 },
]

// ── IELTS Writing prompts ─────────────────────────────────────────────────────

export const IELTS_WRITING_TASK1 = {
  title: 'Task 1 — Data Description (150+ so\'z)',
  prompt: `The table below shows average daily internet usage (in hours) across five countries in 2023:

  Japan: 3.5h  |  United Kingdom: 5.2h  |  USA: 7.1h  |  Brazil: 8.4h  |  India: 6.3h

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.`,
  minWords: 150,
}

export const IELTS_WRITING_TASK2 = {
  title: 'Task 2 — Essay (250+ so\'z)',
  prompt: 'In many countries, young people are spending more time on social media than ever before. Some argue this has a negative impact on mental health and social skills. Others believe it brings important benefits. Discuss both views and give your own opinion.',
  minWords: 250,
}

// ── IELTS Listening text + MCQ ────────────────────────────────────────────────

export const IELTS_LISTENING_TEXT = `Working from home has become one of the most significant changes in modern work culture.
During the pandemic, millions of employees worldwide were forced to work remotely, and many have continued
to do so even after restrictions were lifted. Surveys show that a majority of workers now prefer a hybrid
model — splitting time between home and the office.

Supporters argue that remote work improves productivity by eliminating the daily commute and reducing
workplace distractions. Employees also report better work-life balance and reduced stress levels.
For companies, the shift can reduce overheads by requiring less office space.

However, critics highlight several challenges. Remote workers may feel isolated and disconnected from
colleagues, which can affect team morale and collaboration. Junior employees, in particular, miss out
on informal mentoring that happens naturally in office environments. There are also concerns about
the blurring of boundaries between work and personal life.`

export interface ListeningMCQ {
  id:   number
  q:    string
  opts: [string, string, string, string]
  ans:  number
}

export const IELTS_LISTENING_MCQ: ListeningMCQ[] = [
  { id:1, q:'What major event forced millions to work remotely?',
    opts:['A financial crisis','The pandemic','A transport strike','New government policy'], ans:1 },
  { id:2, q:'What model do most workers now prefer, according to surveys?',
    opts:['Fully remote','Fully office-based','A hybrid model','Freelance work'], ans:2 },
  { id:3, q:'Which of the following is given as an advantage of remote work?',
    opts:['More meetings','Faster career growth','Improved work-life balance','Larger salaries'], ans:2 },
  { id:4, q:'How can remote work benefit companies financially?',
    opts:['Higher productivity bonuses','Less office space needed','Cheaper equipment','Reduced hiring costs'], ans:1 },
  { id:5, q:'What concern about junior employees is mentioned?',
    opts:['They work longer hours','They earn less','They miss informal mentoring','They struggle with technology'], ans:2 },
  { id:6, q:'According to the text, remote work can cause workers to feel:',
    opts:['More creative','Isolated from colleagues','Better motivated','More focused'], ans:1 },
  { id:7, q:'What does "blurring of boundaries" refer to in the final paragraph?',
    opts:['Unclear job roles','Work and personal life becoming mixed','Poor office design','Unreliable internet connections'], ans:1 },
  { id:8, q:'Which sentence best summarises the text?',
    opts:['Remote work has only negative effects','Remote work has replaced office work entirely','Remote work has both benefits and drawbacks','Companies prefer office-based work'], ans:2 },
]

// ── Band score conversion ─────────────────────────────────────────────────────

export function pctToBand(pct: number): number {
  if (pct >= 90) return 8.5
  if (pct >= 80) return 7.5
  if (pct >= 73) return 7.0
  if (pct >= 67) return 6.5
  if (pct >= 60) return 6.0
  if (pct >= 53) return 5.5
  if (pct >= 45) return 5.0
  if (pct >= 38) return 4.5
  return 4.0
}

export function scoreToBand(score: number): number {
  // score 1-10 from Claude → IELTS band
  const pct = (score / 10) * 100
  return pctToBand(pct)
}

export function roundBand(band: number): number {
  return Math.round(band * 2) / 2  // round to nearest 0.5
}
