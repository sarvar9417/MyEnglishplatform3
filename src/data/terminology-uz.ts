// ═══════════════════════════════════════════════════════════════════════════
// O'zbek tilidagi grammatik terminologiya lug'ati
// Har bir termin uchun: to'liq o'zbekcha nomi + qisqa shakl
// ═══════════════════════════════════════════════════════════════════════════

export interface GrammarTerm {
  uz: string       // To'liq o'zbekcha nom
  short: string    // Qisqa shakl (dars ichida ishlatish uchun)
  en: string       // Inglizcha original
  description?: string // Qisqa izoh (o'zbek tilida)
}

export const GRAMMAR_TERMS: Record<string, GrammarTerm> = {
  'Present Simple': {
    uz: 'Oddiy hozirgi zamon',
    short: 'hozirgi oddiy',
    en: 'Present Simple',
    description: 'Har kuni, doimiy, odat bo\'lgan harakatlar uchun',
  },
  'Present Continuous': {
    uz: 'Davom etayotgan hozirgi zamon',
    short: 'davomiy hozirgi',
    en: 'Present Continuous',
    description: 'Ayni paytda sodir bo\'layotgan harakatlar uchun',
  },
  'Present Perfect': {
    uz: 'Tugallangan hozirgi zamon',
    short: 'tugallangan hozirgi',
    en: 'Present Perfect',
    description: 'O\'tgan vaqtda boshlanib, hozirgacha bog\'liq bo\'lgan harakatlar',
  },
  'Present Perfect Continuous': {
    uz: 'Tugallangan davomiy hozirgi zamon',
    short: 'tugallangan davomiy hozirgi',
    en: 'Present Perfect Continuous',
  },
  'Past Simple': {
    uz: 'Oddiy o\'tgan zamon',
    short: 'o\'tgan oddiy',
    en: 'Past Simple',
    description: 'O\'tgan vaqtda tugallangan harakatlar uchun',
  },
  'Past Continuous': {
    uz: 'Davom etayotgan o\'tgan zamon',
    short: 'davomiy o\'tgan',
    en: 'Past Continuous',
    description: 'O\'tgan vaqtning biror nuqtasida davom etayotgan harakat',
  },
  'Past Perfect': {
    uz: 'Tugallangan o\'tgan zamon',
    short: 'tugallangan o\'tgan',
    en: 'Past Perfect',
  },
  'Past Perfect Continuous': {
    uz: 'Tugallangan davomiy o\'tgan zamon',
    short: 'tugallangan davomiy o\'tgan',
    en: 'Past Perfect Continuous',
  },
  'Future Simple': {
    uz: 'Oddiy kelasi zamon',
    short: 'kelasi oddiy',
    en: 'Future Simple',
    description: 'Kelajakda sodir bo\'ladigan harakatlar, bashoratlar, va\'dalar',
  },
  'Future Continuous': {
    uz: 'Davom etayotgan kelasi zamon',
    short: 'davomiy kelasi',
    en: 'Future Continuous',
  },
  'Future Perfect': {
    uz: 'Tugallangan kelasi zamon',
    short: 'tugallangan kelasi',
    en: 'Future Perfect',
  },
  'Modal verb': {
    uz: 'Modal fe\'l',
    short: 'modal',
    en: 'Modal verb',
    description: 'Imkoniyat, zaruriyat, ruxsat, majburiyat bildiruvchi fe\'llar (can, must, should)',
  },
  'Conditional': {
    uz: 'Shart gap',
    short: 'shart',
    en: 'Conditional',
    description: 'Biror shartga bog\'liq bo\'lgan harakat (if bilan)',
  },
  'Passive voice': {
    uz: 'Majhul nisbat',
    short: 'majhul',
    en: 'Passive voice',
    description: 'Harakat bajaruvchi emas, balki qabul qiluvchi muhim bo\'lganda',
  },
  'Active voice': {
    uz: 'Aniq nisbat',
    short: 'aniq',
    en: 'Active voice',
  },
  'Relative clause': {
    uz: 'Aniqlovchi gap',
    short: 'aniqlovchi',
    en: 'Relative clause',
    description: 'Who, which, that bilan boshlanuvchi qo\'shimcha ma\'lumot beruvchi gap',
  },
  'Reported speech': {
    uz: 'O\'zlashtirma gap',
    short: 'o\'zlashtirma',
    en: 'Reported speech',
    description: 'Birovning gapini keltirish (said that...)',
  },
  'Gerund': {
    uz: 'Gerundiy',
    short: 'gerundiy',
    en: 'Gerund',
    description: 'Fe\'lning -ing shakli, ot vazifasida ishlatiladi',
  },
  'Infinitive': {
    uz: 'Infinitiv',
    short: 'infinitiv',
    en: 'Infinitive',
    description: 'Fe\'lning to+verb shakli',
  },
  'Subject': {
    uz: 'Ega',
    short: 'ega',
    en: 'Subject',
  },
  'Predicate': {
    uz: 'Kesim',
    short: 'kesim',
    en: 'Predicate',
  },
  'Object': {
    uz: 'To\'ldiruvchi',
    short: 'to\'ldiruvchi',
    en: 'Object',
  },
  'Adjective': {
    uz: 'Sifat',
    short: 'sifat',
    en: 'Adjective',
  },
  'Adverb': {
    uz: 'Ravish',
    short: 'ravish',
    en: 'Adverb',
    description: 'Fe\'l, sifat yoki boshqa ravishni aniqlovchi so\'z (quickly, very)',
  },
  'Noun': {
    uz: 'Ot',
    short: 'ot',
    en: 'Noun',
  },
  'Verb': {
    uz: 'Fe\'l',
    short: 'fe\'l',
    en: 'Verb',
  },
  'Preposition': {
    uz: 'Ko\'makchi (predlog)',
    short: 'ko\'makchi',
    en: 'Preposition',
    description: 'Ot/olmoshdan oldin kelib, joy, vaqt, munosabat bildiruvchi so\'z (in, on, at)',
  },
  'Conjunction': {
    uz: 'Bog\'lovchi',
    short: 'bog\'lovchi',
    en: 'Conjunction',
    description: 'Ikki gap yoki so\'zni bog\'lovchi (and, but, or)',
  },
  'Article': {
    uz: 'Artikl',
    short: 'artikl',
    en: 'Article',
    description: 'Ot oldidan kelib, aniqlik/noaniqlik bildiruvchi so\'z (a, an, the)',
  },
  'Tense': {
    uz: 'Zamon',
    short: 'zamon',
    en: 'Tense',
  },
  'Pronoun': {
    uz: 'Olmosh',
    short: 'olmosh',
    en: 'Pronoun',
    description: 'Ot o\'rnida ishlatiluvchi so\'z (I, you, he, she, it, we, they)',
  },
  'Quantifier': {
    uz: 'Miqdor so\'z',
    short: 'miqdor',
    en: 'Quantifier',
    description: 'Miqdor bildiruvchi so\'zlar (some, any, much, many, a lot of)',
  },
  'Comparative': {
    uz: 'Qiyosiy daraja',
    short: 'qiyosiy',
    en: 'Comparative',
    description: 'Ikki narsani taqqoslash (bigger, more expensive)',
  },
  'Superlative': {
    uz: 'Orttirma daraja',
    short: 'orttirma',
    en: 'Superlative',
    description: 'Eng yuqori daraja (the biggest, the most expensive)',
  },
  'Negation': {
    uz: 'Inkor shakli',
    short: 'inkor',
    en: 'Negation',
    description: 'Gapni inkor qilish (not, don\'t, doesn\'t)',
  },
  'Question': {
    uz: 'So\'roq gap',
    short: 'so\'roq',
    en: 'Question',
  },
  'Command': {
    uz: 'Buyruq mayli',
    short: 'buyruq',
    en: 'Imperative / Command',
  },
  'Possessive': {
    uz: 'Egalik shakli',
    short: 'egalik',
    en: 'Possessive',
    description: 'Tegishlilik bildirish (my, your, his, her, its, our, their)',
  },
  'Reflexive': {
    uz: 'O\'zlik olmoshi',
    short: 'o\'zlik',
    en: 'Reflexive pronoun',
    description: 'Harakat egasining o\'ziga qaytishi (myself, yourself, himself)',
  },
  'Irregular verb': {
    uz: 'Noto\'g\'ri fe\'l',
    short: 'noto\'g\'ri fe\'l',
    en: 'Irregular verb',
    description: 'O\'tgan zamonda -ed qo\'shimchasini olmaydigan fe\'llar (go→went, eat→ate)',
  },
  'Phrasal verb': {
    uz: 'Fraza fe\'l',
    short: 'fraza fe\'l',
    en: 'Phrasal verb',
    description: 'Fe\'l + predlog birikmasi, ma\'nosi alohida so\'zlardan farqli (give up, look after)',
  },
  'Countable noun': {
    uz: 'Sanaladigan ot',
    short: 'sanaladigan',
    en: 'Countable noun',
    description: 'Son bilan sanash mumkin bo\'lgan otlar (book, apple, car)',
  },
  'Uncountable noun': {
    uz: 'Sanalmaydigan ot',
    short: 'sanalmaydigan',
    en: 'Uncountable noun',
    description: 'Son bilan sanab bo\'lmaydigan otlar (water, information, rice)',
  },
}

/** Terminni o'zbekcha qisqa shaklda qaytaradi */
export function termUz(enTerm: string): string {
  return GRAMMAR_TERMS[enTerm]?.short ?? enTerm
}

/** Terminni to'liq o'zbekcha nom bilan qaytaradi */
export function termUzFull(enTerm: string): string {
  return GRAMMAR_TERMS[enTerm]?.uz ?? enTerm
}

/** Terminni "To'liq nom (English Name)" formatida qaytaradi */
export function termUzBilingual(enTerm: string): string {
  const term = GRAMMAR_TERMS[enTerm]
  if (!term) return enTerm
  return `${term.uz} (${enTerm})`
}
