#!/usr/bin/env python3
"""Add productive exercises to lessons with 0 productive exercises."""
import re

def find_exercises_end(lines, start):
    depth = 0
    for j in range(start, len(lines)):
        for ch in lines[j]:
            if ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    return j
    return None

def add_to_file(fpath, lesson_id, new_exercises_text):
    with open(fpath) as fp:
        lines = fp.readlines()

    lesson_starts = []
    for i, line in enumerate(lines):
        if re.search(r'export const \w+: DailyLesson', line):
            for j in range(i, min(i+20, len(lines))):
                line = lines[j].strip()
                # Match: id: 'value', id: "value", "id": "value"
                if '"id"' in line and '": "' in line:
                    m = re.search(r'"id"\s*:\s*"([^"]+)"', line)
                    if m and m.group(1) not in ('true', 'false', 'null'):
                        lesson_starts.append((i, m.group(1)))
                        break
                elif line.startswith("id:") or line.startswith("'id':"):
                    m = re.search(r"id:\s*['\"]([^'\"]+)['\"]", line)
                    if m and m.group(1) not in ('true', 'false', 'null'):
                        lesson_starts.append((i, m.group(1)))
                        break
                    break

    for idx, (ls, lid) in enumerate(lesson_starts):
        if lid != lesson_id:
            continue
        lesson_end = lesson_starts[idx + 1][0] if idx + 1 < len(lesson_starts) else len(lines)
        for i in range(ls, lesson_end):
            if re.search(r'["\']?exercises["\']?\s*:\s*\[', lines[i]):
                end = find_exercises_end(lines, i)
                if end is not None:
                    # Ensure there's a comma on the line before the closing ]
                    prev_line = lines[end - 1].rstrip()
                    if prev_line and not prev_line.endswith(',') and not prev_line.endswith('['):
                        lines[end - 1] = prev_line + ',\n'
                    lines.insert(end, new_exercises_text + "\n")
                    with open(fpath, 'w') as fp:
                        fp.writelines(lines)
                    print(f"  Added to {lesson_id} in {fpath}")
                    return
    print(f"  WARNING: Could not find exercises in {lesson_id}")

# ============================================================
# a1Part2.ts - 9 lessons (ID range: 97000-97499)
# ============================================================

add_to_file('src/data/daily/a1Part2.ts', 'demonstratives', """\
    { id: 97001, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'Look! ___(1) is my new phone. It is very nice. And ___(2) are my books over there. ___(3) are old but I like them. What is ___(4) on the table? Oh, it is ___(5) apple!', blanks: ['This', 'those', 'They', 'that', 'an'], acceptedAnswers: [['This'], ['those'], ['They'], ['that'], ['an']], explanation: "This/these yaqin, that/those uzoq" },
    { id: 97002, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'My friend has two cats. One is big and ___(1) is small. The big one is ___(2) the table. The small one is ___(3) the chair. ___(4) are very cute! I like ___(5) cats.', blanks: ['the other', 'on', 'under', 'They', 'these'], acceptedAnswers: [['the other'], ['on'], ['under'], ['They'], ['these']], explanation: 'Joy predloglari + ko\\'rsatish olmoshlari' },
    { id: 97003, type: 'connection', instruction: "Ko'rsatish olmoshlarini ishlatib gap tuzing", prompt: 'What is near you right now? Describe 3 things using this/these and 2 things using that/those.', hints: ['This is my ...', 'These are my ...', 'That is a ...', 'Those are ...', 'Use here/there'], exampleAnswer: 'This is my pen. These are my books. That is a window. Those are trees.', explanation: "Ko'rsatish olmoshlari bilan tasvirlash" },
    { id: 97004, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'demonstrative', options: ["ko'rsatish olmoshi", 'sifat', "fe'l", 'ot'], correct: "ko'rsatish olmoshi", explanation: "Demonstrative = ko'rsatish olmoshi" }""")

