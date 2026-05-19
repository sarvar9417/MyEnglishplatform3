// B1+ darajasi uchun boshlang'ich 60 ta so'z — SM-2 seed data

export interface SeedWord {
  word: string
  translation: string
  phonetic: string
  exampleSentence: string
  level: 'A2' | 'B1' | 'B1+' | 'B2'
  category: string
}

export const SEED_WORDS: SeedWord[] = [
  // ── Academic & General (20) ─────────────────────────────────────────────────
  {
    word: 'abundant',      phonetic: '/əˈbʌndənt/',
    translation: "Mo'l-ko'l, ko'p",
    exampleSentence: 'There is abundant scientific evidence that exercise improves mental health.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'accurate',      phonetic: '/ˈækjərət/',
    translation: "Aniq, to'g'ri",
    exampleSentence: 'The weather forecast was surprisingly accurate this week.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'achieve',       phonetic: '/əˈtʃiːv/',
    translation: 'Erishmoq, amalga oshirmoq',
    exampleSentence: 'She worked extremely hard to achieve her dream of becoming a doctor.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'acquire',       phonetic: '/əˈkwaɪər/',
    translation: "Egallamoq, o'rganmoq",
    exampleSentence: 'It takes years to acquire true fluency in a foreign language.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'analyze',       phonetic: '/ˈænəlaɪz/',
    translation: 'Tahlil qilmoq',
    exampleSentence: 'Scientists carefully analyzed the data to find the root cause.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'appropriate',   phonetic: '/əˈprəʊpriət/',
    translation: "Mos, to'g'ri, o'rinli",
    exampleSentence: 'Please wear appropriate clothing to the job interview.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'assume',        phonetic: '/əˈsjuːm/',
    translation: 'Taxmin qilmoq, faraz qilmoq',
    exampleSentence: "Don't assume that everyone agrees with your point of view.",
    level: 'B1', category: 'academic',
  },
  {
    word: 'contribute',    phonetic: '/kənˈtrɪbjuːt/',
    translation: "Hissa qo'shmoq, yordam bermoq",
    exampleSentence: 'Everyone should contribute to keeping our local environment clean.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'demonstrate',   phonetic: '/ˈdemənstreɪt/',
    translation: "Ko'rsatmoq, isbotlamoq",
    exampleSentence: 'The experiment clearly demonstrated that plants need sunlight to grow.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'establish',     phonetic: '/ɪˈstæblɪʃ/',
    translation: "O'rnatmoq, tashkil etmoq",
    exampleSentence: 'The charity was established over 50 years ago to help homeless people.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'evidence',      phonetic: '/ˈevɪdəns/',
    translation: "Dalil, isbotl, guvohlik",
    exampleSentence: 'There is strong evidence that a healthy diet reduces the risk of disease.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'identify',      phonetic: '/aɪˈdentɪfaɪ/',
    translation: "Aniqlamoq, tanib olmoq",
    exampleSentence: 'Can you identify the main problem in this business plan?',
    level: 'B1', category: 'academic',
  },
  {
    word: 'indicate',      phonetic: '/ˈɪndɪkeɪt/',
    translation: "Ko'rsatmoq, bildirmoq",
    exampleSentence: 'The red warning light indicates that the battery is critically low.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'influence',     phonetic: '/ˈɪnfluəns/',
    translation: "Ta'sir qilmoq, ta'sir",
    exampleSentence: 'Music can greatly influence our mood and productivity.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'investigate',   phonetic: '/ɪnˈvestɪɡeɪt/',
    translation: "Tekshirmoq, tergov qilmoq",
    exampleSentence: 'Police are currently investigating the cause of the accident.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'relevant',      phonetic: '/ˈreləvənt/',
    translation: 'Tegishli, muhim, aloqador',
    exampleSentence: 'Please only include relevant information in your CV.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'require',       phonetic: '/rɪˈkwaɪər/',
    translation: "Talab qilmoq, kerak bo'lmoq",
    exampleSentence: 'This position requires at least three years of experience.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'significant',   phonetic: '/sɪɡˈnɪfɪkənt/',
    translation: "Muhim, katta, sezilarli",
    exampleSentence: 'There has been a significant improvement in her English since last year.',
    level: 'B1', category: 'academic',
  },
  {
    word: 'sufficient',    phonetic: '/səˈfɪʃənt/',
    translation: 'Yetarli, kifoya',
    exampleSentence: 'Is there sufficient time to finish the project before the deadline?',
    level: 'B1', category: 'academic',
  },
  {
    word: 'conclude',      phonetic: '/kənˈkluːd/',
    translation: "Xulosa qilmoq, yakunlamoq",
    exampleSentence: 'We can conclude from the results that the treatment was effective.',
    level: 'B1', category: 'academic',
  },

  // ── Daily Life (20) ─────────────────────────────────────────────────────────
  {
    word: 'appointment',   phonetic: '/əˈpɔɪntmənt/',
    translation: "Uchrashuv, qabul (vaqt belgilash)",
    exampleSentence: 'I have a doctor\'s appointment at half past three tomorrow.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'arrange',       phonetic: '/əˈreɪndʒ/',
    translation: "Tartiblamoq, tashkil qilmoq",
    exampleSentence: 'She arranged the meeting for Monday morning at 9am.',
    level: 'A2', category: 'daily',
  },
  {
    word: 'attempt',       phonetic: '/əˈtempt/',
    translation: "Urinmoq, harakat qilmoq",
    exampleSentence: 'He attempted to climb the mountain but had to turn back due to bad weather.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'communicate',   phonetic: '/kəˈmjuːnɪkeɪt/',
    translation: "Muloqot qilmoq, aloqa o'rnatmoq",
    exampleSentence: 'It\'s important to communicate your ideas clearly in a job interview.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'concentrate',   phonetic: '/ˈkɒnsəntreɪt/',
    translation: "Diqqatini jamlash, e'tibor qaratmoq",
    exampleSentence: 'I find it very difficult to concentrate when there is background noise.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'confident',     phonetic: '/ˈkɒnfɪdənt/',
    translation: "O'ziga ishonchli, ishonchli",
    exampleSentence: 'She feels much more confident about speaking English in public now.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'convenient',    phonetic: '/kənˈviːniənt/',
    translation: "Qulay, moslab turuvchi",
    exampleSentence: 'The new office location is very convenient — it\'s close to the metro.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'delay',         phonetic: '/dɪˈleɪ/',
    translation: "Kechikmoq, kechiktirmoq, kechikish",
    exampleSentence: 'The flight was delayed by three hours due to heavy fog.',
    level: 'A2', category: 'daily',
  },
  {
    word: 'efficient',     phonetic: '/ɪˈfɪʃənt/',
    translation: "Samarali, unumli, tejamkor",
    exampleSentence: 'The new system is far more efficient than the old one.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'encourage',     phonetic: '/ɪnˈkʌrɪdʒ/',
    translation: "Rag'batlantirmoq, dadillashtirmoq",
    exampleSentence: 'Parents should always encourage their children to read books.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'familiar',      phonetic: '/fəˈmɪliər/',
    translation: "Tanish, ma'lum, ko'nikish hosil qilgan",
    exampleSentence: 'This song sounds very familiar — I\'ve definitely heard it before.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'flexible',      phonetic: '/ˈfleksɪbəl/',
    translation: "Moslashuvchan, egiluvchan",
    exampleSentence: 'My working hours are quite flexible — I can start at any time.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'frequently',    phonetic: '/ˈfriːkwəntli/',
    translation: "Tez-tez, ko'p, muntazam",
    exampleSentence: 'He frequently visits his grandparents in the countryside.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'grateful',      phonetic: '/ˈɡreɪtfəl/',
    translation: "Minnatdor, shukrli",
    exampleSentence: 'I\'m extremely grateful for all your support during difficult times.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'improve',       phonetic: '/ɪmˈpruːv/',
    translation: "Yaxshilamoq, rivojlantirmoq, ilgarilamoq",
    exampleSentence: 'Her pronunciation has improved dramatically since she started listening more.',
    level: 'A2', category: 'daily',
  },
  {
    word: 'mention',       phonetic: '/ˈmenʃən/',
    translation: "Aytib o'tmoq, tilga olmoq",
    exampleSentence: 'Did she mention anything about the meeting next week?',
    level: 'B1', category: 'daily',
  },
  {
    word: 'prefer',        phonetic: '/prɪˈfɜːr/',
    translation: "Afzal ko'rmoq, yaxshi ko'rmoq",
    exampleSentence: 'I prefer tea to coffee in the morning — it\'s less bitter.',
    level: 'A2', category: 'daily',
  },
  {
    word: 'realize',       phonetic: '/ˈrɪəlaɪz/',
    translation: "Anglamoq, tushunmoq, idrok etmoq",
    exampleSentence: 'I suddenly realized that I had left my phone at the café.',
    level: 'B1', category: 'daily',
  },
  {
    word: 'suggest',       phonetic: '/səˈdʒest/',
    translation: "Taklif qilmoq, maslahat bermoq",
    exampleSentence: 'She suggested going for a walk after dinner to get some fresh air.',
    level: 'A2', category: 'daily',
  },
  {
    word: 'manage',        phonetic: '/ˈmænɪdʒ/',
    translation: "Uddasidan chiqmoq, boshqarmoq",
    exampleSentence: 'Did you manage to finish all the work before the deadline?',
    level: 'B1', category: 'daily',
  },

  // ── Travel & Business (10) ───────────────────────────────────────────────────
  {
    word: 'accommodation', phonetic: '/əˌkɒməˈdeɪʃən/',
    translation: "Turar joy, mehmonxona, joylashtirish",
    exampleSentence: 'We need to book accommodation well in advance for the summer holidays.',
    level: 'B1', category: 'travel',
  },
  {
    word: 'afford',        phonetic: '/əˈfɔːrd/',
    translation: "Qo'lidan kelmoq, puli yetmoq",
    exampleSentence: 'I\'d love to go to Japan, but I can\'t afford the flights right now.',
    level: 'B1', category: 'travel',
  },
  {
    word: 'atmosphere',    phonetic: '/ˈætməsfɪər/',
    translation: "Muhit, kayfiyat, atmosfera",
    exampleSentence: 'The old jazz club had a wonderfully cosy and relaxed atmosphere.',
    level: 'B1', category: 'travel',
  },
  {
    word: 'destination',   phonetic: '/ˌdestɪˈneɪʃən/',
    translation: "Manzil, borish joyi",
    exampleSentence: 'Paris remains one of the most popular tourist destinations in the world.',
    level: 'B1', category: 'travel',
  },
  {
    word: 'recommend',     phonetic: '/ˌrekəˈmend/',
    translation: "Tavsiya etmoq, maslahat bermoq",
    exampleSentence: 'Can you recommend a good restaurant near the city centre?',
    level: 'A2', category: 'travel',
  },
  {
    word: 'reserve',       phonetic: '/rɪˈzɜːrv/',
    translation: "Bron qilmoq, zahira",
    exampleSentence: 'I\'d like to reserve a table for four people this Saturday evening.',
    level: 'B1', category: 'travel',
  },
  {
    word: 'journey',       phonetic: '/ˈdʒɜːrni/',
    translation: "Sayohat (yo'l), harakat",
    exampleSentence: 'The train journey from London to Edinburgh takes about four and a half hours.',
    level: 'A2', category: 'travel',
  },
  {
    word: 'departure',     phonetic: '/dɪˈpɑːrtʃər/',
    translation: "Jo'nash, ketish, uchish vaqti",
    exampleSentence: 'Our departure time is 6am, so don\'t be late to the airport.',
    level: 'B1', category: 'travel',
  },
  {
    word: 'career',        phonetic: '/kəˈrɪər/',
    translation: "Martaba, kasb, kasbiy yo'l",
    exampleSentence: 'She has had a highly successful career in international business.',
    level: 'B1', category: 'work',
  },
  {
    word: 'deadline',      phonetic: '/ˈdedlaɪn/',
    translation: "Muddat, oxirgi vaqt",
    exampleSentence: 'The deadline for submitting the report is this Friday at 5pm.',
    level: 'B1', category: 'work',
  },

  // ── Character & Emotions (10) ────────────────────────────────────────────────
  {
    word: 'admire',        phonetic: '/ədˈmaɪər/',
    translation: "Hayran bo'lmoq, qoyil qolmoq",
    exampleSentence: 'I really admire her courage and determination in difficult situations.',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'appreciate',    phonetic: '/əˈpriːʃieɪt/',
    translation: "Qadrlamoq, minnatdorlik bildirmoq",
    exampleSentence: 'I really appreciate your honesty — it means a great deal to me.',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'apologize',     phonetic: '/əˈpɒlədʒaɪz/',
    translation: "Kechirim so'ramoq, uzr so'ramoq",
    exampleSentence: 'He apologized sincerely for being rude during yesterday\'s meeting.',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'disappoint',    phonetic: '/ˌdɪsəˈpɔɪnt/',
    translation: "Hafsalasini pir qilmoq, umidini uzmoq",
    exampleSentence: 'I was deeply disappointed with the exam results after all that hard work.',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'fascinate',     phonetic: '/ˈfæsɪneɪt/',
    translation: "Maftun etmoq, qiziqtirmoq",
    exampleSentence: 'Ancient Egyptian history has always fascinated me deeply.',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'impress',       phonetic: '/ɪmˈpres/',
    translation: "Hayratga solmoq, ta'sir qoldirmoq",
    exampleSentence: 'Her confident presentation clearly impressed the entire interview panel.',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'nervous',       phonetic: '/ˈnɜːrvəs/',
    translation: "Xavotirli, asabiy, qo'rqoq",
    exampleSentence: 'I always feel nervous before important presentations at work.',
    level: 'A2', category: 'emotions',
  },
  {
    word: 'patient',       phonetic: '/ˈpeɪʃənt/',
    translation: "Sabr-toqatli, chidamli",
    exampleSentence: 'Learning any skill requires you to be very patient with yourself.',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'relief',        phonetic: '/rɪˈliːf/',
    translation: "Yengillik, xotirjamlik, qutulish",
    exampleSentence: 'What a relief — I thought I had missed the last bus home!',
    level: 'B1', category: 'emotions',
  },
  {
    word: 'tend',          phonetic: '/tend/',
    translation: "Odati bo'lmoq, moyil bo'lmoq",
    exampleSentence: 'She tends to work late on Fridays to finish the weekly reports.',
    level: 'B1', category: 'daily',
  },
]
