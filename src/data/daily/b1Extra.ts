// AVTO-import: Supabase lessons jadvalidan ko’chirilgan darslar (kurikulum
// bo’shliqlarini to’ldirish uchun). Endi lokal kurikulumning bir qismi.
import type { DailyLesson } from '../dailyLessons'

export const relativeClausesB1: DailyLesson = {
  "id": "relative-clauses-b1",
  "title": "Relative Clauses",
  "subtitle": "Defining va Non-defining — who/which/that/where/when",
  "level": "B1",
  "day": 35,
  "formulas": [
    {
      "color": "green",
      "label": "Defining (aniqlovchi)",
      "structure": "who/which/that/where/when + clause\nThe man who lives next door is a doctor."
    },
    {
      "color": "blue",
      "label": "Non-defining (qo'shimcha)",
      "structure": ", who/which/where/when + clause,\nMy father, who is 60, works as a teacher."
    },
    {
      "color": "orange",
      "label": "Whose (egalik)",
      "structure": "whose + noun + clause\nThe student whose bag was stolen is upset."
    },
    {
      "color": "purple",
      "label": "Whom (obekt)",
      "structure": "whom + clause (rasmiy)\nThe man whom I met was very kind."
    }
  ],
  "rules": [
    "1 RELATIVE CLAUSES NIMA",
    "Relative clauses ot haqida qo'shimcha ma'lumot beradi",
    "Defining (aniqlovchi) kim haqida ekanini aniqlaydi",
    "Non-defining (qo'shimcha) qo'shimcha ma'lumot beradi",
    "2 DEFINING RELATIVE CLAUSES",
    "WHO odamlar, WHICH narsalar uchun",
    "THAT defining da odam va narsa uchun ishlatiladi",
    "WHERE joy, WHEN vaqt uchun",
    "3 NON-DEFINING RELATIVE CLAUSES",
    "Vergul bilan ajratiladi, THAT ishlatilmaydi",
    "Qo'shimcha ma'lumot, busiz gap mantiqli",
    "4 WHOSE VA WHOM",
    "WHOSE egalik (kimningdir narsasi)",
    "WHOM obekt (rasmiy), kundalikda who ishlatiladi",
    "5 OBJEKTNI TUSHIRISH",
    "Obekt vazifasidagini tushirish mumkin",
    "Ega vazifasidagini tushirib bo'lmaydi",
    "6 OZBEKCHA XATOLAR",
    "Who va which ni aralashtirish",
    "That ni non-defining da ishlatish",
    "Vergulni unutish non-defining da",
    "Whose ni unutish"
  ],
  "vocabulary": [
    {
      "en": "who",
      "uz": "kimki (odamlar)",
      "rule": "people-subject",
      "example": "The man who called you."
    },
    {
      "en": "which",
      "uz": "qaysiki (narsalar)",
      "rule": "things",
      "example": "The book which I read."
    },
    {
      "en": "that",
      "uz": "kimki/qaysiki",
      "rule": "defining only",
      "example": "The man that called you."
    },
    {
      "en": "where",
      "uz": "qayerda (joy)",
      "rule": "place",
      "example": "The city where I was born."
    },
    {
      "en": "when",
      "uz": "qachon (vaqt)",
      "rule": "time",
      "example": "The day when we met."
    },
    {
      "en": "whose",
      "uz": "kimning (egalik)",
      "rule": "possession",
      "example": "The girl whose father is a doctor."
    },
    {
      "en": "whom",
      "uz": "kimni (obekt, rasmiy)",
      "rule": "object-formal",
      "example": "The man whom I met."
    },
    {
      "en": "defining",
      "uz": "aniqlovchi",
      "rule": "essential",
      "example": "Defining identifies which person."
    },
    {
      "en": "non-defining",
      "uz": "qo'shimcha ma'lumot",
      "rule": "additional",
      "example": "Non-defining adds extra info."
    },
    {
      "en": "relative pronoun",
      "uz": "nisbiy olmosh",
      "rule": "connector",
      "example": "Who, which, that."
    },
    {
      "en": "antecedent",
      "uz": "oldin kelgan so'z",
      "rule": "reference",
      "example": "Noun before relative clause."
    },
    {
      "en": "clause",
      "uz": "bo'lak, gap qismi",
      "rule": "part of sentence",
      "example": "A clause has subject and verb."
    }
  ],
  "examples": [
    {
      "en": "The woman who lives next door is a teacher.",
      "uz": "Yon qoshnida yashaydigan ayol oqituvchi."
    },
    {
      "en": "The book which I borrowed was very interesting.",
      "uz": "Men olgan kitob juda qiziqarli edi."
    },
    {
      "en": "My sister, who lives in New York, is a designer.",
      "uz": "Singlim, u Nyu-Yorkda yashaydi, dizayner."
    },
    {
      "en": "The restaurant where we had dinner was amazing.",
      "uz": "Kechki ovqat yegan restoran ajoyib edi."
    },
    {
      "en": "The student whose phone rang was embarrassed.",
      "uz": "Telefoni jiringlagan oquvchi uyaldi."
    },
    {
      "en": "The man whom I met yesterday is famous.",
      "uz": "Kecha uchrashgan odam mashhur yozuvchi."
    },
    {
      "en": "I remember the day when we first met.",
      "uz": "Birinchi marta uchrashgan kunimizni eslayman."
    },
    {
      "en": "Paris, where we spent our holiday, is beautiful.",
      "uz": "Parij, u yerda dam olganmiz, chiroyli."
    }
  ],
  "specialCases": [
    {
      "id": "defining-vs-non-defining",
      "rule": "DEFINING: gap ma'nosi uchun MUHIM, vergul YOQ, THAT mumkin. NON-DEFINING: qo'shimcha, vergul BOR, THAT mumkin EMAS.",
      "title": "Defining va Non-defining farqi",
      "drills": [
        {
          "id": 26001,
          "type": "fill-blank",
          "blanks": [
            "who"
          ],
          "question": "My mother, ___ is kind, helps everyone.",
          "explanation": "Non-defining -> who",
          "instruction": "That yoki who:"
        },
        {
          "id": 26002,
          "type": "multiple-choice",
          "correct": "who (commas)",
          "options": [
            "who (commas)",
            "who (no commas)",
            "that (commas)",
            "which (commas)"
          ],
          "question": "My father, ___ is 60, still works.",
          "explanation": "Non-defining -> commas + who",
          "instruction": "Defining/non-defining:"
        },
        {
          "id": 26003,
          "type": "error-correction",
          "correct": "My mother, who is a doctor, works hard.",
          "question": "My mother, that is a doctor, works hard.",
          "errorPart": "that",
          "explanation": "Non-defining: that ishlatilmaydi",
          "instruction": "Xato:"
        }
      ],
      "examples": [
        {
          "en": "The students who study hard pass.",
          "uz": "Faqat qattiq oqigan talabalar otadi."
        },
        {
          "en": "The students, who study hard, pass.",
          "uz": "Hamma talabalar qattiq oqiydi va otadi."
        }
      ],
      "mnemonic": "DEFINING = no commas, THAT allowed. NON-DEFINING = commas, THAT not allowed.",
      "commonMistakes": "My mother, that is a doctor (who kerak)"
    },
    {
      "id": "relative-pronoun-omission",
      "rule": "Obekt vazifasidagini tushirish MUMKIN. Ega vazifasidagini tushirib BOLMAYDI.",
      "title": "Relative pronounni tushirish",
      "drills": [
        {
          "id": 26004,
          "type": "fill-blank",
          "blanks": [
            "that"
          ],
          "question": "The book (___) I read was interesting.",
          "explanation": "Obekt -> tushirish mumkin",
          "instruction": "Pronounni tushir:"
        },
        {
          "id": 26005,
          "type": "error-correction",
          "correct": "The man who lives next door is a doctor.",
          "question": "The man lives next door is a doctor.",
          "errorPart": "lives",
          "explanation": "Ega -> who kerak",
          "instruction": "Xato:"
        },
        {
          "id": 26006,
          "type": "multiple-choice",
          "correct": "which",
          "options": [
            "who",
            "which",
            "whose",
            "where"
          ],
          "question": "The cake ___ I made was delicious.",
          "explanation": "Narsa + obekt -> which",
          "instruction": "Tanlang:"
        }
      ],
      "examples": [
        {
          "en": "The film (that) we watched was boring.",
          "uz": "Biz ko'rgan film zerikarli edi."
        },
        {
          "en": "The person who called you is waiting.",
          "uz": "Sizga qo'ng'iroq qilgan odam kutmoqda."
        }
      ],
      "mnemonic": "Pronoun + noun -> tushirish mumkin. Pronoun + verb -> mumkin emas.",
      "commonMistakes": "The man lives next door is kind (who lives)"
    },
    {
      "id": "whose-whom-usage",
      "rule": "WHOSE = egalik (kimning). WHOM = obekt (rasmiy).",
      "title": "Whose va Whom",
      "drills": [
        {
          "id": 26007,
          "type": "fill-blank",
          "blanks": [
            "whose"
          ],
          "question": "The girl ___ bag was stolen cried.",
          "explanation": "Whose + bag",
          "instruction": "Whose:"
        },
        {
          "id": 26008,
          "type": "fill-blank",
          "blanks": [
            "whom"
          ],
          "question": "The actor ___ I admire most is DiCaprio.",
          "explanation": "Whom = obekt",
          "instruction": "Whom:"
        },
        {
          "id": 26009,
          "type": "error-correction",
          "correct": "The man whose phone rang left.",
          "question": "The man his phone rang left.",
          "errorPart": "his phone",
          "explanation": "Whose = egalik",
          "instruction": "Xato:"
        }
      ],
      "examples": [
        {
          "en": "The student whose laptop was stolen reported it.",
          "uz": "Noutbuki ogirlangan oquvchi xabar berdi."
        },
        {
          "en": "The writer whom I admire most is Hemingway.",
          "uz": "Men eng hayrat qiladigan yozuvchi Xeminguey."
        }
      ],
      "mnemonic": "Whose = possession. Whom = object (formal).",
      "commonMistakes": "The man his car is red (whose car)"
    }
  ],
  "exercises": [
    {
      "id": 2601,
      "type": "fill-blank",
      "blanks": [
        "who"
      ],
      "question": "The woman ___ lives next door is a nurse.",
      "explanation": "Who = odamlar",
      "instruction": "Who/which:"
    },
    {
      "id": 2602,
      "type": "fill-blank",
      "blanks": [
        "which"
      ],
      "question": "The car ___ is parked outside is mine.",
      "explanation": "Which = narsalar",
      "instruction": "Who/which:"
    },
    {
      "id": 2603,
      "type": "fill-blank",
      "blanks": [
        "that"
      ],
      "question": "The book ___ I read was fantastic.",
      "explanation": "That = defining",
      "instruction": "That:"
    },
    {
      "id": 2604,
      "type": "fill-blank",
      "blanks": [
        "where"
      ],
      "question": "The town ___ I grew up is small.",
      "explanation": "Where = joy",
      "instruction": "Where:"
    },
    {
      "id": 2605,
      "type": "fill-blank",
      "blanks": [
        "when"
      ],
      "question": "I remember the year ___ we travelled.",
      "explanation": "When = vaqt",
      "instruction": "When:"
    },
    {
      "id": 2606,
      "type": "multiple-choice",
      "correct": "who",
      "options": [
        "which",
        "whose",
        "who",
        "where"
      ],
      "question": "The man ___ called you is my brother.",
      "explanation": "Who = odam",
      "instruction": "Tanlang:"
    },
    {
      "id": 2607,
      "type": "multiple-choice",
      "correct": "which",
      "options": [
        "who",
        "whose",
        "which",
        "where"
      ],
      "question": "The film ___ we saw was boring.",
      "explanation": "Which = narsa",
      "instruction": "Tanlang:"
    },
    {
      "id": 2608,
      "type": "multiple-choice",
      "correct": "who",
      "options": [
        "that",
        "which",
        "who",
        "whose"
      ],
      "question": "My sister, ___ lives in Paris, is coming.",
      "explanation": "Non-defining -> who",
      "instruction": "Tanlang:"
    },
    {
      "id": 2609,
      "type": "multiple-choice",
      "correct": "whose",
      "options": [
        "who",
        "which",
        "whose",
        "that"
      ],
      "question": "The student ___ phone rang was embarrassed.",
      "explanation": "Whose = egalik",
      "instruction": "Tanlang:"
    },
    {
      "id": 2610,
      "type": "multiple-choice",
      "correct": "My mother, who is kind",
      "options": [
        "My mother, that is kind",
        "My mother, who is kind",
        "My mother which is kind",
        "My mother whose kind"
      ],
      "question": "Non-defining uchun CORRECT?",
      "explanation": "Non-defining -> who",
      "instruction": "Tanlang:"
    },
    {
      "id": 2611,
      "type": "error-correction",
      "correct": "The book which I read was interesting.",
      "question": "The book who I read was interesting.",
      "errorPart": "who",
      "explanation": "Narsa -> which",
      "instruction": "Xato:"
    },
    {
      "id": 2612,
      "type": "error-correction",
      "correct": "My father, who is 60, still works.",
      "question": "My father, that is 60, still works.",
      "errorPart": "that",
      "explanation": "Non-defining -> who",
      "instruction": "Xato:"
    },
    {
      "id": 2613,
      "type": "error-correction",
      "correct": "The man who lives next door is a doctor.",
      "question": "The man lives next door is a doctor.",
      "errorPart": "lives",
      "explanation": "Ega -> who kerak",
      "instruction": "Xato:"
    },
    {
      "id": 2614,
      "type": "error-correction",
      "correct": "The woman whose car was stolen called police.",
      "question": "The woman her car was stolen called police.",
      "errorPart": "her car",
      "explanation": "Whose = egalik",
      "instruction": "Xato:"
    },
    {
      "id": 2615,
      "hint": "I know a girl who...",
      "type": "transformation",
      "correct": "I know a girl who can speak five languages.",
      "question": "I know a girl. She can speak five languages.",
      "explanation": "Who = birlashtirish",
      "instruction": "Birlashtiring:"
    },
    {
      "id": 2616,
      "hint": "The book which...",
      "type": "transformation",
      "correct": "The book which I bought was expensive.",
      "question": "I bought a book. It was expensive.",
      "explanation": "Which = narsalar",
      "instruction": "Relative clause:"
    },
    {
      "id": 2617,
      "hint": "My brother, who...",
      "type": "transformation",
      "correct": "My brother, who lives in Tashkent, is a doctor.",
      "question": "My brother is a doctor. He lives in Tashkent.",
      "explanation": "Non-defining",
      "instruction": "Non-defining:"
    },
    {
      "id": 2618,
      "type": "fill-blank",
      "blanks": [
        "that"
      ],
      "question": "The meal (___) we had was delicious.",
      "explanation": "Obekt -> tushirish mumkin",
      "instruction": "Pronoun tushir:"
    },
    {
      "id": 2619,
      "type": "fill-blank",
      "blanks": [
        "whose"
      ],
      "question": "The family ___ house was destroyed got help.",
      "explanation": "Whose + house",
      "instruction": "Whose:"
    },
    {
      "id": 2620,
      "type": "multiple-choice",
      "correct": "The man who lives next door is kind",
      "options": [
        "The man who lives next door is kind",
        "The man lives next door is kind",
        "The man which lives next door is kind",
        "The man whose lives next door is kind"
      ],
      "question": "Which is CORRECT?",
      "explanation": "Who = ega",
      "instruction": "Tanlang:"
    },
    {
    "id": 2621,
    "type": "fill-blank",
    "blanks": [
        "whose"
    ],
    "question": "The girl ___ brother is a pilot studies with me.",
    "explanation": "Whose = egalik",
    "instruction": "Whose:"
},
    {
    "id": 2622,
    "type": "fill-blank",
    "blanks": [
        "whom"
    ],
    "question": "The professor ___ I respect most is Dr. Karimov.",
    "explanation": "Whom = obekt",
    "instruction": "Whom:"
},
    {
    "id": 2623,
    "type": "fill-blank",
    "blanks": [
        "that"
    ],
    "question": "Everything ___ you said is true.",
    "explanation": "Everything + that",
    "instruction": "That:"
},
    {
    "id": 2624,
    "type": "fill-blank",
    "blanks": [
        "where"
    ],
    "question": "Is this the hotel ___ you stayed last summer?",
    "explanation": "Where = joy",
    "instruction": "Where:"
},
    {
    "id": 2625,
    "type": "fill-blank",
    "blanks": [
        "when"
    ],
    "question": "Do you remember the summer ___ we went to the mountains?",
    "explanation": "When = vaqt",
    "instruction": "When:"
},
    {
    "id": 2626,
    "type": "multiple-choice",
    "correct": "who",
    "options": [
        "which",
        "who",
        "whose",
        "where"
    ],
    "question": "The woman ___ won the prize is my aunt.",
    "explanation": "Who = odam",
    "instruction": "Tanlang:"
},
    {
    "id": 2627,
    "type": "multiple-choice",
    "correct": "which",
    "options": [
        "who",
        "whose",
        "which",
        "when"
    ],
    "question": "I need a job ___ pays well.",
    "explanation": "Which = narsa",
    "instruction": "Tanlang:"
},
    {
    "id": 2628,
    "type": "multiple-choice",
    "correct": "The house which I bought",
    "options": [
        "The house which I bought",
        "The house who I bought",
        "The house where I bought",
        "The house whom I bought"
    ],
    "question": "CORRECT defining clause:",
    "explanation": "Which = narsa",
    "instruction": "Tanlang:"
},
    {
    "id": 2629,
    "type": "multiple-choice",
    "correct": "My uncle, who lives in Samarkand, is a doctor",
    "options": [
        "My uncle, who lives in Samarkand, is a doctor",
        "My uncle who lives in Samarkand is a doctor",
        "My uncle, that lives in Samarkand, is a doctor",
        "My uncle which lives in Samarkand is a doctor"
    ],
    "question": "Non-defining uchun CORRECT?",
    "explanation": "Non-defining -> commas + who",
    "instruction": "Tanlang:"
},
    {
    "id": 2630,
    "type": "error-correction",
    "correct": "The person who called you is waiting.",
    "question": "The person called you is waiting.",
    "errorPart": "called",
    "explanation": "Ega -> pronoun kerak",
    "instruction": "Xato:"
},
    {
    "id": 2631,
    "type": "error-correction",
    "correct": "I liked the film which you recommended.",
    "question": "I liked the film who you recommended.",
    "errorPart": "who",
    "explanation": "Narsa -> which",
    "instruction": "Xato:"
},
    {
    "id": 2632,
    "type": "error-correction",
    "correct": "Tashkent, where I was born, is beautiful.",
    "question": "Tashkent, that I was born, is beautiful.",
    "errorPart": "that",
    "explanation": "Non-defining -> where",
    "instruction": "Xato:"
},
    {
    "id": 2633,
    "type": "transformation",
    "hint": "The man who...",
    "correct": "The man who fixed my car was very professional.",
    "question": "The man fixed my car. He was very professional.",
    "explanation": "Who = birlashtirish",
    "instruction": "Birlashtiring:"
},
    {
    "id": 2634,
    "type": "transformation",
    "hint": "The restaurant where...",
    "correct": "The restaurant where we ate had excellent service.",
    "question": "We ate at a restaurant. It had excellent service.",
    "explanation": "Where = joy",
    "instruction": "Birlashtiring:"
},
    {
    "id": 2635,
    "type": "transformation",
    "hint": "The children whose...",
    "correct": "The children whose parents volunteered got a prize.",
    "question": "Some children got a prize. Their parents volunteered.",
    "explanation": "Whose = egalik",
    "instruction": "Birlashtiring:"
},
    {
    "id": 2636,
    "type": "multiple-choice",
    "correct": "whom",
    "options": [
        "who",
        "whom",
        "whose",
        "which"
    ],
    "question": "Formal: The candidate ___ we interviewed.",
    "explanation": "Whom = obekt",
    "instruction": "Tanlang:"
},
    {
    "id": 2637,
    "type": "fill-blank",
    "blanks": [
        "which"
    ],
    "question": "The gift ___ I received was very thoughtful.",
    "explanation": "Which = narsa",
    "instruction": "Pronoun:"
}
  ],
  "exerciseSections": [
    {
      "ids": [
        2601,
        2602,
        2603,
        2604,
        2605
      ],
      "desc": "Who/Which/That",
      "icon": "F1",
      "color": "bg-emerald-500",
      "title": "Boshlangich"
    },
    {
      "ids": [
        2606,
        2607,
        2608,
        2609,
        2610
      ],
      "desc": "MCQ",
      "icon": "B8",
      "color": "bg-blue-500",
      "title": "Ortacha"
    },
    {
      "ids": [
        2611,
        2612,
        2613,
        2614,
        2615
      ],
      "desc": "Error correction",
      "icon": "AA",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        2616,
        2617,
        2618,
        2619,
        2620,
        2621,
        2622,
        2623,
        2624,
        2625,
        2626,
        2627,
        2628,
        2629,
        2630,
        2631,
        2632,
        2633,
        2634,
        2635,
        2636,
        2637
      ],
      "desc": "Transformation + Qo'shimcha",
      "icon": "C6",
      "color": "bg-rose-500",
      "title": "Murakkab"
    }
  ],
  "tests": [
    {
      "id": 261,
      "type": "multiple-choice",
      "correct": "who",
      "options": [
        "which",
        "who",
        "where",
        "when"
      ],
      "question": "Odamlar uchun relative pronoun?",
      "explanation": "Who = odamlar",
      "instruction": "Asosiy"
    },
    {
      "id": 262,
      "type": "multiple-choice",
      "correct": "which",
      "options": [
        "who",
        "whose",
        "which",
        "when"
      ],
      "question": "Narsalar uchun?",
      "explanation": "Which = narsalar",
      "instruction": "Asosiy"
    },
    {
      "id": 263,
      "type": "multiple-choice",
      "correct": "defining",
      "options": [
        "non-defining",
        "defining",
        "faqat odam",
        "faqat narsa"
      ],
      "question": "That qachon ishlatiladi?",
      "explanation": "That = defining only",
      "instruction": "Asosiy"
    },
    {
      "id": 264,
      "type": "multiple-choice",
      "correct": "vergul bilan",
      "options": [
        "hech narsa",
        "vergul bilan",
        "nuqta bilan",
        "chiziqcha bilan"
      ],
      "question": "Non-defining qanday ajratiladi?",
      "explanation": "Non-defining = commas",
      "instruction": "Asosiy"
    },
    {
      "id": 265,
      "type": "multiple-choice",
      "correct": "joy",
      "options": [
        "vaqt",
        "odam",
        "joy",
        "sabab"
      ],
      "question": "Where qachon?",
      "explanation": "Where = joy",
      "instruction": "Asosiy"
    },
    {
      "id": 266,
      "type": "multiple-choice",
      "correct": "who",
      "options": [
        "which",
        "who",
        "whose",
        "where"
      ],
      "question": "The woman ___ lives next door is kind.",
      "explanation": "Who = odam",
      "instruction": "Ortacha"
    },
    {
      "id": 267,
      "type": "multiple-choice",
      "correct": "which",
      "options": [
        "who",
        "whose",
        "which",
        "where"
      ],
      "question": "The book ___ I read was interesting.",
      "explanation": "Which = narsa",
      "instruction": "Ortacha"
    },
    {
      "id": 268,
      "type": "multiple-choice",
      "correct": "who",
      "options": [
        "that",
        "which",
        "who",
        "whose"
      ],
      "question": "My sister, ___ is a doctor, lives in London.",
      "explanation": "Non-defining -> who",
      "instruction": "Ortacha"
    },
    {
      "id": 269,
      "type": "multiple-choice",
      "correct": "whose",
      "options": [
        "who",
        "which",
        "whose",
        "that"
      ],
      "question": "The student ___ phone rang left.",
      "explanation": "Whose = egalik",
      "instruction": "Ortacha"
    },
    {
      "id": 270,
      "type": "multiple-choice",
      "correct": "where",
      "options": [
        "who",
        "which",
        "where",
        "when"
      ],
      "question": "The town ___ I grew up is small.",
      "explanation": "Where = joy",
      "instruction": "Ortacha"
    },
    {
      "id": 271,
      "type": "multiple-choice",
      "correct": "that",
      "options": [
        "who",
        "which",
        "that",
        "where"
      ],
      "question": "Non-defining da qaysi pronoun ISHLATILMAYDI?",
      "explanation": "Non-defining: that yoq",
      "instruction": "Qiyin"
    },
    {
      "id": 272,
      "type": "multiple-choice",
      "correct": "whom",
      "options": [
        "who",
        "whom",
        "whose",
        "which"
      ],
      "question": "The man ___ I met is famous (rasmiy).",
      "explanation": "Whom = obekt",
      "instruction": "Qiyin"
    },
    {
      "id": 273,
      "type": "multiple-choice",
      "correct": "Students who study pass.",
      "options": [
        "Students, who study, pass.",
        "Students who study pass.",
        "Students which study pass.",
        "Students whom study pass."
      ],
      "question": "Faqat oqigan talabalar otadi?",
      "explanation": "Defining (vergulsiz)",
      "instruction": "Qiyin"
    },
    {
      "id": 274,
      "type": "multiple-choice",
      "correct": "My mother, who is kind, helps me",
      "options": [
        "The man lives next door is kind",
        "The book who I read was good",
        "My mother, who is kind, helps me",
        "The student which phone rang"
      ],
      "question": "Which is CORRECT?",
      "explanation": "Non-defining -> commas + who",
      "instruction": "Murakkab"
    },
    {
      "id": 275,
      "type": "multiple-choice",
      "correct": "The book which I bought",
      "options": [
        "The man who lives next door",
        "The book which I bought",
        "The car which is parked",
        "The woman who called you"
      ],
      "question": "Which pronoun can be OMITTED?",
      "explanation": "Obekt -> tushirish mumkin",
      "instruction": "Murakkab"
    }
  ],
  "testSections": [
    {
      "ids": [
        261,
        262,
        263,
        264,
        265
      ],
      "desc": "Pronounlar",
      "icon": "F1",
      "color": "bg-emerald-500",
      "title": "Oson"
    },
    {
      "ids": [
        266,
        267,
        268,
        269,
        270
      ],
      "desc": "Qollash",
      "icon": "B8",
      "color": "bg-blue-500",
      "title": "Ortacha"
    },
    {
      "ids": [
        271,
        272,
        273
      ],
      "desc": "Defining/Non-defining",
      "icon": "AA",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        274,
        275
      ],
      "desc": "Sinov",
      "icon": "C6",
      "color": "bg-rose-500",
      "title": "Murakkab"
    }
  ]
}