add_to_file('src/data/daily/a1Part2.ts', 'prepositions-of-place', """\
    { id: 97101, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'The cat is ___(1) the box. It is sleeping ___(2) the blanket. The dog is ___(3) the table. There is a picture ___(4) the wall. The shoes are ___(5) the bed.', blanks: ['in', 'on', 'under', 'on', 'under'], acceptedAnswers: [['in'], ['on'], ['under'], ['on'], ['under']], explanation: 'Joy old predloglari: in, on, under' },
    { id: 97102, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'My bag is ___(1) the desk. My pencil case is ___(2) the bag. The clock is ___(3) the wall ___(4) the window. My chair is ___(5) the desk.', blanks: ['on', 'in', 'on', 'next to', 'under'], acceptedAnswers: [['on'], ['in'], ['on'], ['next to'], ['under']], explanation: 'Joy old predloglari bilan sinf haqida gap tuzish' },
    { id: 97103, type: 'connection', instruction: 'Xonani tasvirlab bering', prompt: 'Describe your room. Where is each object? Use at least 5 prepositions.', hints: ['The ... is in/on/under ...', 'There is a ... behind ...', '... is next to the ...', '... is between ... and ...', '... is opposite the ...'], exampleAnswer: 'My computer is on the desk. The lamp is next to it. Books are under the desk.', explanation: 'Joy old predloglari bilan xonani tasvirlash' },
    { id: 97104, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'preposition', options: ['old predlogi', 'ot', 'sifat', "fe'l"], correct: 'old predlogi', explanation: 'Preposition = old predlogi (in, on, under)' }""")

add_to_file('src/data/daily/a1Part2.ts', 'basic-adjectives', """\
    { id: 97201, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'My house is very ___(1) but not ___(2). The rooms are ___(3) and ___(4). My cat is ___(5) and playful.', blanks: ['big', 'new', 'clean', 'bright', 'beautiful'], acceptedAnswers: [['big'], ['new'], ['clean'], ['bright'], ['beautiful']], explanation: 'Sifatlar: big, small, old, new, clean, beautiful' },
    { id: 97202, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'Today is a ___(1) day. The sun is ___(2). I feel ___(3) because I ate well. My friend is ___(4) to see me. We are ___(5) to go out.', blanks: ['sunny', 'bright', 'happy', 'glad', 'ready'], acceptedAnswers: [['sunny'], ['bright'], ['happy'], ['glad'], ['ready']], explanation: "Havo va his-tuyg'ular haqida sifatlar" },
    { id: 97203, type: 'connection', instruction: 'Sifatlar bilan tasvirlash', prompt: 'Describe your best friend using at least 6 adjectives.', hints: ['My friend is ... (appearance)', 'He/She is very ... (personality)', 'My friend is ... and ...', 'He/She has ...', '... describe him/her well'], exampleAnswer: 'My friend is tall and slim. He is kind and funny. His eyes are brown. He is always happy.', explanation: 'Sifatlar bilan odamni tasvirlash' },
    { id: 97204, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'adjective', options: ['sifat', 'ot', "fe'l", 'olmosh'], correct: 'sifat', explanation: 'Adjective = sifat (big, small, beautiful)' }""")

