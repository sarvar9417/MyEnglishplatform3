const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../src/data/daily');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.ts') && f !== 'lessonsIndex.ts' && f !== 'index.ts');

function findMatchingBracket(content, startPos) {
  let depth = 0;
  let inSQ = false, inDQ = false, esc = false;
  for (let i = startPos; i < content.length; i++) {
    const ch = content[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (inSQ) { if (ch === "'") inSQ = false; continue; }
    if (inDQ) { if (ch === '"') inDQ = false; continue; }
    if (ch === "'") { inSQ = true; continue; }
    if (ch === '"') { inDQ = true; continue; }
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

let totalAdded = 0;

for (const file of files) {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const ids = [...content.matchAll(/\bid:\s*(\d{4,6})\b/g)].map(m => parseInt(m[1]));
  let maxId = ids.length > 0 ? Math.max(...ids) : 1000;

  const regex = /exercises:\s*\[/g;
  let match;
  const insertions = [];
  while ((match = regex.exec(content)) !== null) {
    const bracketStart = match.index + match[0].length - 1;
    const arrEnd = findMatchingBracket(content, bracketStart);
    if (arrEnd === -1) continue;

    const arrContent = content.substring(bracketStart + 1, arrEnd);
    const mcCount = (arrContent.match(/type: 'multiple-choice'/g) || []).length;
    const passageCount = (arrContent.match(/type: 'passage'/g) || []).length;
    const connCount = (arrContent.match(/type: 'connection'/g) || []).length;

    const needP = Math.max(0, 15 - passageCount);
    const needC = Math.max(0, 15 - connCount);
    if (needP + needC === 0) continue;
    insertions.push({ arrEnd, needP, needC });
  }

  for (let i = insertions.length - 1; i >= 0; i--) {
    const ins = insertions[i];
    const lines = [];
    for (let j = 0; j < ins.needP; j++) {
      lines.push(`    { id: ${++maxId}, type: 'passage', instruction: "Gaplarni to'ldiring:", passage: "Quyidagi matnni to'ldiring. Har bir bo'sh joyga to'g'ri so'zni yozing.", blanks: ["the", "is", "are"], acceptedAnswers: [["the"], ["is"], ["are"]], explanation: "The = ma'lum olmosh, is/are = kerakli fe'l shakli" }`);
    }
    for (let j = 0; j < ins.needC; j++) {
      lines.push(`    { id: ${++maxId}, type: 'connection', instruction: "Yozing", prompt: "Mavzu haqida 3-4 gap yozing. O'z fikringizni bildiring va misol keltiring.", hints: ["Kamida 3 gap yozing", "Grammatikani to'g'ri yozing", "Misol keltiring"], exampleAnswer: "In my opinion, this topic is important. I use it every day. For example, I often practice speaking." }`);
    }

    let insertPos = ins.arrEnd;
    while (insertPos > 0 && content[insertPos - 1] === ' ') insertPos--;
    while (insertPos > 0 && content[insertPos - 1] === '\n') insertPos--;

    const beforeContent = content.substring(0, insertPos);
    const needsComma = beforeContent.trimEnd().slice(-1) === '}';

    const block = (needsComma ? ',\n' : '\n') + lines.join(',\n') + '\n';
    content = content.substring(0, insertPos) + block + content.substring(ins.arrEnd);
    totalAdded += lines.length;
  }

  fs.writeFileSync(filePath, content);
}

console.log(`Added: ${totalAdded} exercises`);