export const phrasalVerbsB1: DailyLesson = {
  "id": "phrasal-verbs-b1",
  "title": "Phrasal Verbs",
  "subtitle": "Separable va inseparable phrasal verbs: look after, give up, put off, etc.",
  "level": "B1",
  "day": 37,
  "formulas": [
    {
      "color": "green",
      "label": "Inseparable",
      "structure": "Verb + particle (together)\nI look after my sister."
    },
    {
      "color": "blue",
      "label": "Separable (noun)",
      "structure": "Verb + noun + particle\nI picked my friend up."
    },
    {
      "color": "red",
      "label": "Separable (pronoun)",
      "structure": "Verb + pronoun + particle\nI picked him up."
    },
    {
      "color": "orange",
      "label": "Three-word phrasal verb",
      "structure": "Verb + particle1 + particle2\nI look forward to meeting you."
    }
  ],
  "rules": [
    "1 PHRASAL VERBS NIMA",
    "Verb + particle (preposition/adverb) yangi mano",
    "Boshqa so'z bilan aralashib ketmasin",
    "2 INSEPARABLE PHRASAL VERBS",
    "Look after, run into, get over, care for, depend on",
    "Particle dan keyin obekt keladi",
    "3 SEPARABLE PHRASAL VERBS",
    "Pick up, turn off, put on, take off, give up, put away",
    "Noun: verb + particle + noun YOKI verb + noun + particle",
    "Pronoun: ALWAYS verb + pronoun + particle",
    "4 COMMON PHRASAL VERBS",
    "Get along with, find out, bring up, come across, carry out",
    "Look forward to, put up with, go through, take after, break down",
    "5 THREE-WORD PHRASAL VERBS",
    "Verb + particle1 + particle2: doim inseparable",
    "Run out of, get along with, look up to, put up with, come up with",
    "6 PHRASAL VERBS IN CONTEXT",
    "Doim kontekstga qarab tushuniladi",
    "Rasmiy tilda single word verb afzal (investigate vs look into)"
  ],
  "vocabulary": [
    {
      "en": "look after",
      "uz": "qaramoq",
      "rule": "inseparable",
      "example": "I look after my brother."
    },
    {
      "en": "give up",
      "uz": "tashlamoq, voz kechmoq",
      "rule": "separable",
      "example": "He gave up smoking."
    },
    {
      "en": "pick up",
      "uz": "olmoq, terib olmoq",
      "rule": "separable",
      "example": "Pick me up at 5."
    },
    {
      "en": "turn off",
      "uz": "ochirmoq",
      "rule": "separable",
      "example": "Turn off the TV."
    },
    {
      "en": "put on",
      "uz": "kiymoq, qoymoq",
      "rule": "separable",
      "example": "Put on your jacket."
    },
    {
      "en": "take after",
      "uz": "o'xshab ketmoq",
      "rule": "inseparable",
      "example": "She takes after her father."
    },
    {
      "en": "run into",
      "uz": "uchratib qolmoq (tasodifan)",
      "rule": "inseparable",
      "example": "I ran into Ali yesterday."
    },
    {
      "en": "get over",
      "uz": "o'tib ketmoq (tuzalmoq)",
      "rule": "inseparable",
      "example": "He got over the flu."
    },
    {
      "en": "look forward to",
      "uz": "intizor bolmoq",
      "rule": "three-word",
      "example": "I look forward to meeting you."
    },
    {
      "en": "put up with",
      "uz": "chidamoq",
      "rule": "three-word",
      "example": "I can't put up with this noise."
    },
    {
      "en": "find out",
      "uz": "bilib olmoq",
      "rule": "separable",
      "example": "Find out the truth."
    },
    {
      "en": "bring up",
      "uz": "tarbiyalamoq, gap ochmoq",
      "rule": "separable",
      "example": "She brought up three children."
    }
  ],
  "examples": [
    {
      "en": "Please look after my cat while I'm away.",
      "uz": "Men yo'qimda mushugimga qarang."
    },
    {
      "en": "He gave up smoking last year.",
      "uz": "U o'tgan yili chekishni tashladi."
    },
    {
      "en": "Can you pick me up at the airport?",
      "uz": "Meni aeroportda olib keta olasizmi?"
    },
    {
      "en": "Turn off the lights before leaving.",
      "uz": "Ketishdan oldin chiroqni o'chiring."
    },
    {
      "en": "She takes after her mother.",
      "uz": "U onasiga o'xshab ketgan."
    },
    {
      "en": "I ran into an old friend yesterday.",
      "uz": "Kecha eski do stirimni uchratib qoldim."
    },
    {
      "en": "I'm looking forward to the weekend.",
      "uz": "Dam olish kunini intizorlik bilan kutyapman."
    },
    {
      "en": "I can't put up with this noise anymore.",
      "uz": "Bu shovqinga boshqa chidolmayman."
    }
  ],
  "specialCases": [
    {
      "id": "separable-vs-inseparable",
      "rule": "SEPARABLE: noun ikkala tomonda, pronoun faqat orada. INSEPARABLE: doim birga.",
      "title": "Separable va Inseparable farqi",
      "drills": [
        {
          "id": 28001,
          "type": "fill-blank",
          "blanks": [
            "him up"
          ],
          "question": "I picked ___ (up / him / him up).",
          "explanation": "Pronoun + particle",
          "instruction": "Pronoun:"
        },
        {
          "id": 28002,
          "type": "error-correction",
          "correct": "Please pick me up at 5.",
          "question": "Please pick up me at 5.",
          "errorPart": "up me",
          "explanation": "Pronoun -> verb orasida",
          "instruction": "Xato:"
        },
        {
          "id": 28003,
          "type": "multiple-choice",
          "correct": "I look after him",
          "options": [
            "I look after him",
            "I look him after",
            "I look after he",
            "I look he after"
          ],
          "question": "Which is CORRECT?",
          "explanation": "Inseparable",
          "instruction": "Tanlang:"
        }
      ],
      "examples": [
        {
          "en": "I picked up my friend. / I picked my friend up.",
          "uz": "Do'stimni oldim."
        },
        {
          "en": "I picked him up. (not: I picked up him)",
          "uz": "Uni oldim."
        }
      ],
      "mnemonic": "Pronoun always between verb and particle for separable",
      "commonMistakes": "I look after him (to'g'ri). I look him after (noto'g'ri)"
    },
    {
      "id": "three-word-phrasal-verbs",
      "rule": "Verb + particle1 + particle2 = doim inseparable. Obekt particle2 dan keyin.",
      "title": "Three-word phrasal verbs",
      "drills": [
        {
          "id": 28004,
          "type": "fill-blank",
          "blanks": [
            "to"
          ],
          "question": "I look forward ___ hearing from you.",
          "explanation": "Look forward TO",
          "instruction": "Three-word:"
        },
        {
          "id": 28005,
          "type": "error-correction",
          "correct": "I look forward to meeting you.",
          "question": "I look forward to meet you.",
          "errorPart": "to meet",
          "explanation": "Look forward to + -ing",
          "instruction": "Xato:"
        },
        {
          "id": 28006,
          "type": "multiple-choice",
          "correct": "with",
          "options": [
            "with",
            "with it",
            "it",
            "to"
          ],
          "question": "She couldnt put up ___ the noise.",
          "explanation": "Put up WITH",
          "instruction": "Tanlang:"
        }
      ],
      "examples": [
        {
          "en": "I'm looking forward to meeting you.",
          "uz": "Siz bilan uchrashishni intiqlik bilan kutyapman."
        },
        {
          "en": "She came up with a great idea.",
          "uz": "U ajoyib fikr topdi."
        }
      ],
      "mnemonic": "Verb + prep + prep = object at the end always",
      "commonMistakes": "I look forward to meet you (meeting kerak)"
    },
    {
      "id": "phrasal-verb-vs-single",
      "rule": "Phrasal verb informal, single word formal. Contextga qarab tanlanadi.",
      "title": "Phrasal verb vs Single word verb",
      "drills": [
        {
          "id": 28007,
          "type": "fill-blank",
          "blanks": [
            "investigate"
          ],
          "question": "We need to ___ (investigate/look into) the matter formally.",
          "explanation": "Rasmiy -> single word",
          "instruction": "Formal:"
        },
        {
          "id": 28008,
          "type": "multiple-choice",
          "correct": "looked into",
          "options": [
            "investigated",
            "looked into",
            "examined",
            "analyzed"
          ],
          "question": "Informal: The company ___ the problem.",
          "explanation": "Phrasal = informal",
          "instruction": "Tanlang:"
        },
        {
          "id": 28009,
          "type": "error-correction",
          "correct": "The CEO examined the report.",
          "question": "The CEO looked into the report formally. (too informal)",
          "errorPart": "looked into",
          "explanation": "Formal -> single word",
          "instruction": "Xato:"
        }
      ],
      "examples": [
        {
          "en": "The police investigated the crime. (formal)",
          "uz": "Politsiya jinoyatni tekshirdi."
        },
        {
          "en": "The police looked into the crime. (informal)",
          "uz": "Politsiya jinoyatni ko'rib chiqdi."
        }
      ],
      "mnemonic": "Phrasal = daily talk, Single = academic/formal",
      "commonMistakes": "Rasmiy yozuvda phrasal verb ishlatish"
    }
  ],
  "exercises": [
    {
      "id": 2801,
      "type": "fill-blank",
      "blanks": [
        "look"
      ],
      "question": "Please ___ after the children.",
      "explanation": "Look after = qaramoq",
      "instruction": "Phrasal verb:"
    },
    {
      "id": 2802,
      "type": "fill-blank",
      "blanks": [
        "the light"
      ],
      "question": "Turn ___ off before leaving.",
      "explanation": "Light off = separator",
      "instruction": "Pronoun:"
    },
    {
      "id": 2803,
      "type": "fill-blank",
      "blanks": [
        "him"
      ],
      "question": "I picked ___ up at the station.",
      "explanation": "Pronoun before up",
      "instruction": "Pronoun:"
    },
    {
      "id": 2804,
      "type": "fill-blank",
      "blanks": [
        "after"
      ],
      "question": "She takes ___ her grandmother.",
      "explanation": "Take after = inseparable",
      "instruction": "Inseparable:"
    },
    {
      "id": 2805,
      "type": "fill-blank",
      "blanks": [
        "to"
      ],
      "question": "I'm looking forward ___ the party.",
      "explanation": "Look forward TO",
      "instruction": "Three-word:"
    },
    {
      "id": 2806,
      "type": "multiple-choice",
      "correct": "into",
      "options": [
        "after",
        "over",
        "into",
        "for"
      ],
      "question": "I ran ___ an old friend yesterday.",
      "explanation": "Run into = tasodifan uchrashish",
      "instruction": "Tanlang:"
    },
    {
      "id": 2807,
      "type": "multiple-choice",
      "correct": "up",
      "options": [
        "up",
        "in",
        "out",
        "off"
      ],
      "question": "He gave ___ smoking last year.",
      "explanation": "Give up = tashlamoq",
      "instruction": "Tanlang:"
    },
    {
      "id": 2808,
      "type": "multiple-choice",
      "correct": "on",
      "options": [
        "off",
        "on",
        "out",
        "away"
      ],
      "question": "Put ___ your jacket, its cold.",
      "explanation": "Put on = kiymoq",
      "instruction": "Tanlang:"
    },
    {
      "id": 2809,
      "type": "multiple-choice",
      "correct": "up",
      "options": [
        "off",
        "up",
        "out",
        "on"
      ],
      "question": "I can't put ___ with this noise.",
      "explanation": "Put up with = chidamoq",
      "instruction": "Tanlang:"
    },
    {
      "id": 2810,
      "type": "multiple-choice",
      "correct": "after",
      "options": [
        "after",
        "over",
        "up",
        "down"
      ],
      "question": "She takes ___ her mother.",
      "explanation": "Take after = oxshamoq",
      "instruction": "Tanlang:"
    },
    {
      "id": 2811,
      "type": "error-correction",
      "correct": "I look after him. (correct, inseparable)",
      "question": "I look after him. (separate)",
      "errorPart": "after him",
      "explanation": "Inseparable -> birga qoladi",
      "instruction": "Xato:"
    },
    {
      "id": 2812,
      "type": "error-correction",
      "correct": "Please pick me up at 5.",
      "question": "Please pick up me at 5.",
      "errorPart": "up me",
      "explanation": "Pronoun -> verb + pronoun + particle",
      "instruction": "Xato:"
    },
    {
      "id": 2813,
      "type": "error-correction",
      "correct": "I look forward to meeting you.",
      "question": "I look forward to meet you.",
      "errorPart": "to meet",
      "explanation": "Look forward to + -ing",
      "instruction": "Xato:"
    },
    {
      "id": 2814,
      "type": "error-correction",
      "correct": "Turn it off before leaving.",
      "question": "Turn off it before leaving.",
      "errorPart": "off it",
      "explanation": "Pronoun -> orada",
      "instruction": "Xato:"
    },
    {
      "id": 2815,
      "hint": "Please...",
      "type": "transformation",
      "correct": "Please care for the children.",
      "question": "Please look after the children. (use: care for)",
      "explanation": "Synonym",
      "instruction": "O'zgartiring:"
    },
    {
      "id": 2816,
      "hint": "He gave...",
      "type": "transformation",
      "correct": "He gave up smoking.",
      "question": "He stopped smoking. (use: give up)",
      "explanation": "Give up = tashlamoq",
      "instruction": "O'zgartiring:"
    },
    {
      "id": 2817,
      "hint": "I ran...",
      "type": "transformation",
      "correct": "I ran into her yesterday.",
      "question": "I met her by chance yesterday. (use: run into)",
      "explanation": "Run into = tasodifan uchrashmoq",
      "instruction": "O'zgartiring:"
    },
    {
      "id": 2818,
      "type": "fill-blank",
      "blanks": [
        "up"
      ],
      "question": "I picked my friend ___ after work.",
      "explanation": "Pick up = separable",
      "instruction": "Separable:"
    },
    {
      "id": 2819,
      "type": "fill-blank",
      "blanks": [
        "over"
      ],
      "question": "He couldnt get ___ his illness quickly.",
      "explanation": "Get over = tuzalmoq",
      "instruction": "Phrasal:"
    },
    {
      "id": 2820,
      "type": "multiple-choice",
      "correct": "I look forward to meeting you",
      "options": [
        "I look forward to meet you",
        "I look forward to meeting you",
        "I look forward meet you",
        "I look forward meeting you"
      ],
      "question": "Which is CORRECT?",
      "explanation": "Look forward to + -ing",
      "instruction": "Tanlang:"
    },
    {
    "id": 2821,
    "type": "fill-blank",
    "blanks": [
        "into"
    ],
    "question": "I ran ___ an old friend at the market.",
    "explanation": "Run into",
    "instruction": "Inseparable:"
},
    {
    "id": 2822,
    "type": "fill-blank",
    "blanks": [
        "out"
    ],
    "question": "We need to find ___ what happened.",
    "explanation": "Find out",
    "instruction": "Separable:"
},
    {
    "id": 2823,
    "type": "fill-blank",
    "blanks": [
        "through"
    ],
    "question": "She has been ___ a lot lately.",
    "explanation": "Go through",
    "instruction": "Phrasal:"
},
    {
    "id": 2824,
    "type": "multiple-choice",
    "correct": "off",
    "options": [
        "on",
        "off",
        "up",
        "down"
    ],
    "question": "Please turn ___ the TV before sleeping.",
    "explanation": "Turn off",
    "instruction": "Tanlang:"
},
    {
    "id": 2825,
    "type": "multiple-choice",
    "correct": "out",
    "options": [
        "in",
        "out",
        "up",
        "off"
    ],
    "question": "We ran ___ of milk.",
    "explanation": "Run out of",
    "instruction": "Tanlang:"
},
    {
    "id": 2826,
    "type": "multiple-choice",
    "correct": "bring up",
    "options": [
        "bring up",
        "look after",
        "give up",
        "put off"
    ],
    "question": "She had to ___ three children alone.",
    "explanation": "Bring up",
    "instruction": "Tanlang:"
},
    {
    "id": 2827,
    "type": "error-correction",
    "correct": "He takes after his father.",
    "question": "He takes his father after.",
    "errorPart": "his father after",
    "explanation": "Take after = inseparable",
    "instruction": "Xato:"
},
    {
    "id": 2828,
    "type": "error-correction",
    "correct": "Turn off the lights before leaving.",
    "question": "Turn the lights before leaving off.",
    "errorPart": "before leaving off",
    "explanation": "Separable: verb + particle + noun",
    "instruction": "Xato:"
},
    {
    "id": 2829,
    "type": "transformation",
    "hint": "I put on...",
    "correct": "I put on my jacket because it was cold.",
    "question": "I put my jacket on because it was cold.",
    "explanation": "Separable word order",
    "instruction": "O'zgartiring:"
},
    {
    "id": 2830,
    "type": "transformation",
    "hint": "She came up with...",
    "correct": "She came up with a brilliant idea.",
    "question": "She thought of a brilliant idea. (use: come up with)",
    "explanation": "Come up with",
    "instruction": "O'zgartiring:"
},
    {
    "id": 2831,
    "type": "fill-blank",
    "blanks": [
        "along"
    ],
    "question": "My sister and I get ___ well.",
    "explanation": "Get along",
    "instruction": "Phrasal:"
},
    {
    "id": 2832,
    "type": "fill-blank",
    "blanks": [
        "away"
    ],
    "question": "Please put ___ your toys.",
    "explanation": "Put away",
    "instruction": "Separable:"
},
    {
    "id": 2833,
    "type": "fill-blank",
    "blanks": [
        "down"
    ],
    "question": "The car broke ___ on the highway.",
    "explanation": "Break down",
    "instruction": "Inseparable:"
}
  ],
  "exerciseSections": [
    {
      "ids": [
        2801,
        2802,
        2803,
        2804,
        2805
      ],
      "desc": "Basic phrasal verbs",
      "icon": "F1",
      "color": "bg-emerald-500",
      "title": "Boshlangich"
    },
    {
      "ids": [
        2806,
        2807,
        2808,
        2809,
        2810
      ],
      "desc": "MCQ",
      "icon": "B8",
      "color": "bg-blue-500",
      "title": "Ortacha"
    },
    {
      "ids": [
        2811,
        2812,
        2813,
        2814,
        2815
      ],
      "desc": "Error correction",
      "icon": "AA",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        2816,
        2817,
        2818,
        2819,
        2820,
        2821,
        2822,
        2823,
        2824,
        2825,
        2826,
        2827,
        2828,
        2829,
        2830,
        2831,
        2832,
        2833
      ],
      "desc": "Transformation + Qo'shimcha",
      "icon": "C6",
      "color": "bg-rose-500",
      "title": "Murakkab"
    }
  ],
  "tests": [
    {
      "id": 281,
      "type": "multiple-choice",
      "correct": "qaramoq",
      "options": [
        "qaramoq",
        "qidirmoq",
        "kuzatmoq",
        "topmoq"
      ],
      "question": "Look after mani?",
      "explanation": "Look after = qaramoq",
      "instruction": "Asosiy"
    },
    {
      "id": 282,
      "type": "multiple-choice",
      "correct": "tashlamoq",
      "options": [
        "bermoq",
        "tashlamoq",
        "olmoq",
        "ochmoq"
      ],
      "question": "Give up mani?",
      "explanation": "Give up = tashlamoq",
      "instruction": "Asosiy"
    },
    {
      "id": 283,
      "type": "multiple-choice",
      "correct": "uchratib qolmoq",
      "options": [
        "yugurmoq",
        "kirib ketmoq",
        "uchratib qolmoq",
        "topmoq"
      ],
      "question": "Run into?",
      "explanation": "Run into = tasodifan uchrashish",
      "instruction": "Asosiy"
    },
    {
      "id": 284,
      "type": "multiple-choice",
      "correct": "ha",
      "options": [
        "ha",
        "yoq",
        "ba'zan",
        "three-word"
      ],
      "question": "Give up separable?",
      "explanation": "Give up = separable",
      "instruction": "Asosiy"
    },
    {
      "id": 285,
      "type": "multiple-choice",
      "correct": "inseparable",
      "options": [
        "separable",
        "inseparable",
        "three-word",
        "none"
      ],
      "question": "Look after?",
      "explanation": "Look after = inseparable",
      "instruction": "Asosiy"
    },
    {
      "id": 286,
      "type": "multiple-choice",
      "correct": "into",
      "options": [
        "after",
        "into",
        "over",
        "through"
      ],
      "question": "I ran ___ an old friend.",
      "explanation": "Run into",
      "instruction": "Ortacha"
    },
    {
      "id": 287,
      "type": "multiple-choice",
      "correct": "up",
      "options": [
        "in",
        "up",
        "out",
        "off"
      ],
      "question": "He gave ___ smoking.",
      "explanation": "Give up",
      "instruction": "Ortacha"
    },
    {
      "id": 288,
      "type": "multiple-choice",
      "correct": "on",
      "options": [
        "off",
        "on",
        "down",
        "away"
      ],
      "question": "Put ___ your jacket.",
      "explanation": "Put on",
      "instruction": "Ortacha"
    },
    {
      "id": 289,
      "type": "multiple-choice",
      "correct": "with",
      "options": [
        "for",
        "with",
        "to",
        "at"
      ],
      "question": "I put up ___ the noise.",
      "explanation": "Put up with",
      "instruction": "Ortacha"
    },
    {
      "id": 290,
      "type": "multiple-choice",
      "correct": "after",
      "options": [
        "after",
        "over",
        "up",
        "in"
      ],
      "question": "She takes ___ her father.",
      "explanation": "Take after",
      "instruction": "Ortacha"
    },
    {
      "id": 291,
      "type": "multiple-choice",
      "correct": "Yes, pronoun",
      "options": [
        "Yes, pronoun",
        "Yes, noun",
        "No",
        "Three-word"
      ],
      "question": "Pick me up -> separable?",
      "explanation": "Pronoun -> orada",
      "instruction": "Qiyin"
    },
    {
      "id": 292,
      "type": "multiple-choice",
      "correct": "look after him",
      "options": [
        "pick him up",
        "look after him",
        "turn it on",
        "give it up"
      ],
      "question": "Inseparable pronoun?",
      "explanation": "Look after = inseparable",
      "instruction": "Qiyin"
    },
    {
      "id": 293,
      "type": "multiple-choice",
      "correct": "look forward to",
      "options": [
        "look after",
        "give up",
        "look forward to",
        "pick up"
      ],
      "question": "Three-word phrasal verb?",
      "explanation": "Three-word",
      "instruction": "Qiyin"
    },
    {
      "id": 294,
      "type": "multiple-choice",
      "correct": "Pick me up",
      "options": [
        "Pick up me",
        "Pick me up",
        "Pick up I",
        "Pick I up"
      ],
      "question": "Which is CORRECT?",
      "explanation": "Pronoun -> orada",
      "instruction": "Murakkab"
    },
    {
      "id": 295,
      "type": "multiple-choice",
      "correct": "The CEO investigated the matter",
      "options": [
        "The CEO looked into the matter",
        "The CEO investigated the matter",
        "The CEO checked out the matter",
        "The CEO looked at the matter"
      ],
      "question": "Which is CORRECT formal?",
      "explanation": "Rasmiy -> single word",
      "instruction": "Murakkab"
    }
  ],
  "testSections": [
    {
      "ids": [
        281,
        282,
        283,
        284,
        285
      ],
      "desc": "Meanings",
      "icon": "F1",
      "color": "bg-emerald-500",
      "title": "Oson"
    },
    {
      "ids": [
        286,
        287,
        288,
        289,
        290
      ],
      "desc": "Qollash",
      "icon": "B8",
      "color": "bg-blue-500",
      "title": "Ortacha"
    },
    {
      "ids": [
        291,
        292,
        293
      ],
      "desc": "Separable/Inseparable",
      "icon": "AA",
      "color": "bg-violet-500",
      "title": "Qiyin"
    },
    {
      "ids": [
        294,
        295
      ],
      "desc": "Sinov",
      "icon": "C6",
      "color": "bg-rose-500",
      "title": "Murakkab"
    }
  ]
}