add_to_file('src/data/daily/a1Part2.ts', 'can-cant', """\
    { id: 97301, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'I ___(1) speak English and I ___(2) speak Uzbek. My brother ___(3) play football well. He ___(4) play tennis because he ___(5) have a racket.', blanks: ['can', 'can', 'can', "can't", "can't"], acceptedAnswers: [['can'], ['can'], ['can'], ["can't"], ["can't"]], explanation: "Can/can't — imkonlik va imkonsizlik" },
    { id: 97302, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'Can you cook? Yes, I ___(1). I can make pasta. ___(2) your sister cook? No, she ___(3). She can only make tea. ___(4) you help me? Of course, I ___(5)!', blanks: ['can', 'Can', "can't", 'Can', 'can'], acceptedAnswers: [['can'], ['Can'], ["can't"], ['Can'], ['can']], explanation: "Can bilan so'rash va javob berish" },
    { id: 97303, type: 'connection', instruction: 'Imkonliklaringiz haqida yozing', prompt: 'Write about what you CAN and CANNOT do. Include 5 things you can do and 3 things you cannot do.', hints: ['I can ...', "I can't ...", "I can ... but I can't ...", 'Can you ...? Yes/No', 'She/He can ...'], exampleAnswer: "I can speak English. I can play guitar. I can't swim. I can't cook.", explanation: "Can/can't bilan imkonliklarni tasvirlash" },
    { id: 97304, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'ability', options: ['imkonlik', 'maslahat', 'buyruq', 'istak'], correct: 'imkonlik', explanation: 'Ability = imkonlik (can bilan bildiriladi)' }""")

add_to_file('src/data/daily/a1Part2.ts', 'have-got', """\
    { id: 97401, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'I ___(1) a new bicycle. It ___(2) two wheels. My sister ___(3) a beautiful dress. She ___(4) any shoes. We ___(5) a big garden.', blanks: ['have got', 'has got', 'has got', "hasn't got", 'have got'], acceptedAnswers: [['have got'], ['has got'], ['has got'], ["hasn't got"], ['have got']], explanation: "Have/has got — egalik" },
    { id: 97402, type: 'passage', instruction: "Matnni to'ldiring:", passage: '___(1) you got a pen? Yes, I ___. Have you got ___(2) brothers? No, I ___(3) any. ___(4) she got a cat? Yes, she ___(5) two cats!', blanks: ['Have', 'have', 'any', "haven't", 'Has', 'has'], acceptedAnswers: [['Have'], ['have'], ['any'], ["haven't"], ['Has'], ['has']], explanation: "Have got bilan so'rash" },
    { id: 97403, type: 'connection', instruction: "O'z mulkingiz haqida yozing", prompt: "Write about what you have got and haven't got. Include family, pets, clothes, school things.", hints: ["I've got ...", "I haven't got ...", "She/He has got ...", 'Have you got ...?', "We've got ... but we haven't got ..."], exampleAnswer: "I've got a laptop. I haven't got a car. My sister has got two cats.", explanation: 'Have got bilan mulkni tasvirlash' },
    { id: 97404, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'possession', options: ['egalik', 'joy', 'vaqt', 'holat'], correct: 'egalik', explanation: 'Possession = egalik (have got bilan)' }""")

add_to_file('src/data/daily/a1Part2.ts', 'present-simple', """\
    { id: 97501, type: 'passage', instruction: "Matnni to'ldiring:", passage: 'I ___(1) at 7 AM every day. I ___(2) breakfast at 7:30. My mother ___(3) at a hospital. She ___(4) sick people. I ___(5) to school by bus.', blanks: ['wake up', 'eat', 'works', 'helps', 'go'], acceptedAnswers: [['wake up'], ['eat'], ['works'], ['helps'], ['go']], explanation: "Present Simple — har doim bo'ladigan ish-harakatlar" },
    { id: 97502, type: 'passage', instruction: "Matnni to'ldiring:", passage: "My father ___(1) TV every evening. He ___(2) books instead. ___(3) your mother ___(4) dinner? Yes, she ___. She ___(5) delicious food.", blanks: ["doesn't watch", 'reads', 'Does', 'cook', 'does', 'makes'], acceptedAnswers: [["doesn't watch"], ['reads'], ['Does'], ['cook'], ['does'], ['makes']], explanation: "Present Simple inkor va so'roq" },
    { id: 97503, type: 'connection', instruction: 'Kundalik tartibingiz haqida yozing', prompt: 'Write about your daily routine using Present Simple. Include morning, afternoon, evening activities.', hints: ['I wake up at ...', 'I eat ... at ...', 'I go to ... at ...', 'I usually ...', 'I never / always / sometimes ...'], exampleAnswer: 'I wake up at 7 AM. I eat breakfast at 7:30. I go to school at 8. I watch TV in the evening.', explanation: 'Present Simple bilan kundalik tartibni tasvirlash' },
    { id: 97504, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'routine', options: ['kundalik tartib', 'ibora', 'ot', "fe'l"], correct: 'kundalik tartib', explanation: 'Routine = kundalik tartib' }""")

