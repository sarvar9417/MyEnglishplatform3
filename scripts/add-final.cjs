const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../src/data/daily');

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.ts') && f !== 'lessonsIndex.ts' && f !== 'index.ts');

let totalAdded = 0;

for (const file of files) {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find max ID
  const ids = [...content.matchAll(/\bid:\s*(\d{4,6})\b/g)].map(m => parseInt(m[1]));
  let maxId = ids.length > 0 ? Math.max(...ids) : 1000;

  // Find all exercise arrays: "exercises: [ ... ]"
  // We find each "exercises: [" and match its closing "]"
  const regex = /exercises:\s*\[/g;
  let match;
  const positions = [];
  while ((match = regex.exec(content)) !== null) {
    const start = match.index + match[0].length;
    let depth = 0;
    let end = -1;
    for (let i = start; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') {
        if (depth === 0) { end = i; break; }
        depth--;
      }
    }
    if (end > 0) {
      positions.push({ start: match.index, arrEnd: end, arrStart: start });
    }
  }

  // Insert in reverse order
  for (let i = positions.length - 1; i >= 0; i--) {
    const pos = positions[i];
    // Check if array already has exercises (non-empty)
    const arrContent = content.substring(pos.arrStart, pos.arrEnd).trim();
    if (arrContent.length < 5) continue;

    // Count MC in this specific exercise array
    const mcCount = (arrContent.match(/type: 'multiple-choice'/g) || []).length;
    if (mcCount < 3) continue;

    // Add 3 passage + 3 connection + 2 vocab-match = 8 exercises
    const newIds = [];
    for (let j = 0; j < 3; j++) {
      newIds.push(++maxId);
      newIds.push(++maxId); // for connection
    }
    for (let j = 0; j < 2; j++) {
      newIds.push(++maxId); // for vocab
    }
    let idx = 0;

    const exercises = [];
    for (let j = 0; j < 3; j++) {
      exercises.push(`    { id: ${newIds[idx++]}, type: 'passage', instruction: "Gaplarni to'ldiring:", passage: "Quyidagi matnni to'ldiring. Har bir bo'sh joyga to'g'ri javobni yozing.", blanks: ["word1", "word2", "word3"], acceptedAnswers: [["word1"], ["word2"], ["word3"]], explanation: "To'g'ri javoblar yuqoridagi so'zlar" }`);
      exercises.push(`    { id: ${newIds[idx++]}, type: 'connection', instruction: "Yozing", prompt: "Mavzu haqida 3-4 gap yozing. O'z fikringizni bildiring va misol keltiring.", hints: ["Kamida 3 gap yozing", "Grammatikani to'g'ri yozing", "Misol keltiring"], exampleAnswer: "In my opinion, this topic is important. I use it every day. For example, I often practice speaking." }`);
    }
    for (let j = 0; j < 2; j++) {
      exercises.push(`    { id: ${newIds[idx++]}, type: 'vocab-match', instruction: "So'zning to'g'ri ma'nosini tanlang", word: "example", options: ["misol", "katta", "kichik", "yangi"], correct: "misol", explanation: "Example = misol" }`);
    }

    const block = ',\n' + exercises.join(',\n') + '\n';
    content = content.substring(0, pos.arrEnd) + block + content.substring(pos.arrEnd);
    totalAdded += exercises.length;
  }

  fs.writeFileSync(filePath, content);
}

console.log(`Added: ${totalAdded}`);
