/**
 * Fix duplicate exercise IDs across all daily lesson files.
 * Reads all .ts files, finds duplicate IDs, renumbers them.
 */
const fs = require('fs');
const path = require('path');

const DAILY_DIR = path.join(__dirname, '..', 'src', 'data', 'daily');
const FILES = [
  'a1Part1.ts', 'a1Part2.ts', 'a1Part3.ts',
  'a2Part1.ts', 'a2Part2.ts', 'a2Part3.ts', 'a2Part4.ts',
  'b1Part1.ts', 'b1Part2.ts', 'b1Part3.ts', 'b1Extra.ts',
  'b1plusPart1.ts', 'b1plusPart2.ts', 'b1plusExtra.ts',
  'b2Part1.ts', 'b2Part2.ts', 'b2Part3.ts',
];

// Step 1: Scan all files and find all IDs with their positions
const allEntries = []; // { fileId, line, col, id }

for (const file of FILES) {
  const filePath = path.join(DAILY_DIR, file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match id: 12345 or id: 12345,
    const matches = line.matchAll(/\bid:\s*(\d{4,6})\b/g);
    for (const m of matches) {
      allEntries.push({ file, line: i, id: parseInt(m[1]) });
    }
  }
}

console.log(`Found ${allEntries.length} exercise/test IDs across ${FILES.length} files`);

// Step 2: Find duplicates
const seen = new Map(); // id -> [{file, line}]
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

// Step 3: Find max existing ID
let maxId = 0;
for (const entry of allEntries) {
  if (entry.id > maxId) maxId = entry.id;
}
console.log(`Max existing ID: ${maxId}`);

// Step 4: For each duplicate, keep first occurrence, renumber the rest
let nextId = maxId + 1;
const changes = []; // {file, line, oldId, newId}

// Sort duplicates by ID for consistency
duplicateIds.sort((a, b) => a.id - b.id);

for (const { id, entries } of duplicateIds) {
  // Keep first, renumber the rest
  for (let i = 1; i < entries.length; i++) {
    changes.push({ file: entries[i].file, line: entries[i].line, oldId: id, newId: nextId });
    nextId++;
  }
}

console.log(`Will renumber ${changes.length} exercises`);

// Step 5: Apply changes file by file (process in reverse order per file to avoid line shifts)
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
  
  // Sort by line descending so replacements don't shift later lines
  fileChanges.sort((a, b) => b.line - a.line);
  
  for (const { line, oldId, newId } of fileChanges) {
    const original = lines[line];
    // Replace the specific id value on this line
    const regex = new RegExp(`\\bid:\\s*${oldId}\\b`);
    if (regex.test(lines[line])) {
      lines[line] = lines[line].replace(regex, `id: ${newId}`);
      totalChanged++;
    } else {
      console.warn(`  WARNING: Could not find id: ${oldId} on line ${line + 1} of ${file}`);
    }
  }
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`  ${file}: ${fileChanges.length} IDs renumbered`);
}

console.log(`\nDone! ${totalChanged} IDs renumbered in ${Object.keys(changesByFile).length} files`);