add_to_file('src/data/daily/a1Part2.ts', 'question-words', """\
    { id: 97601, type: 'passage', instruction: "Matnni to'ldiring:", passage: "___(1) is your name? My name is Aziz. ___(2) are you from? I am from Tashkent. ___(3) old are you? I am 15. ___(4) do you go to school? I go to School No. 1. ___(5) is your favourite subject?", blanks: ['What', 'Where', 'How', 'Where', 'What'], acceptedAnswers: [['What'], ['Where'], ['How'], ['Where'], ['What']], explanation: "Savol so'zlari: what, where, how" },
    { id: 97602, type: 'passage', instruction: "Matnni to'ldiring:", passage: "___(1) do you wake up? I wake up at 7. ___(2) do you have for breakfast? I have eggs. ___(3) do you go to school? By bus. ___(4) is your best friend? It is Ali. ___(5) do you like English?", blanks: ['When', 'What', 'How', 'Who', 'Why'], acceptedAnswers: [['When'], ['What'], ['How'], ['Who'], ['Why']], explanation: "When, What, How, Who, Why — savol so'zlari" },
    { id: 97603, type: 'connection', instruction: 'Yangi dost bilan tanishish', prompt: 'Write 6 questions using different question words: what, where, when, how, who, why.', hints: ['What ...?', 'Where ...?', 'When ...?', 'How ...?', 'Who ...?', 'Why ...?'], exampleAnswer: 'What is your name? Where are you from? When is your birthday? How old are you? Who is your best friend? Why do you like English?', explanation: "Savol so'zlari bilan tanishish" },
    { id: 97604, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'question word', options: ["savol so'zi", "javob so'zi", "fe'l", 'sifat'], correct: "savol so'zi", explanation: "Question word = savol so'zi" }""")

add_to_file('src/data/daily/a1Part2.ts', 'conjunctions', """\
    { id: 97701, type: 'passage', instruction: "Matnni to'ldiring:", passage: "I like tea ___(1) I don't like coffee. She is tired ___(2) she wants to sleep. We can go out ___(3) it is raining. I want to go ___(4) I have no money.", blanks: ['but', 'so', 'but', 'but'], acceptedAnswers: [['but'], ['so'], ['but'], ['but']], explanation: "Bog'lovchilar: and, but, so, or" },
    { id: 97702, type: 'passage', instruction: "Matnni to'ldiring:", passage: '___(1) I like tea, I also like coffee. You can have cake ___(2) ice cream. I am hungry ___(3) I want to eat. ___(4) it rains, I will stay home.', blanks: ['Both', 'or', 'so', 'If'], acceptedAnswers: [['Both'], ['or'], ['so'], ['If']], explanation: "Bog'lovchilar: both...and, or, so, if" },
    { id: 97703, type: 'connection', instruction: "Bog'lovchilar bilan gap tuzing", prompt: 'Write 5 sentences using different conjunctions: and, but, so, or, because, if.', hints: ['I ... and ...', 'I want ... but ...', 'It is raining so ...', 'Do you want ... or ...?', 'I am tired because ...'], exampleAnswer: 'I wake up and eat breakfast. I want to go out but it rains. I am hungry so I make lunch.', explanation: "Bog'lovchilar bilan murakkab gaplar tuzish" },
    { id: 97704, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'conjunction', options: ["bog'lovchi", 'ot', "fe'l", 'olmosh'], correct: "bog'lovchi", explanation: "Conjunction = bog'lovchi (and, but, so, or)" }""")

