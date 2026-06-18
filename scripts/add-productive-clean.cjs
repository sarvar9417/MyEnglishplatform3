const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../src/data/daily');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.ts') && f !== 'lessonsIndex.ts' && f !== 'index.ts');

function findMatchingBracket(content, startPos) {
  // startPos should point to the opening [
  let depth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (let i = startPos; i < content.length; i++) {
    const ch = content[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (inSingleQuote) { if (ch === "'") inSingleQuote = false; continue; }
    if (inDoubleQuote) { if (ch === '"') inDoubleQuote = false; continue; }
    if (ch === "'") { inSingleQuote = true; continue; }
    if (ch === '"') { inDoubleQuote = true; continue; }
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

let totalAdded = 0;

for (const file of files) {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const ids = [...content.matchAll(/\bid:\s*(\d{4,6})\b/g)].map(m => parseInt(m[1]));
  let maxId = ids.length > 0 ? Math.max(...ids) : 1000;

  // Find all exercise arrays
  const exerciseArrays = [];
  let searchFrom = 0;
  while (true) {
    const idx = content.indexOf('exercises: [', searchFrom);
    if (idx === -1) break;

    // Find the opening [
    const bracketStart = content.indexOf('[', idx + 'exercises:'.length);
    if (bracketStart === -1) break;

    const arrEnd = findMatchingBracket(content, bracketStart);

    if (arrEnd > 0) {
      exerciseArrays.push({ arrStart: bracketStart + 1, arrEnd });
    }
    searchFrom = idx + 1;
  }

  // Insert in reverse order
  for (let i = exerciseArrays.length - 1; i >= 0; i--) {
    const { arrStart, arrEnd } = exerciseArrays[i];
    const arrContent = content.substring(arrStart, arrEnd).trim();
    if (arrContent.length < 10) continue;

    const mcCount = (arrContent.match(/type: 'multiple-choice'/g) || []).length;
    const passageCount = (arrContent.match(/type: 'passage'/g) || []).length;
    const connectionCount = (arrContent.match(/type: 'connection'/g) || []).length;

    const needPassage = Math.max(0, 5 - passageCount);
    const needConnection = Math.max(0, 5 - connectionCount);
    const total = needPassage + needConnection;
    if (total === 0) continue;

    const exercises = [];
    for (let j = 0; j < needPassage; j++) {
      exercises.push(
`    { id: ${++maxId}, type: 'passage', instruction: "Gaplarni to'ldiring:", passage: "Quyidagi matnni to'ldiring. Har bir bo'sh joyga to'g'ri so'zni yozing.", blanks: ["the", "is", "are"], acceptedAnswers: [["the"], ["is"], ["are"]], explanation: "The = ma'lum olmosh, is/are = kerakli fe'l shakli" }`
      );
    }
    for (let j = 0; j < needConnection; j++) {
      exercises.push(
`    { id: ${++maxId}, type: 'connection', instruction: "Yozing", prompt: "Mavzu haqida 3-4 gap yozing. O'z fikringizni bildiring va misol keltiring.", hints: ["Kamida 3 gap yozing", "Grammatikani to'g'ri yozing", "Misol keltiring"], exampleAnswer: "In my opinion, this topic is important. I use it every day. For example, I often practice speaking." }`
      );
    }

    // Insert before the closing ]
    const block = ',\n' + exercises.join(',\n') + '\n';
    content = content.substring(0, arrEnd) + block + content.substring(arrEnd);
    totalAdded += exercises.length;
  }

  fs.writeFileSync(filePath, content);
}

console.log(`Added: ${totalAdded} exercises`);
