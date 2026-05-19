// scripts/find-missing-words.mjs
// Cross-references wordBank.ts + vocabularyWords.ts against seed data
// to find words that are missing from the database.

import { readFileSync } from 'fs'

// 1. Load all seed words (english + level)
const allSeed = new Set()
const seedFiles = {
  'A1': 'scripts/words/a1.ts',
  'A2': 'scripts/words/a2.ts',
  'B1': 'scripts/words/b1.ts',
  'B2': 'scripts/words/b2.ts',
}

const TUPLE_RE = /\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\],?\s*/g
function unescapeJs(s) { return s.replace(/\\(['"\\])/g, '$1') }

for (const [level, file] of Object.entries(seedFiles)) {
  const content = readFileSync(file, 'utf-8')
  let match
  while ((match = TUPLE_RE.exec(content)) !== null) {
    const english = unescapeJs(match[1]).trim().toLowerCase()
    allSeed.add(`${english}|${level}`)
  }
}

console.log(`Seed jadvalida: ${allSeed.size} ta so'z`)

// 2. Parse wordBank.ts headwords
const wb = readFileSync('src/data/wordBank.ts', 'utf-8')
// Extract the wordBank entries... we know the structure from the mk() calls

// Simple approach: find Phase arrays and extract words
const phases = [
  { name: 'PHASE1', var: 'PHASE1', level: 'B1' },
  { name: 'PHASE2_VOCAB', var: 'PHASE2_VOCAB', level: 'B2' },
  { name: 'PHASE2_PHRASAL', var: 'PHASE2_PHRASAL', level: 'B1' },
  { name: 'PHASE3_ACADEMIC', var: 'PHASE3_ACADEMIC', level: 'B2' },
  { name: 'PHASE3_IDIOMS', var: 'PHASE3_IDIOMS', level: 'B2' },
]

// Extract array contents between const and the next const/export
function extractArray(content, varName) {
  const startMarker = `const ${varName}:`
  const startIdx = content.indexOf(startMarker)
  if (startIdx === -1) return []

  const slice = content.slice(startIdx)
  const bracketIdx = slice.indexOf('= [')
  if (bracketIdx === -1) return []
  let depth = 0
  let endIdx = bracketIdx + 3
  for (let i = bracketIdx + 3; i < slice.length; i++) {
    const ch = slice[i]
    if (ch === '[') depth++
    else if (ch === ']') {
      if (depth === 0) { endIdx = i + 1; break }
      depth--
    }
  }
  const arrayText = slice.slice(bracketIdx + 3, endIdx - 1)

  // Extract all single-quoted strings
  const words = []
  const strRe = /'((?:[^'\\]|\\.)*)'/g
  let m
  while ((m = strRe.exec(arrayText)) !== null) {
    words.push(unescapeJs(m[1]).trim())
  }
  return words
}

const wbMissing = []
for (const phase of phases) {
  const words = extractArray(wb, phase.var)
  console.log(`\n${phase.var} (${phase.level}): ${words.length} ta so'z`)

  for (const word of words) {
    const key = `${word.toLowerCase()}|${phase.level}`
    if (!allSeed.has(key)) {
      wbMissing.push({ word, level: phase.level, source: `wordBank.ts/${phase.name}` })
    }
  }
}

console.log(`\n=== wordBank.ts dan yetishmayotgan so'zlar ===`)
console.log(`${wbMissing.length} ta`)
for (const w of wbMissing) {
  console.log(`  ${w.word} (${w.level}) [${w.source}]`)
}

// 3. vocabularyWords.ts (60 B1+ words)
const vw = readFileSync('src/data/vocabularyWords.ts', 'utf-8')
const vwWords = []
const vwRe = /word:\s*'((?:[^'\\]|\\.)*)'/g
let mm
while ((mm = vwRe.exec(vw)) !== null) {
  vwWords.push(unescapeJs(mm[1]).trim())
}
console.log(`\nvocabularyWords.ts: ${vwWords.length} ta so'z`)

const vwLevels = {
  'analyze': 'B2', 'appointment': 'B1', 'frequently': 'B1', 'realize': 'B1',
  'accommodation': 'B1', 'apologize': 'B1', 'disappoint': 'B1', 'fascinate': 'B2',
  'impress': 'B1', 'relief': 'B1',
}

const vwMissing = []
for (const word of vwWords) {
  const lvl = vwLevels[word.toLowerCase()] || 'B1'
  const key = `${word.toLowerCase()}|${lvl}`
  if (!allSeed.has(key)) {
    vwMissing.push({ word, level: lvl, source: 'vocabularyWords.ts' })
  }
}
console.log(`\nvocabularyWords.ts dan yetishmayotgan: ${vwMissing.length} ta`)
for (const w of vwMissing) {
  console.log(`  ${w.word} (${w.level})`)
}

// Also check PHASE1 words that are level B1 in wordBank but might be A2 level
// These are high-frequency words that should be in A2 or B1
const knownA2Gaps = [
  'accomplish', 'admire', 'advertise', 'apologize', 'arrange',
  'behave', 'blame', 'cancel', 'collect', 'communicate',
  'compare', 'complain', 'connect', 'consider', 'contain',
  'convince', 'decide', 'define', 'delay', 'describe',
  'discuss', 'divide', 'educate', 'enable', 'examine',
  'expect', 'explain', 'express', 'fail', 'fill',
  'follow', 'forget', 'gather', 'grow', 'guess',
  'happen', 'include', 'inform', 'involve', 'join',
  'judge', 'keep', 'laugh', 'listen', 'manage',
  'match', 'mention', 'miss', 'notice', 'offer',
  'organize', 'overcome', 'perform', 'plan', 'practice',
  'prepare', 'prevent', 'provide', 'receive', 'recognize',
  'recommend', 'refer', 'remain', 'remove', 'respond',
  'result', 'save', 'seem', 'share', 'solve',
  'spend', 'suggest', 'support', 'teach', 'tend',
  'trust', 'wonder',
]

const a2Missing = knownA2Gaps.filter(w => !allSeed.has(`${w}|A2`) && !allSeed.has(`${w}|B1`))
console.log(`\nA2 ga tegishli bo'lishi mumkin bo'lgan yetishmayotgan: ${a2Missing.length} ta`)
for (const w of a2Missing) {
  console.log(`  ${w}`)
}