add_to_file('src/data/daily/a1Part2.ts', 'a1-review', """\
    { id: 97801, type: 'passage', instruction: "Matnni to'ldiring:", passage: '___(1)! My name is Bob. I ___(2) from London. I ___(3) a student. My school is ___(4) the park. I ___(5) speak English.', blanks: ['Hello', 'am', 'am', 'next to', 'can'], acceptedAnswers: [['Hello'], ['am'], ['am'], ['next to'], ['can']], explanation: 'A1 darajadagi asosiy bilimlarni takrorlash' },
    { id: 97802, type: 'passage', instruction: "Matnni to'ldiring:", passage: "I ___(1) a cat. It ___(2) black and white. ___(3) you got a pet? I ___(4) up at 7 AM. I ___(5) breakfast at 7:30.", blanks: ['have got', 'is', 'Have', 'wake', 'eat'], acceptedAnswers: [['have got'], ['is'], ['Have'], ['wake'], ['eat']], explanation: 'Have got, Present Simple, va asosiy gap tuzish' },
    { id: 97803, type: 'connection', instruction: 'Ozingiz haqida yozing', prompt: 'Write about yourself: name, age, country, abilities, possessions, room.', hints: ['My name is ...', 'I am from ...', 'I can ...', "I've got ...", 'My ... is on/in/under ...'], exampleAnswer: "My name is Ali. I am 14. I am from Tashkent. I can speak English. I've got a laptop.", explanation: "A1 darajadagi barcha mavzularni qo'llash" },
    { id: 97804, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'review', options: ['takrorlash', 'yangi mavzu', 'test', 'topshiriq'], correct: 'takrorlash', explanation: 'Review = takrorlash' }""")

# ============================================================
# b1Extra.ts - 2 lessons (ID range: 101500-101999)
# ============================================================

add_to_file('src/data/daily/b1Extra.ts', 'relative-clauses-b1', """\
    { id: 101501, type: 'passage', instruction: "Matnni to'ldiring:", passage: "The teacher ___(1) teaches us English is kind. The book ___(2) I read was interesting. The girl ___(3) bag was stolen is crying. The city ___(4) I was born is Samarkand.", blanks: ['who', 'which', 'whose', 'where'], acceptedAnswers: [['who'], ['which'], ['whose'], ['where']], explanation: 'who (odamlar), which (narsalar), whose (egalik), where (joy)' },
    { id: 101502, type: 'passage', instruction: "Matnni to'ldiring:", passage: "My father, ___(1) is a doctor, works at the hospital. The movie, ___(2) we watched, was amazing. I have a friend ___(3) speaks five languages. This is the place ___(4) we first met.", blanks: ['who', 'which', 'who', 'where'], acceptedAnswers: [['who'], ['which'], ['who'], ['where']], explanation: 'Non-defining: vergul bilan. Defining: vergulsiz.' },
    { id: 101503, type: 'connection', instruction: 'Relative clauses bilan gap tuzing', prompt: 'Write 5 sentences using relative clauses. Use who, which, that, where, whose.', hints: ['The person who ...', 'The book which ...', 'The place where ...', 'My friend whose ...', ', who/which ... (non-defining)'], exampleAnswer: 'The teacher who teaches me English is kind. My phone, which I bought last week, is broken. The city where I live is beautiful.', explanation: 'Relative clauses bilan murakkab gaplar tuzish' },
    { id: 101504, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'relative clause', options: ['nisbiy gap', 'asosiy gap', 'savol gapi', 'buyruq gapi'], correct: 'nisbiy gap', explanation: 'Relative clause = nisbiy gap (who, which, that, where)' }""")

