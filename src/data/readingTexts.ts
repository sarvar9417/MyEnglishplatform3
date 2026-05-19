export interface VocabWord {
  word:          string
  partOfSpeech:  string
  definition:    string
  example:       string
}

export interface CompQuestion {
  id:           number
  question:     string
  options:      string[]
  correctIndex: number
  explanation:  string
}

export interface ReadingText {
  id:          string
  title:       string
  level:       'B1' | 'B1+' | 'B2'
  topic:       string
  wordCount:   number
  readingTime: number   // minutes for countdown timer
  paragraphs:  string[]
  vocabWords:  VocabWord[]   // 10 highlighted words
  questions:   CompQuestion[] // 5 MCQ
}

export const READING_TEXTS: ReadingText[] = [
  // ── Text 1 ───────────────────────────────────────────────────────────────────
  {
    id:          'urban-green-spaces',
    title:       'The Importance of Urban Green Spaces',
    level:       'B1',
    topic:       'Environment & City Life',
    wordCount:   265,
    readingTime: 3,
    paragraphs: [
      'Modern cities are often associated with noise, traffic, and concrete buildings. Yet urban green spaces — parks, community gardens, and nature reserves — are increasingly recognised as vital components of healthy city life. City planners around the world are beginning to understand that nature is not a luxury but a necessity.',
      'Research has consistently shown that spending time in nature is highly beneficial for people\'s wellbeing. The peaceful atmosphere of a green space, with its trees, birdsong, and fresh air, helps people feel less stressed and more focused. Studies show that people who live close to parks report significantly lower levels of anxiety and depression.',
      'Green spaces also play a key role in improving air quality. Trees and plants absorb carbon dioxide and other harmful gases, helping to reduce pollution in the surrounding environment. These natural areas also support biodiversity by providing habitats for birds, insects, and small animals — bringing wildlife back into the heart of the city.',
      'From a social perspective, parks provide spaces for recreation and bring community members together. Families can gather, children can play safely, and people of all ages can exercise. These shared spaces help to strengthen bonds between neighbours and create a stronger sense of belonging.',
      'Finally, investing in green spaces is a sustainable strategy for long-term urban development. Parks help to regulate temperature, reduce flooding, and enhance the overall quality of life for city residents. For these reasons, green spaces must be prioritised in all future urban planning decisions.',
    ],
    vocabWords: [
      { word: 'urban',        partOfSpeech: 'adjective', definition: 'Relating to a city or town',                                    example: 'Urban areas are growing faster than rural ones.' },
      { word: 'vital',        partOfSpeech: 'adjective', definition: 'Extremely important or necessary',                              example: 'Water is vital for all living things.' },
      { word: 'beneficial',   partOfSpeech: 'adjective', definition: 'Having a good or helpful effect',                               example: 'Regular exercise is beneficial for your health.' },
      { word: 'atmosphere',   partOfSpeech: 'noun',      definition: 'The mood or feeling of a place',                               example: 'The restaurant had a wonderful atmosphere.' },
      { word: 'pollution',    partOfSpeech: 'noun',      definition: 'Harmful substances released into the environment',              example: 'Air pollution is a serious problem in big cities.' },
      { word: 'biodiversity', partOfSpeech: 'noun',      definition: 'The variety of plant and animal life in a habitat',            example: 'Tropical rainforests have incredible biodiversity.' },
      { word: 'recreation',   partOfSpeech: 'noun',      definition: 'Activities done for enjoyment and relaxation',                 example: 'The park is used for recreation by local residents.' },
      { word: 'community',    partOfSpeech: 'noun',      definition: 'A group of people living in the same area',                    example: 'The whole community came together for the festival.' },
      { word: 'sustainable',  partOfSpeech: 'adjective', definition: 'Able to continue over a long period without causing damage',   example: 'We need to find sustainable sources of energy.' },
      { word: 'enhance',      partOfSpeech: 'verb',      definition: 'To improve the quality, value, or extent of something',        example: 'Adding colour can enhance the appearance of a room.' },
    ],
    questions: [
      {
        id: 1,
        question: 'According to the text, what effect can green spaces have on people\'s wellbeing?',
        options: [
          'They provide free exercise equipment for residents.',
          'They help people feel less stressed and more focused.',
          'They make people sleep better at night.',
          'They reduce the risk of serious diseases.',
        ],
        correctIndex: 1,
        explanation: 'Paragraph 2 states that green spaces "help people feel less stressed and more focused."',
      },
      {
        id: 2,
        question: 'How do trees and plants help improve air quality in cities?',
        options: [
          'They reduce traffic on busy roads.',
          'They attract more rainfall to the area.',
          'They absorb carbon dioxide and reduce pollution.',
          'They lower the temperature in summer months.',
        ],
        correctIndex: 2,
        explanation: 'Paragraph 3 explains that trees and plants "absorb carbon dioxide and other harmful gases, helping to reduce pollution."',
      },
      {
        id: 3,
        question: 'What social benefit of parks is mentioned in the text?',
        options: [
          'They reduce crime in city centres.',
          'They bring community members together and strengthen bonds.',
          'They provide free sports facilities for all ages.',
          'They reduce road noise for nearby residents.',
        ],
        correctIndex: 1,
        explanation: 'Paragraph 4 states that parks "bring community members together" and "help to strengthen bonds between neighbours."',
      },
      {
        id: 4,
        question: 'What does the writer say about biodiversity in urban green spaces?',
        options: [
          'It is declining rapidly in most modern cities.',
          'It can only survive in very large parks.',
          'It depends on the number of visitors to the park.',
          'It is supported by providing habitats for animals and insects.',
        ],
        correctIndex: 3,
        explanation: 'Paragraph 3 mentions that green spaces "support biodiversity by providing habitats for birds, insects, and small animals."',
      },
      {
        id: 5,
        question: 'What is the writer\'s main argument in this text?',
        options: [
          'To compare green spaces in different countries.',
          'To describe how parks can be made more beautiful.',
          'To argue that green spaces must be prioritised in city planning.',
          'To explain the history of urban park development.',
        ],
        correctIndex: 2,
        explanation: 'The final paragraph concludes that "green spaces must be prioritised in all future urban planning decisions."',
      },
    ],
  },

  // ── Text 2 ───────────────────────────────────────────────────────────────────
  {
    id:          'ai-in-education',
    title:       'Artificial Intelligence in Education',
    level:       'B1+',
    topic:       'Technology & Learning',
    wordCount:   278,
    readingTime: 4,
    paragraphs: [
      'Artificial intelligence is rapidly transforming education around the world. Schools and universities are beginning to implement AI-powered tools that can offer personalised learning experiences for every student, regardless of their ability or background.',
      'Traditional classrooms often teach all students at the same pace, which can be frustrating for those who learn quickly and discouraging for those who need more time. Innovative AI systems address this problem by using adaptive technology that automatically adjusts the level and pace of content to match each learner. As a result, students are able to engage more deeply with the material and make faster progress.',
      'AI tools can also support teachers with assessment. Instead of spending hours marking tests and essays, teachers can use AI to evaluate student work quickly and accurately. The data collected by these systems allows teachers to identify which students need extra support, and to collaborate with colleagues more effectively when developing teaching strategies.',
      'Despite these benefits, some educators worry that over-reliance on technology may limit opportunities for students to develop essential cognitive skills, such as critical thinking, creativity, and independent problem-solving. Others raise concerns about student privacy, as AI platforms collect and store large amounts of personal information.',
      'Despite these valid concerns, most experts agree that AI, when used responsibly and thoughtfully, has enormous potential to make education fairer, more efficient, and more engaging for all learners.',
    ],
    vocabWords: [
      { word: 'Artificial',   partOfSpeech: 'adjective', definition: 'Made or produced by human beings; not natural',                         example: 'The robot displayed artificial emotions.' },
      { word: 'implement',    partOfSpeech: 'verb',      definition: 'To put a plan, system, or decision into effect',                        example: 'The school decided to implement a new timetable.' },
      { word: 'personalised', partOfSpeech: 'adjective', definition: 'Designed or produced to meet an individual\'s specific requirements',    example: 'She received a personalised fitness programme.' },
      { word: 'Innovative',   partOfSpeech: 'adjective', definition: 'Introducing new methods or ideas; creative',                            example: 'The company is known for its innovative designs.' },
      { word: 'adaptive',     partOfSpeech: 'adjective', definition: 'Able to change or adjust to different conditions',                       example: 'The adaptive software adjusts to each user\'s skill level.' },
      { word: 'engage',       partOfSpeech: 'verb',      definition: 'To occupy or involve someone\'s interest and attention',                 example: 'Good teachers know how to engage their students.' },
      { word: 'assessment',   partOfSpeech: 'noun',      definition: 'The evaluation of someone\'s performance or progress',                  example: 'The teacher used regular assessments to track progress.' },
      { word: 'data',         partOfSpeech: 'noun',      definition: 'Facts and statistics collected for analysis',                           example: 'The data showed a clear improvement in test scores.' },
      { word: 'collaborate',  partOfSpeech: 'verb',      definition: 'To work jointly with others on a project or activity',                  example: 'The two departments agreed to collaborate on the research.' },
      { word: 'cognitive',    partOfSpeech: 'adjective', definition: 'Relating to mental processes such as thinking, learning, and memory',   example: 'Chess is known to improve cognitive skills.' },
    ],
    questions: [
      {
        id: 1,
        question: 'What problem with traditional classrooms does the text identify?',
        options: [
          'Classes are too large for effective teaching.',
          'Teachers are not trained to use technology.',
          'Students are not motivated to learn in classrooms.',
          'All students are taught at the same pace, regardless of ability.',
        ],
        correctIndex: 3,
        explanation: 'Paragraph 2 states that traditional classrooms "teach all students at the same pace, which can be frustrating."',
      },
      {
        id: 2,
        question: 'How do adaptive AI systems help students learn more effectively?',
        options: [
          'By providing more homework assignments each day.',
          'By replacing classroom teachers with digital tutors.',
          'By adjusting the level and pace of content to match each learner.',
          'By connecting students with tutors around the world.',
        ],
        correctIndex: 2,
        explanation: 'Paragraph 2 explains that adaptive AI technology "automatically adjusts the level and pace of content to match each learner."',
      },
      {
        id: 3,
        question: 'What concern do some educators have about AI in classrooms?',
        options: [
          'AI tools are too expensive for most schools to afford.',
          'AI may prevent students from developing cognitive skills.',
          'Students prefer to learn without the help of technology.',
          'Teachers cannot learn to use AI tools effectively.',
        ],
        correctIndex: 1,
        explanation: 'Paragraph 4 warns that AI may "limit opportunities for students to develop essential cognitive skills."',
      },
      {
        id: 4,
        question: 'How can data collected by AI systems benefit teachers?',
        options: [
          'It allows teachers to work fewer hours each week.',
          'It helps teachers design better school buildings.',
          'It allows teachers to identify students who need extra support.',
          'It replaces the need for traditional assessment methods.',
        ],
        correctIndex: 2,
        explanation: 'Paragraph 3 states that "data collected by these systems allows teachers to identify which students need extra support."',
      },
      {
        id: 5,
        question: 'What is the writer\'s overall conclusion about AI in education?',
        options: [
          'AI will soon completely replace human teachers.',
          'The risks of AI in education outweigh the benefits.',
          'AI should only be used for marking and assessment.',
          'When used responsibly, AI can improve education for all learners.',
        ],
        correctIndex: 3,
        explanation: 'The final paragraph concludes that AI "has enormous potential to make education fairer, more efficient, and more engaging."',
      },
    ],
  },
]
