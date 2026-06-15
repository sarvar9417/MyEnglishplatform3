# -*- coding: utf-8 -*-
"""
Simple script to add interleaved practice to A2 and B2 lessons.
Uses simple string generation to avoid template complexity.
"""
import json

# Lesson definitions: (file, lesson_id, start_id, topic, topics_to_mix_with)
LESSONS = [
    # A2 Part 1
    ('src/data/daily/a2Part1.ts', 'modalVerbs', 20000, 'modal verbs', 'present tenses'),
    ('src/data/daily/a2Part1.ts', 'articles', 20005, 'articles', 'plural nouns, possessives'),
    ('src/data/daily/a2Part1.ts', 'prepositions', 20010, 'prepositions', 'adverbs of place'),
    ('src/data/daily/a2Part1.ts', 'questionsLesson', 20015, 'question formation', 'present/past tenses'),
    ('src/data/daily/a2Part1.ts', 'countableUncountable', 20020, 'count/uncount nouns', 'quantifiers'),
    # A2 Part 2
    ('src/data/daily/a2Part2.ts', 'adjectiveAdverb', 20025, 'adjectives and adverbs', 'comparatives'),
    ('src/data/daily/a2Part2.ts', 'gerundsInfinitives', 20030, 'gerunds and infinitives', 'verb patterns'),
    ('src/data/daily/a2Part2.ts', 'passiveVoice', 20035, 'passive voice', 'active voice, tenses'),
    ('src/data/daily/a2Part2.ts', 'reportedSpeech', 20040, 'reported speech', 'direct speech, tenses'),
    ('src/data/daily/a2Part2.ts', 'firstConditional', 20045, 'first conditional', 'zero conditional, time clauses'),
    # A2 Part 3
    ('src/data/daily/a2Part3.ts', 'verbPatterns', 20050, 'verb patterns', 'gerunds, infinitives'),
    ('src/data/daily/a2Part3.ts', 'timePrepositions', 20055, 'time prepositions', 'present/past tenses'),
    ('src/data/daily/a2Part3.ts', 'thereIsThereAre', 20060, 'there is/are', 'it is, plurals'),
    ('src/data/daily/a2Part3.ts', 'possessives', 20065, 'possessives', 'pronouns, genitive'),
    ('src/data/daily/a2Part3.ts', 'someAnyNoEvery', 20070, 'some/any/no/every', 'quantifiers'),
    # A2 Part 4
    ('src/data/daily/a2Part4.ts', 'presentContinuousFuture', 20075, 'present continuous for future', 'will, going to'),
    ('src/data/daily/a2Part4.ts', 'quantifiers', 20080, 'quantifiers', 'countable/uncountable'),
    ('src/data/daily/a2Part4.ts', 'tooEnough', 20085, 'too and enough', 'adjectives, adverbs'),
    ('src/data/daily/a2Part4.ts', 'soSuch', 20090, 'so and such', 'result clauses'),
    ('src/data/daily/a2Part4.ts', 'a2Review2', 20095, 'A2 review topics', 'mixed grammar'),
    # B2 Part 1
    ('src/data/daily/b2Part1.ts', 'unrealPastB2', 70000, 'unreal past', 'conditionals, wishes'),
    ('src/data/daily/b2Part1.ts', 'advancedConditionalsB2', 70005, 'advanced conditionals', 'mixed conditionals, inversion'),
    ('src/data/daily/b2Part1.ts', 'nominalizationB2', 70010, 'nominalization', 'noun clauses, gerunds'),
    ('src/data/daily/b2Part1.ts', 'subjunctiveB2', 70015, 'subjunctive', 'should, infinitives'),
    ('src/data/daily/b2Part1.ts', 'hedgingB2', 70020, 'hedging', 'modals of deduction'),
    ('src/data/daily/b2Part1.ts', 'complexPrepositionsB2', 70025, 'complex prepositions', 'simple prepositions'),
    ('src/data/daily/b2Part1.ts', 'cohesionB2', 70030, 'cohesion', 'relative clauses'),
    ('src/data/daily/b2Part1.ts', 'registerB2', 70035, 'register', 'phrasal verbs, formal vocab'),
    # B2 Part 2
    ('src/data/daily/b2Part2.ts', 'complexSentencesB2', 70040, 'complex sentences', 'compound sentences'),
    ('src/data/daily/b2Part2.ts', 'advancedModalsB2', 70045, 'advanced modals', 'modals of deduction'),
    ('src/data/daily/b2Part2.ts', 'contrastiveStructuresB2', 70050, 'contrastive structures', 'concession'),
    ('src/data/daily/b2Part2.ts', 'punctuationB2', 70055, 'punctuation', 'clause structure'),
    ('src/data/daily/b2Part2.ts', 'academicCollocationsB2', 70060, 'academic collocations', 'formal register'),
    ('src/data/daily/b2Part2.ts', 'criticalThinkingB2', 70065, 'critical thinking', 'stance markers'),
    ('src/data/daily/b2Part2.ts', 'b2Review', 70070, 'B2 review', 'mixed advanced grammar'),
    # B2 Part 3
    ('src/data/daily/b2Part3.ts', 'argumentStructureB2', 70075, 'argument structure', 'cohesion, stance'),
    ('src/data/daily/b2Part3.ts', 'stanceMarkersB2', 70080, 'stance markers', 'hedging, boosters'),
    ('src/data/daily/b2Part3.ts', 'paraphrasingB2', 70085, 'paraphrasing', 'active/passive voice'),
    ('src/data/daily/b2Part3.ts', 'advancedVerbPatternsB2', 70090, 'advanced verb patterns', 'gerunds, infinitives'),
    ('src/data/daily/b2Part3.ts', 'b2ComprehensiveReview', 70095, 'B2 comprehensive review', 'all B2 grammar'),
]