add_to_file('src/data/daily/b1Extra.ts', 'phrasal-verbs-b1', """\
    { id: 101601, type: 'passage', instruction: "Matnni to'ldiring:", passage: "I need to ___(1) my homework. Can you ___(2) this word? Please ___(3) the lights. I have to ___(4) my daughter from school.", blanks: ['finish', 'look up', 'turn off', 'pick up'], acceptedAnswers: [['finish'], ['look up'], ['turn off'], ['pick up']], explanation: 'Phrasal verbs: finish, look up, turn off, pick up' },
    { id: 101602, type: 'passage', instruction: "Matnni to'ldiring:", passage: "My car broke ___(1) on the highway. I had to ___(2) a taxi. The meeting was ___(3) because the manager was sick. I need to ___(4) this report.", blanks: ['down', 'call off', 'put off', 'hand in'], acceptedAnswers: [['down'], ['call off'], ['put off'], ['hand in']], explanation: 'Phrasal verbs: break down, call off, put off, hand in' },
    { id: 101603, type: 'connection', instruction: 'Phrasal verbs bilan hikoya yozing', prompt: 'Write a short story using at least 6 phrasal verbs.', hints: ['wake up, get up, put on', 'turn on/off, look for, find out', 'pick up, drop off, come back', 'give up, keep on, go on', 'break down, call off, put off'], exampleAnswer: 'I woke up late. I put on my jacket and turned on the TV. I looked for my keys but could not find them.', explanation: 'Phrasal verbs bilan kunlik hayot haqida hikoya' },
    { id: 101604, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: 'phrasal verb', options: ["iborali fe'l", "qisqa fe'l", "uzun fe'l", "maxsus fe'l"], correct: "iborali fe'l", explanation: "Phrasal verb = iborali fe'l (verb + preposition)" }""")

# ============================================================
# b2Extra.ts - 4 lessons (ID range: 104500-104999)
# ============================================================

add_to_file('src/data/daily/b2Extra.ts', 'inversion-b2', """\
    {
      "id": 104501,
      "type": "passage",
      "instruction": "Matnni to'ldiring:",
      "passage": "Never ___(1) I seen such a beautiful sunset. Not only ___(2) the food delicious, but the service was excellent. Hardly ___(3) we arrived when it started raining. Only after ___(4) the report did I realize my mistake.",
      "blanks": ["had", "was", "had", "reading"],
      "acceptedAnswers": [["had"], ["was"], ["had"], ["reading"]],
      "explanation": "Inversiya: Never had I, Not only was, Hardly had we, Only after reading"
    },
    {
      "id": 104502,
      "type": "connection",
      "instruction": "Inversiya bilan gap tuzing",
      "prompt": "Write 5 sentences using inversion structures.",
      "hints": ["Never have I ...", "Not only ... but also ...", "Hardly had ... when ...", "No sooner had ... than ...", "Only after ... did ..."],
      "exampleAnswer": "Never have I felt so happy. Not only did she pass the exam, but she also got the highest score.",
      "explanation": "Inversiya bilan gaplar tuzish"
    },
    {
      "id": 104503,
      "type": "vocab-match",
      "instruction": "So'zning ma'nosini tanlang",
      "word": "inversion",
      "options": ["teskari tartib", "to'g'ri tartib", "oddiy gap", "savol gapi"],
      "correct": "teskari tartib",
      "explanation": "Inversion = teskari tartib (fe'l oldin, subyekt keyin)"
    }""")

add_to_file('src/data/daily/b2Extra.ts', 'cleft-sentences-b2', """\
    {
      "id": 104601,
      "type": "passage",
      "instruction": "Matnni to'ldiring:",
      "passage": "It was Ali ___(1) called you yesterday. It is the weather ___(2) affects my mood. What I need ___(3) is a good holiday. The reason ___(4) I left was the noise.",
      "blanks": ["who", "that", "is", "why"],
      "acceptedAnswers": [["who"], ["that"], ["is"], ["why"]],
      "explanation": "Cleft sentences: It was...who/that, What...is, The reason why"
    },
    {
      "id": 104602,
      "type": "connection",
      "instruction": "Cleft sentences bilan gap tuzing",
      "prompt": "Rewrite 5 simple sentences using cleft structures.",
      "hints": ["It was ... who/that ...", "What ... is ...", "The reason why ... is ...", "It is ... that ...", "All I need is ..."],
      "exampleAnswer": "It was Ali who broke the window. What I love most is music. The reason why I left is the noise.",
      "explanation": "Cleft sentences bilan urg'uni o'zgartirish"
    },
    {
      "id": 104603,
      "type": "vocab-match",
      "instruction": "So'zning ma'nosini tanlang",
      "word": "cleft sentence",
      "options": ["bo'lingan gap", "to'liq gap", "qisqa gap", "savol gapi"],
      "correct": "bo'lingan gap",
      "explanation": "Cleft sentence = bo'lingan gap (urg'uni ajratish uchun)"
    }""")

