/**
 * Fix duplicate exercise IDs across all daily lesson files.
 * Handles both `id: 12345` and `"id":12345` formats.
 */
const fs = require('fs');
const path = require('path');

const DAILY_DIR = path.join(__dirname, '..', 'src', 'data', 'daily');
const FILES = fs.readdirSync(DAILY_DIR).filter(f => f.endsWith('.ts') && !f.includes('test') && !f.includes('Index'));

// Match id: 12345 or "id":12345 or 'id':12345
const ID_REGEX = /(['"]?)id(['"]?)\s*:\s*(\d{4,6})/g;

const allEntries = [];

for (const file of FILES) {
  const filePath = path.join(DAILY_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m;
    ID_REGEX.lastIndex = 0;
    while ((m = ID_REGEX.exec(line)) !== null) {
      allEntries.push({ file, line: i, id: parseInt(m[3]), keyQuote: m[1], valQuote: '' });
    }
  }
}

console.log(`Found ${allEntries.length} exercise/test IDs across ${FILES.length} files`);

// Find duplicates
const seen = new Map();
for (const entry of allEntries) {
  if (!seen.has(entry.id)) {
    seen.set(entry.id, []);
  }
  seen.get(entry.id).push(entry);
}

const duplicateIds = [];
for (const [id, entries] of seen) {
  if (entries.length > 1) {
    duplicateIds.push({ id, entries });
  }
}

console.log(`Found ${duplicateIds.length} duplicate IDs`);

let maxId = 0;
for (const entry of allEntries) {
  if (entry.id > maxId) maxId = entry.id;
}
console.log(`Max existing ID: ${maxId}`);

// Renumber — keep first occurrence, change rest
let nextId = maxId + 1;
const changes = [];

duplicateIds.sort((a, b) => a.id - b.id);

for (const { id, entries } of duplicateIds) {
  for (let i = 1; i < entries.length; i++) {
    changes.push({ file: entries[i].file, line: entries[i].line, oldId: id, newId: nextId });
    nextId++;
  }
}

console.log(`Will renumber ${changes.length} exercises`);

// Group by file
const changesByFile = {};
for (const c of changes) {
  if (!changesByFile[c.file]) changesByFile[c.file] = [];
  changesByFile[c.file].push(c);
}

let totalChanged = 0;
for (const [file, fileChanges] of Object.entries(changesByFile)) {
  const filePath = path.join(DAILY_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  fileChanges.sort((a, b) => b.line - a.line);
  
  for (const { line, oldId, newId } of fileChanges) {
    const original = lines[line];
    
    // Detect format: "id":12345 vs id: 12345
    const jsonFormat = original.includes(`"id":${oldId}`);
    const singleQuoteFormat = original.includes(`'id':${oldId}`);
    
    if (jsonFormat) {
      lines[line] = lines[line].replace(`"id":${oldId}`, `"id":${newId}`);
    } else if (singleQuoteFormat) {
      lines[line] = lines[line].replace(`'id':${oldId}`, `'id':${newId}`);
    } else {
      // Unquoted: id: 12345 or id:12345
      const regex = new RegExp(`\\bid:\\s*${oldId}\\b`);
      if (regex.test(lines[line])) {
        lines[line] = lines[line].replace(regex, `id: ${newId}`);
      } else {
        // Fallback: try with quotes around key
        const fallback = new RegExp(`"id":\\s*${oldId}\\b`);
        if (fallback.test(lines[line])) {
          lines[line] = lines[line].replace(fallback, `"id": ${newId}`);
        } else {
          console.warn(`  WARNING: Could not find id: ${oldId} on line ${line + 1} of ${file}`);
          continue;
        }
      }
    }
    totalChanged++;
  }
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`  ${file}: ${fileChanges.length} IDs renumbered`);
}

console.log(`\nDone! ${totalChanged} IDs renumbered`);