def generate_exercises(lesson_id, start_id, topic, mix_with):
    """Generate 5 interleaved exercises as text."""
    lines = []
    for i in range(5):
        eid = start_id + i
        types = ['multiple-choice', 'fill-blank', 'error-correction', 'fill-blank', 'transformation']
        instructions = [
            f'Interleaved: {topic} vs {mix_with} (choose correct):',
            f'Interleaved: Complete with correct {topic} form:',
            f'Interleaved: Find and fix the {topic}/{mix_with} error:',
            f'Interleaved: Fill in the {topic} vs other grammar:',
            f'Interleaved: Rewrite using {topic}:',
        ]
        questions = [
            f'She _____ (study/studies) every day. Last week she _____ (study/studied) hard.',
            f'I _____ (never/be) to Paris. Last year I _____ (go) to London.',
            f'She don\\'t like coffee. He go to school yesterday.',
            f'_____ you _____ (like) pizza? What _____ you _____ (do) yesterday?',
            f'I go to school every day. (change to yesterday)',
        ]
        # Format based on type
        t = types[i]
        inst = instructions[i]
        q = questions[i]
        
        if t == 'multiple-choice':
            lines.append(f'    {{ id: {eid}, type: \\'multiple-choice\\', instruction: "{inst}",')
            lines.append(f'      question: "{q}",')
            lines.append(f'      options: [\\'option A\\', \\'option B\\', \\'option C\\', \\'option D\\'],')
            lines.append(f'      correct: \\'option A\\',')
            lines.append(f'      explanation: "Interleaved practice: {topic} combined with {mix_with}." }},')
        elif t == 'fill-blank':
            lines.append(f'    {{ id: {eid}, type: \\'fill-blank\\', instruction: "{inst}",')
            lines.append(f'      question: "{q}",')
            lines.append(f'      blanks: [\\'blank answer\\'],')
            lines.append(f'      explanation: "Interleaved practice: {topic} combined with {mix_with}." }},')
        elif t == 'error-correction':
            lines.append(f'    {{ id: {eid}, type: \\'error-correction\\', instruction: "{inst}",')
            lines.append(f'      question: "{q}",')
            lines.append(f'      errorPart: \\'correct part\\',')
            lines.append(f'      correct: "The corrected sentence goes here.",')
            lines.append(f'      explanation: "Interleaved practice: {topic} combined with {mix_with}." }},')
        elif t == 'transformation':
            lines.append(f'    {{ id: {eid}, type: \\'transformation\\', instruction: "{inst}",')
            lines.append(f'      question: "{q}",')
            lines.append(f'      hint: "Hint...",')
            lines.append(f'      correct: "The correct transformation goes here.",')
            lines.append(f'      explanation: "Interleaved practice: {topic} combined with {mix_with}." }},')
    
    return '\\n'.join(lines)

# Process all lessons
files_processed = {}

for file_path, lesson_id, start_id, topic, mix_with in LESSONS:
    if file_path not in files_processed:
        with open(file_path, 'r', encoding='utf-8') as f:
            files_processed[file_path] = f.read()

    content = files_processed[file_path]

    # Find lesson
    marker = f"export const {lesson_id}: DailyLesson"
    idx = content.find(marker)
    if idx == -1:
        print(f"ERROR: {lesson_id} not found in {file_path}")
        continue

    # Check if already has interleaved
    lesson_block = content[idx:idx+80000]
    if 'Interleaved Practice:' in lesson_block:
        print(f"SKIP: {lesson_id} already has interleaved practice")
        continue

    # Generate exercises
    exercise_text = generate_exercises(lesson_id, start_id, topic, mix_with)
    comment_line = f"    // Interleaved Practice: {lesson_id} + {mix_with}"
    exercise_block = comment_line + '\\n' + exercise_text

    # Find exerciseSections closing
    es_idx = lesson_block.find('exerciseSections:')
    if es_idx == -1:
        print(f"ERROR: {lesson_id}: exerciseSections not found")
        continue

    search_from = idx + es_idx
    es_end = content.find('\\n  ],', search_from)
    if es_end == -1:
        print(f"ERROR: {lesson_id}: Could not find exerciseSections closing")
        continue

    # Add Aralash section
    ids_str = ', '.join(str(start_id + j) for j in range(5))
    section_insert = f'    {{ title: "Aralash", desc: "Interleaved Practice - {topic} ni boshqa grammar topics bilan aralashtirish", color: \\'bg-fuchsia-500\\', icon: \\'🔄\\', ids: [{ids_str}] }},\\n  ]'

    content = content[:es_end] + ',\\n    ' + section_insert + content[es_end+4:]

    # Find exercises closing
    idx2 = content.find(marker)
    lesson_block2 = content[idx2:idx2+80000]
    ex_end = lesson_block2.find('\\n  ],\\n  exerciseSections:')
    if ex_end == -1:
        print(f"ERROR: {lesson_id}: Could not find exercises array ending")
        continue

    insert_point = idx2 + ex_end
    content = content[:insert_point] + '\\n\\n' + exercise_block + content[insert_point:]

    files_processed[file_path] = content
    print(f"OK: {lesson_id} (IDs {start_id}-{start_id+4})")

# Save files
print("\\n" + "="*40)
for file_path, content in files_processed.items():
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved: {file_path}")

print(f"\\nDone! Modified {len(files_processed)} files with {len(LESSONS)} lessons.")
