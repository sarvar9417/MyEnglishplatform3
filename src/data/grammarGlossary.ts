// Grammatik atamalar lug'ati — Ingliz → O'zbek standartlashtirilgan terminologiya.
// Maqsad: butun platformada bir xil o'zbekcha atamalar ishlatilishi (audit F4-2).
// `en` — ingliz atama, `uz` — to'liq o'zbekcha tarjima, `short` — qisqa shakl.

export interface GrammarTerm {
  en: string
  uz: string
  short: string
}

export const GRAMMAR_TERMS: GrammarTerm[] = [
  // Zamonlar (Tenses)
  { en: 'Present Simple',              uz: 'Oddiy hozirgi zamon',            short: 'hozirgi oddiy' },
  { en: 'Present Continuous',          uz: 'Davom etayotgan hozirgi zamon',  short: 'davomiy hozirgi' },
  { en: 'Present Perfect',             uz: 'Tugallangan hozirgi zamon',      short: 'tugallangan hozirgi' },
  { en: 'Present Perfect Continuous',  uz: 'Davomli tugallangan hozirgi zamon', short: 'davomli tugallangan hozirgi' },
  { en: 'Past Simple',                 uz: "Oddiy o'tgan zamon",             short: "o'tgan oddiy" },
  { en: 'Past Continuous',             uz: "Davomiy o'tgan zamon",           short: "davomiy o'tgan" },
  { en: 'Past Perfect',                uz: "Tugallangan o'tgan zamon",       short: "tugallangan o'tgan" },
  { en: 'Past Perfect Continuous',     uz: "Davomli tugallangan o'tgan zamon", short: "davomli tugallangan o'tgan" },
  { en: 'Future Simple',               uz: 'Oddiy kelasi zamon',             short: 'kelasi oddiy' },
  { en: 'Future Continuous',           uz: 'Davomiy kelasi zamon',           short: 'davomiy kelasi' },
  { en: 'Future Perfect',              uz: 'Tugallangan kelasi zamon',       short: 'tugallangan kelasi' },
  { en: 'Tense',                       uz: 'Zamon',                          short: 'zamon' },

  // Nisbat va gap turlari
  { en: 'Active voice',                uz: "Ma'lum nisbat",                  short: "ma'lum" },
  { en: 'Passive voice',               uz: 'Majhul nisbat',                  short: 'majhul' },
  { en: 'Conditional',                 uz: 'Shart gap',                      short: 'shart' },
  { en: 'First Conditional',           uz: 'Birinchi tur shart gap (real)',  short: '1-shart' },
  { en: 'Second Conditional',          uz: 'Ikkinchi tur shart gap (noreal hozirgi)', short: '2-shart' },
  { en: 'Third Conditional',           uz: "Uchinchi tur shart gap (noreal o'tgan)", short: '3-shart' },
  { en: 'Relative clause',             uz: 'Aniqlovchi ergash gap',          short: 'aniqlovchi' },
  { en: 'Reported speech',             uz: 'Bilvosita (ko\'chirma) nutq',    short: 'bilvosita' },
  { en: 'Clause',                      uz: 'Ergash/bosh gap',                short: 'gap bo\'lagi' },
  { en: 'Phrase',                      uz: 'Ibora (so\'z birikmasi)',        short: 'ibora' },

  // So'z turkumlari (Parts of speech)
  { en: 'Noun',                        uz: 'Ot',                             short: 'ot' },
  { en: 'Verb',                        uz: "Fe'l",                           short: "fe'l" },
  { en: 'Adjective',                   uz: 'Sifat',                          short: 'sifat' },
  { en: 'Adverb',                      uz: 'Ravish',                         short: 'ravish' },
  { en: 'Pronoun',                     uz: 'Olmosh',                         short: 'olmosh' },
  { en: 'Preposition',                 uz: "Predlog (ko'makchi)",            short: 'predlog' },
  { en: 'Conjunction',                 uz: "Bog'lovchi",                     short: "bog'lovchi" },
  { en: 'Article',                     uz: 'Artikl (aniqlik ko\'rsatkichi)', short: 'artikl' },
  { en: 'Determiner',                  uz: 'Aniqlovchi (determiner)',        short: 'aniqlovchi soz' },
  { en: 'Modal verb',                  uz: "Modal fe'l",                     short: 'modal' },
  { en: 'Auxiliary verb',              uz: "Yordamchi fe'l",                 short: 'yordamchi' },
  { en: 'Gerund',                      uz: 'Gerundiy (V-ing ot shakli)',     short: 'gerundiy' },
  { en: 'Infinitive',                  uz: 'Infinitiv (to + V)',             short: 'infinitiv' },
  { en: 'Participle',                  uz: 'Sifatdosh (participle)',         short: 'sifatdosh' },
  { en: 'Phrasal verb',                uz: "Frazeologik fe'l (phrasal verb)", short: 'frazeologik' },
  { en: 'Collocation',                 uz: "Turg'un so'z birikmasi (collocation)", short: 'kollokatsiya' },

  // Gap bo'laklari va daraja
  { en: 'Subject',                     uz: 'Ega',                            short: 'ega' },
  { en: 'Predicate',                   uz: 'Kesim',                          short: 'kesim' },
  { en: 'Object',                      uz: "To'ldiruvchi",                   short: "to'ldiruvchi" },
  { en: 'Comparative',                 uz: 'Qiyosiy daraja',                 short: 'qiyosiy' },
  { en: 'Superlative',                 uz: 'Orttirma daraja',                short: 'orttirma' },
  { en: 'Countable noun',              uz: 'Sanaladigan ot',                 short: 'sanaladigan' },
  { en: 'Uncountable noun',            uz: 'Sanalmaydigan ot',               short: 'sanalmaydigan' },
  { en: 'Question tag',                uz: 'Savol qo\'shimchasi (..., isn\'t it?)', short: 'savol qoshimchasi' },
]