add_to_file('src/data/daily/b2Extra.ts', 'advanced-passive-b2', """\
    {
      "id": 104701,
      "type": "passage",
      "instruction": "Matnni to'ldiring:",
      "passage": "The new bridge ___(1) (build) next year. The problem ___(2) (discuss) at the moment. The letter ___(3) (send) yesterday. The building ___(4) (damage) in the storm.",
      "blanks": ["will be built", "is being discussed", "was sent", "was damaged"],
      "acceptedAnswers": [["will be built"], ["is being discussed"], ["was sent"], ["was damaged"]],
      "explanation": "Passive voice: will be + V3, is being + V3, was + V3"
    },
    {
      "id": 104702,
      "type": "connection",
      "instruction": "Passive voice bilan gap tuzing",
      "prompt": "Rewrite these active sentences in passive voice. Create 5 passive sentences.",
      "hints": ["is/are + V3 (present)", "was/were + V3 (past)", "will be + V3 (future)", "is being + V3 (cont.)", "has been + V3 (perf.)"],
      "exampleAnswer": "English is spoken in many countries. The homework was done yesterday. The report will be finished tomorrow.",
      "explanation": "Passive voice bilan gap tuzish"
    },
    {
      "id": 104703,
      "type": "vocab-match",
      "instruction": "So'zning ma'nosini tanlang",
      "word": "passive voice",
      "options": ["tarangli fe'l", "faol fe'l", "oddiy fe'l", "maxsus fe'l"],
      "correct": "tarangli fe'l",
      "explanation": "Passive voice = tarangli fe'l (S + be + V3)"
    }""")

add_to_file('src/data/daily/b2Extra.ts', 'academic-vocabulary-b2', """\
    {
      "id": 104801,
      "type": "passage",
      "instruction": "Matnni to'ldiring:",
      "passage": "The research ___(1) (conduct) in 2024. The data ___(2) (analyze) using statistical methods. The results ___(3) (publish) in a journal. The findings ___(4) (suggest) a strong correlation.",
      "blanks": ["was conducted", "was analyzed", "were published", "suggest"],
      "acceptedAnswers": [["was conducted"], ["was analyzed"], ["were published"], ["suggest"]],
      "explanation": "Academic vocabulary: conduct, analyze, publish, suggest"
    },
    {
      "id": 104802,
      "type": "connection",
      "instruction": "Academic vocabulary bilan yozing",
      "prompt": "Write a short academic paragraph using at least 5 academic words.",
      "hints": ["The study analyzes ...", "It is significant that ...", "Consequently, ...", "The data demonstrates ...", "Furthermore, ..."],
      "exampleAnswer": "The study analyzes the effects of technology on education. It is significant that students perform better. Consequently, schools should invest in digital tools.",
      "explanation": "Academic vocabulary bilan akademik matn yozish"
    },
    {
      "id": 104803,
      "type": "vocab-match",
      "instruction": "So'zning ma'nosini tanlang",
      "word": "consequently",
      "options": ["shuning uchun", "lekin", "balki", "aslida"],
      "correct": "shuning uchun",
      "explanation": "Consequently = shuning uchun (natija bildiradi)"
    }""")

print("\nDone! All productive exercises added.")
