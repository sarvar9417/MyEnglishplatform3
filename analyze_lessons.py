#!/usr/bin/env python3
"""Add more productive exercises to ALL remaining lessons."""
import re, os

def find_exercises_end(lines, start):
    depth = 0
    for j in range(start, len(lines)):
        for ch in lines[j]:
            if ch == '[': depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0: return j
    return None

def get_lesson_ids(fpath):
    with open(fpath) as fp:
        lines = fp.readlines()
    lesson_starts = []
    for i, line in enumerate(lines):
        if re.search(r'export const \w+: DailyLesson', line):
            for j in range(i, min(i+20, len(lines))):
                line_s = lines[j].strip()
                m = re.search(r'id:\s*[\'"]([^\']+)[\'"]', line_s)
                if not m:
                    m = re.search(r'"id"\s*:\s*"([^"]+)"', line_s)
                if m and m.group(1) not in ('true', 'false', 'null'):
                    lesson_starts.append((i, m.group(1)))
                    break
    return lesson_starts, lines

def count_exercises_in_lesson(lines, ls, lesson_end):
    text = ''.join(lines[ls:lesson_end])
    mc = len(re.findall(r"type:\s*'multiple-choice'", text)) + len(re.findall(r'"type":\s*"multiple-choice"', text))
    passage = len(re.findall(r"type:\s*'passage'", text)) + len(re.findall(r'"type":\s*"passage"', text))
    conn = len(re.findall(r"type:\s*'connection'", text)) + len(re.findall(r'"type":\s*"connection"', text))
    vm = len(re.findall(r"type:\s*'vocab-match'", text)) + len(re.findall(r'"type":\s*"vocab-match"', text))
    return mc, passage, conn, vm

def add_exercises(fpath, lesson_id, exercises_text):
    with open(fpath) as fp:
        lines = fp.readlines()
    lesson_starts = []
    for i, line in enumerate(lines):
        if re.search(r'export const \w+: DailyLesson', line):
            for j in range(i, min(i+20, len(lines))):
                line_s = lines[j].strip()
                m = re.search(r'id:\s*[\'"]([^\']+)[\'"]', line_s)
                if not m:
                    m = re.search(r'"id"\s*:\s*"([^"]+)"', line_s)
                if m and m.group(1) not in ('true', 'false', 'null'):
                    lesson_starts.append((i, m.group(1)))
                    break

    for idx, (ls, lid) in enumerate(lesson_starts):
        if lid != lesson_id:
            continue
        lesson_end = lesson_starts[idx+1][0] if idx+1 < len(lesson_starts) else len(lines)
        for i in range(ls, lesson_end):
            if re.search(r'exercises:\s*\[', lines[i]):
                end = find_exercises_end(lines, i)
                if end is not None:
                    prev = lines[end-1].rstrip()
                    if prev and not prev.endswith(',') and not prev.endswith('['):
                        lines[end-1] = prev + ',\n'
                    lines.insert(end, exercises_text + "\n")
                    with open(fpath, 'w') as fp:
                        fp.writelines(lines)
                    print(f"  + {lesson_id}")
                    return True
    return False

# Check what needs more exercises
files = {
    'src/data/daily/a1Part1.ts': '99000-99499',
    'src/data/daily/a2Part1.ts': '98000-98499',
    'src/data/daily/a2Part2.ts': '98500-98999',
    'src/data/daily/a2Part3.ts': '99000-99499',
    'src/data/daily/a2Part4.ts': '99400-99499',
    'src/data/daily/b1Part1.ts': '101000-101499',
    'src/data/daily/b1plusPart1.ts': '102000-102499',
    'src/data/daily/b1plusPart2.ts': '102500-102999',
    'src/data/daily/b2Part1.ts': '103000-103499',
    'src/data/daily/b2Part2.ts': '103500-103999',
    'src/data/daily/b2Part3.ts': '104000-104499',
}

for fpath in sorted(files.keys()):
    lesson_starts, lines = get_lesson_ids(fpath)
    print(f"\n=== {fpath} ===")
    for idx, (ls, lid) in enumerate(lesson_starts):
        lesson_end = lesson_starts[idx+1][0] if idx+1 < len(lesson_starts) else len(lines)
        mc, passage, conn, vm = count_exercises_in_lesson(lines, ls, lesson_end)
        productive = passage + conn + vm
        if productive < 5:
            print(f"  {lid}: MC={mc} P={passage} C={conn} VM={vm} (needs more)")
