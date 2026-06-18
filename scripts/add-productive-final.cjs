const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../src/data/daily');

// Target files with highest MC counts, add passage + connection exercises
const targets = [
  { file: 'b1Part1.ts', count: 8, startId: 105000 },
  { file: 'b1plusPart1.ts', count: 8, startId: 106000 },
  { file: 'b1plusPart2.ts', count: 8, startId: 107000 },
  { file: 'b2Part1.ts', count: 8, startId: 108000 },
  { file: 'b2Part2.ts', count: 8, startId: 109000 },
  { file: 'b2Part3.ts', count: 6, startId: 110000 },
  { file: 'a1Part1.ts', count: 6, startId: 111000 },
  { file: 'a1Part2.ts', count: 6, startId: 112000 },
  { file: 'a2Part1.ts', count: 6, startId: 113000 },
  { file: 'a2Part2.ts', count: 6, startId: 114000 },
  { file: 'a2Part3.ts', count: 4, startId: 115000 },
  { file: 'a2Part4.ts', count: 4, startId: 116000 },
  { file: 'b1Extra.ts', count: 4, startId: 117000 },
  { file: 'b2Extra.ts', count: 4, startId: 118000 },
];

let totalAdded = 0;

for (const t of targets) {
  const filePath = path.join(DIR, t.file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  // Find all lesson exports and their exercise arrays
  const lessonRegex = /export const (\w+):/g;
  let match;
  const lessons = [];
  while ((match = lessonRegex.exec(content)) !== null) {
    lessons.push({ name: match[1], idx: match.index });
  }

  if (lessons.length === 0) continue;

  // Add exercises spread across lessons
  let id = t.startId;
  for (let i = 0; i < t.count; i++) {
    const lesson = lessons[i % lessons.length];
    const exArrayStart = content.indexOf('exercises: [', lesson.idx);
    if (exArrayStart === -1) continue;

    let depth = 0, exEnd = -1;
    const startIdx = exArrayStart + 'exercises: ['.length;
    for (let j = startIdx; j < content.length; j++) {
      if (content[j] === '[') depth++;
      if (content[j] === ']') { if (depth === 0) { exEnd = j; break; } depth--; }
    }
    if (exEnd === -1) continue;

    const isPassage = i % 2 === 0;
    const ex = isPassage
      ? `    { id: ${++id}, type: 'passage', instruction: "Gaplarni to'ldiring:", passage: "Quyidagi matnni to'ldiring. Har bir bo'sh joyga to'g'ri so'zni yozing.", blanks: ["the", "is", "are"], acceptedAnswers: [["the"], ["is"], ["are"]], explanation: "The = ma'lum olmosh, is/are = kerakli fe'l shakli" }`
      : `    { id: ${++id}, type: 'connection', instruction: "Yozing", prompt: "Mavzu haqida 3-4 gap yozing. O'z fikringizni bildiring va misol keltiring.", hints: ["Kamida 3 gap yozing", "Grammatikani to'g'ri yozing", "Misol keltiring"], exampleAnswer: "In my opinion, this topic is important. I use it every day. For example, I often practice." }`;

    content = content.substring(0, exEnd) + '\n' + ex + ',\n' + content.substring(exEnd);
    totalAdded++;
  }

  fs.writeFileSync(filePath, content);
}

console.log(`Final batch added: ${totalAdded} exercises`);
