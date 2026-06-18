const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/data/daily');

const lessons = [
  { file: 'a1Part1.ts', name: 'alphabetAndGreetings', topic: 'alphabet and greetings', vocab: [['hello','salom'],['goodbye','xayr'],['please','iltimos'],['thank','rahmat']], idStart: 97000 },
  { file: 'a1Part1.ts', name: 'numbers', topic: 'numbers 1-100', vocab: [['one','bir'],['two','ikki'],['three','uch'],['ten','o\'n']], idStart: 97010 },
  { file: 'a1Part1.ts', name: 'colorsAndShapes', topic: 'colors and shapes', vocab: [['red','qizil'],['blue','ko\'k'],['green','yashil'],['yellow','sariq']], idStart: 97020 },
  { file: 'a1Part1.ts', name: 'family', topic: 'family members', vocab: [['mother','ona'],['father','ota'],['sister','opa/uka'],['brother','aka']], idStart: 97030 },
  { file: 'a1Part2.ts', name: 'demonstratives', topic: 'this/that/these/those', vocab: [['this','bu'],['that','u'],['these','bular'],['those','ular']], idStart: 97500 },
  { file: 'a1Part2.ts', name: 'prepositionsOfPlace', topic: 'prepositions of place', vocab: [['in','ichida'],['on','ustida'],['under','ostida'],['next to','yonida']], idStart: 97510 },
  { file: 'a1Part2.ts', name: 'basicAdjectives', topic: 'basic adjectives', vocab: [['big','katta'],['small','kichik'],['good','yaxshi'],['bad','yomon']], idStart: 97520 },
  { file: 'a1Part2.ts', name: 'thereIsAre', topic: 'there is/are', vocab: [['there is','bor'],['there are','borlar'],['some','ba\'zi'],['any','qandaydir']], idStart: 97530 },
  { file: 'a1Part2.ts', name: 'canCant', topic: 'can/can\'t', vocab: [['can','qila olmoq'],['can\'t','qila olmasmak'],['swim','suzmoq'],['drive','haydamoq']], idStart: 97540 },
  { file: 'a2Part1.ts', name: 'modalVerbs', topic: 'modal verbs', vocab: [['must','kerak'],['should','maslahat'],['can','mumkin'],['could','mumkin edi']], idStart: 98000 },
  { file: 'a2Part1.ts', name: 'articles', topic: 'articles a/the', vocab: [['a','bitta'],['the','ma\'lum'],['an','unli boshlanuvchi']], idStart: 98010 },
  { file: 'a2Part1.ts', name: 'prepositions', topic: 'prepositions', vocab: [['at','(vaqtda)'],['in','(oy/yil/haftada)'],['on','(kunda)'],['for','(davomida)']], idStart: 98020 },
  { file: 'a2Part1.ts', name: 'questionsLesson', topic: 'question formation', vocab: [['what','nima'],['where','qaerda'],['when','qachon'],['why','nega']], idStart: 98030 },
  { file: 'a2Part1.ts', name: 'countableUncountable', topic: 'countable/uncountable', vocab: [['much','ko\'p (nosanoa)'],['many','ko\'p (sanoa)'],['a lot of','ko\'p'],['some','ba\'zi']], idStart: 98040 },
  { file: 'a2Part2.ts', name: 'adjectiveAdverb', topic: 'adjective vs adverb', vocab: [['quick','tez (sifat)'],['quickly','tez (fe\'l)'],['careful','ehtiyotkor'],['carefully','ehtiyotkorlik bilan']], idStart: 98500 },
  { file: 'a2Part2.ts', name: 'gerundsInfinitives', topic: 'gerunds and infinitives', vocab: [['enjoy','+ V-ing'],['decide','+ to V'],['avoid','+ V-ing'],['want','+ to V']], idStart: 98510 },
  { file: 'a2Part2.ts', name: 'passiveVoice', topic: 'passive voice', vocab: [['is/are + V3','passiv (hozirgi)'],['was/were + V3','passiv (o\'tmish)'],['by','bajaruvchi']], idStart: 98520 },
  { file: 'a2Part2.ts', name: 'reportedSpeech', topic: 'reported speech', vocab: [['said that','dedi'],['asked if','so\'radi'],['told me','menga aytdi']], idStart: 98530 },
  { file: 'a2Part2.ts', name: 'firstConditional', topic: 'first conditional', vocab: [['if','agar'],['will','kelasi zamon'],['present simple','shart']], idStart: 98540 },
  { file: 'a2Part3.ts', name: 'verbPatterns', topic: 'verb patterns', vocab: [['like','+ V-ing/to V'],['love','+ V-ing/to V'],['prefer','+ V-ing/to V'],['hate','+ V-ing/to V']], idStart: 99000 },
  { file: 'a2Part3.ts', name: 'timePrepositions', topic: 'time prepositions', vocab: [['at','(vaqtda)'],['in','(oy/yil/haftada)'],['on','(kunda)'],['by','(gacha)']], idStart: 99010 },
  { file: 'a2Part3.ts', name: 'possessives', topic: 'possessives', vocab: [['my','mening'],['your','sening'],['his','uning (erkak)'],['her','uning (ayol)']], idStart: 99020 },
  { file: 'a2Part3.ts', name: 'thereIsThereAre', topic: 'there is/are', vocab: [['there is','bor (bitta)'],['there are','borlar (ko\'p)'],['isn\'t','yo\'q']], idStart: 99030 },
  { file: 'a2Part3.ts', name: 'someAnyNoEvery', topic: 'some/any/no/every', vocab: [['some','ba\'zi (tasdiq)'],['any','qandaydir (savol)'],['no','hech qanday'],['every','har bir']], idStart: 99040 },
  { file: 'a2Part4.ts', name: 'presentContinuousFuture', topic: 'present continuous for future', vocab: [['am/is/are + V-ing','kelajak (reja)'],['plan','reja'],['tomorrow','ertaga']], idStart: 99400 },
  { file: 'a2Part4.ts', name: 'quantifiers', topic: 'quantifiers', vocab: [['much','ko\'p (nosanoa)'],['many','ko\'p (sanoa)'],['few','kam (sanoa)'],['little','kam (nosanoa)']], idStart: 99410 },
  { file: 'a2Part4.ts', name: 'tooEnough', topic: 'too/enough', vocab: [['too','haddan tashqari'],['enough','yetarli'],['too + adj','juda'],['adj + enough','yetarli darajada']], idStart: 99420 },
  { file: 'a2Part4.ts', name: 'soSuch', topic: 'so/such', vocab: [['so + adj','shunchalik'],['such + noun','shunday'],['so...that','shunchalik...ki'],['such...that','shunday...ki']], idStart: 99430 },
  { file: 'b1Part1.ts', name: 'modalsSpeculation', topic: 'modals for speculation', vocab: [['must','95% ishonch'],['might','30% ishonch'],['could','mumkin'],['can\'t','0% ishonch']], idStart: 101000 },
  { file: 'b1Part1.ts', name: 'modalsObligation', topic: 'modals for obligation', vocab: [['must','majburiyat'],['have to','majburiyat (tashqi)'],['should','maslahat'],['need to','kerak']], idStart: 101010 },
  { file: 'b1Part1.ts', name: 'timeClauses', topic: 'time clauses', vocab: [['when','qachon'],['while','...paytda'],['before','...dan oldin'],['after','...dan keyin']], idStart: 101020 },
  { file: 'b1Part1.ts', name: 'wishesRegrets', topic: 'wishes and regrets', vocab: [['wish','xohlash'],['regret','afsuslanmoq'],['if only','kaflagan']], idStart: 101030 },
  { file: 'b1Part1.ts', name: 'questionTags', topic: 'question tags', vocab: [['isn\'t it?','emasmida?'],['don\'t they?','qilmasmi?'],['can\'t you?','qila olmayapsizmi?']], idStart: 101040 },
  { file: 'b1Part1.ts', name: 'indirectQuestions', topic: 'indirect questions', vocab: [['Could you tell me...?','Ayta olasizmi...?'],['Do you know...?','Bilasizmi...?'],['I wonder...','Qiziq...']], idStart: 101050 },
  { file: 'b1Part1.ts', name: 'futureFormsReview', topic: 'future forms', vocab: [['will','bashorat/va\'da'],['going to','reja/niyat'],['present continuous','rejalashtirilgan']], idStart: 101060 },
  { file: 'b1Extra.ts', name: 'relativeClausesB1', topic: 'relative clauses', vocab: [['who','odamlar'],['which','narsalar'],['where','joylar'],['whose','egalik']], idStart: 101500 },
  { file: 'b1Extra.ts', name: 'phrasalVerbsB1', topic: 'phrasal verbs', vocab: [['give up','voz kechmoq'],['look after','qarash'],['put off','kechiktirish'],['find out','topmoq']], idStart: 101510 },
  { file: 'b1plusPart1.ts', name: 'narrativeTensesB1plus', topic: 'narrative tenses', vocab: [['past simple','asosiy voqea'],['past continuous','fon'],['past perfect','oldingi voqea']], idStart: 102000 },
  { file: 'b1plusPart1.ts', name: 'advancedRelativeClausesB1plus', topic: 'advanced relative clauses', vocab: [['whom','object (rasmiy)'],['whose','egalik'],['where','joy'],['which','narsa']], idStart: 102010 },
  { file: 'b1plusPart1.ts', name: 'participleClausesB1plus', topic: 'participle clauses', vocab: [['V-ing','faol (hodisa)'],['V3','passiv (holat)'],['Having + V3','oldingi']], idStart: 102020 },
  { file: 'b1plusPart1.ts', name: 'infinitiveGerundAdvancedB1plus', topic: 'infinitive vs gerund', vocab: [['enjoy + V-ing','zavqlanmoq'],['decide + to V','qaror qilmoq'],['avoid + V-ing','qochmoq'],['hope + to V','umid qilmoq']], idStart: 102030 },
  { file: 'b1plusPart1.ts', name: 'modalPerfectsB1plus', topic: 'modal perfects', vocab: [['must have','kishli ishonch'],['should have','afsus'],['could have','imkon bor edi'],['might have','mumkin edi']], idStart: 102040 },
  { file: 'b1plusPart1.ts', name: 'emphasisDoesB1plus', topic: 'emphatic do/does/did', vocab: [['do + V1','urg\'u (hozirgi)'],['did + V1','urg\'u (o\'tmish)'],['does + V1','urg\'u (3-shaxs)']], idStart: 102050 },
  { file: 'b1plusPart1.ts', name: 'frontingB1plus', topic: 'fronting and inversion', vocab: [['Never','hech qachon'],['Rarely','kamdan-kam'],['Seldom','kamdan-kam'],['Not only','faqat emas']], idStart: 102060 },
  { file: 'b1plusPart1.ts', name: 'ellipsisSubstitutionB1plus', topic: 'ellipsis and substitution', vocab: [['ellipsis','tushirib qoldirish'],['substitution','almashtirish'],['do/so/one','o\'rinchi']], idStart: 102070 },
  { file: 'b1plusPart1.ts', name: 'concessionB1plus', topic: 'concession', vocab: [['although','...ga qaramay (gap)'],['despite','...ga qaramay (noun)'],['even though','hatto...ga qaramay']], idStart: 102080 },
  { file: 'b1plusPart2.ts', name: 'linkingWordsAdvanced', topic: 'advanced linking words', vocab: [['moreover','bundan tashqari'],['furthermore','shuningdek'],['nevertheless','bundan qaramay'],['however','biroq']], idStart: 102500 },
  { file: 'b1plusPart2.ts', name: 'collocationsMakeDoHaveTake', topic: 'collocations', vocab: [['make a decision','qaror qilish'],['do homework','vazifani bajarish'],['have a break','tanaffus qilish'],['take a photo','suratga olish']], idStart: 102510 },
  { file: 'b1plusPart2.ts', name: 'advancedPhrasalVerbs', topic: 'advanced phrasal verbs', vocab: [['give up','voz kechmoq'],['put up with','chidamoq'],['run into','uchrashmoq'],['look forward to','kutilmoq']], idStart: 102520 },
  { file: 'b1plusPart2.ts', name: 'idiomsCommon', topic: 'common idioms', vocab: [['break the ice','muzni sindirmoq'],['bite the bullet','qattiq qaror qilish'],['cost an arm and a leg','juda qimmat']], idStart: 102530 },
  { file: 'b1plusPart2.ts', name: 'prepositionalPhrases', topic: 'prepositional phrases', vocab: [['in spite of','...ga qaramay'],['according to','...ga ko\'ra'],['due to','tufayli'],['instead of','o\'rniga']], idStart: 102540 },
  { file: 'b1plusPart2.ts', name: 'wordFormation', topic: 'word formation', vocab: [['-tion','fe\'l → olmosh'],['-ment','fe\'l → olmosh'],['-ness','sifat → olmosh'],['un-','inkor']], idStart: 102550 },
  { file: 'b1plusPart2.ts', name: 'reportingVerbs', topic: 'reporting verbs', vocab: [['suggest','taklif qilmoq'],['recommend','maslahat bermoq'],['insist','talab qilmoq'],['deny','inkor qilmoq']], idStart: 102560 },
  { file: 'b1plusPart1.ts', name: 'b1plusReview', topic: 'B1+ review', vocab: [['although','...ga qaramay'],['must have','kishli ishonch'],['whom','object (rasmiy)']], idStart: 102570 },
  { file: 'b2Part1.ts', name: 'subjunctiveB2', topic: 'subjunctive mood', vocab: [['were','subjonktiv'],['had + V3','shart o\'tmish'],['be + V','buyruq']], idStart: 103000 },
  { file: 'b2Part1.ts', name: 'unrealPastB2', topic: 'unreal past', vocab: [['wish + were','hozirgi istak'],['wish + had + V3','o\'tmish afsus'],['if only','kaflagan']], idStart: 103010 },
  { file: 'b2Part1.ts', name: 'advancedConditionalsB2', topic: 'advanced conditionals', vocab: [['provided that','shart bilan'],['in case','holda'],['unless','agar...masa'],['but for','bo\'lmasa']], idStart: 103020 },
  { file: 'b2Part1.ts', name: 'nominalizationB2', topic: 'nominalization', vocab: [['decide → decision','qaror'],['arrange → arrangement','tartib'],['agree → kelishuv','kelishuv']], idStart: 103030 },
  { file: 'b2Part1.ts', name: 'hedgingB2', topic: 'hedging', vocab: [['might','mumkin'],['could','mumkin'],['it seems','ko\'rinadi'],['apparently','aytishlaricha']], idStart: 103040 },
  { file: 'b2Part1.ts', name: 'complexPrepositionsB2', topic: 'complex prepositions', vocab: [['in terms of','jihatdan'],['with regard to','bo\'yicha'],['on behalf of','nomidan'],['due to','tufayli']], idStart: 103050 },
  { file: 'b2Part1.ts', name: 'cohesionB2', topic: 'cohesion', vocab: [['this','shu'],['that','u'],['such','shunday'],['the former','birinchisi']], idStart: 103060 },
  { file: 'b2Part1.ts', name: 'registerB2', topic: 'register', vocab: [['formal','rasmiy'],['informal','norasmiy'],['neutral','neytral']], idStart: 103070 },
  { file: 'b2Part2.ts', name: 'complexSentencesB2', topic: 'complex sentences', vocab: [['noun clause','olmosh gap'],['relative clause','nisbat gapi'],['adverb clause','holat gapi']], idStart: 103500 },
  { file: 'b2Part2.ts', name: 'advancedModalsB2', topic: 'advanced modals', vocab: [['must have','kishli ishonch'],['can\'t have','mumkin emas'],['might have','mumkin edi'],['should have','kerak edi']], idStart: 103510 },
  { file: 'b2Part2.ts', name: 'contrastiveStructuresB2', topic: 'contrastive structures', vocab: [['although','...ga qaramay'],['whereas','holbuki'],['while','holbuki'],['nevertheless','bundan qaramay']], idStart: 103520 },
  { file: 'b2Part2.ts', name: 'punctuationB2', topic: 'punctuation', vocab: [['semicolon','nuqta-vergul'],['colon','ikki nuqta'],['dash','chiziq']], idStart: 103530 },
  { file: 'b2Part2.ts', name: 'academicCollocationsB2', topic: 'academic collocations', vocab: [['conduct research','tadqiqot olib borish'],['draw conclusions','xulosa chiqarish'],['raise awareness','ongni oshirish']], idStart: 103540 },
  { file: 'b2Part2.ts', name: 'criticalThinkingB2', topic: 'critical thinking', vocab: [['claim','da\'vo'],['evidence','dalil'],['counter-argument','qarshi dalil'],['bias','tarafkashlik']], idStart: 103550 },
  { file: 'b2Part2.ts', name: 'b2Review', topic: 'B2 review', vocab: [['nominalization','olmoshlashtirish'],['hedging','ehtiyotkorlik'],['cohesion','uzviylik']], idStart: 103560 },
  { file: 'b2Part3.ts', name: 'argumentStructureB2', topic: 'argument structure', vocab: [['thesis','tezis'],['claim','da\'vo'],['evidence','dalil'],['rebuttal','rad etish']], idStart: 104000 },
  { file: 'b2Part3.ts', name: 'stanceMarkersB2', topic: 'stance markers', vocab: [['I believe','men ishonaman'],['it seems','ko\'rinadi'],['clearly','aniqki'],['arguably','munozarali']], idStart: 104010 },
  { file: 'b2Part3.ts', name: 'paraphrasingB2', topic: 'paraphrasing', vocab: [['in other words','boshqa so\'z bilan'],['that is to say','ya\'ni'],['to put it simply','oddiy qilib aytganda']], idStart: 104020 },
  { file: 'b2Part3.ts', name: 'advancedVerbPatternsB2', topic: 'advanced verb patterns', vocab: [['deny + -ing','inkor qilmoq'],['refuse + to V','rad etmoq'],['admit + -ing','tan olmoq'],['suggest + V-ing','taklif qilmoq']], idStart: 104030 },
  { file: 'b2Part3.ts', name: 'b2ComprehensiveReview', topic: 'B2 comprehensive review', vocab: [['subjunctive','subjonktiv'],['nominalization','olmoshlashtirish'],['hedging','ehtiyotkorlik']], idStart: 104040 },
  { file: 'b2Extra.ts', name: 'inversionB2', topic: 'inversion', vocab: [['Never','hech qachon'],['Rarely','kamdan-kam'],['Not only','faqat emas'],['Hardly','deyarli']], idStart: 104500 },
  { file: 'b2Extra.ts', name: 'cleftSentencesB2', topic: 'cleft sentences', vocab: [['It is...that','...shu...ki'],['It was...who','...shu...kim'],['What...is','...narsa...']], idStart: 104510 },
  { file: 'b2Extra.ts', name: 'advancedPassiveB2', topic: 'advanced passive', vocab: [['get + V3','passiv (oddiy)'],['have + V + V3','boshqa qildirdim'],['be supposed to','kerak edi']], idStart: 104520 },
  { file: 'b2Extra.ts', name: 'academicVocabularyB2', topic: 'academic vocabulary', vocab: [['furthermore','bundan tashqari'],['consequently','natijada'],['subsequently','keyin'],['predominantly','asosan']], idStart: 104530 },
];

// Group lessons by file
const byFile = {};
for (const l of lessons) {
  if (!byFile[l.file]) byFile[l.file] = [];
  byFile[l.file].push(l);
}

let totalAdded = 0;

for (const [fileName, fileLessons] of Object.entries(byFile)) {
  const filePath = path.join(DIR, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Track IDs to avoid collisions — find max existing ID
  const idMatches = content.match(/id:\s*(\d{4,6})/g);
  let maxId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) : 1000;
  
  for (const lesson of fileLessons) {
    // Find lesson block — try `export const name:` or `const name:`
    const patterns = [
      `export const ${lesson.name}:`,
      `export const ${lesson.name} =`,
      `const ${lesson.name}:`,
      `const ${lesson.name} =`,
    ];
    
    let lessonIdx = -1;
    for (const p of patterns) {
      lessonIdx = content.indexOf(p);
      if (lessonIdx !== -1) break;
    }
    if (lessonIdx === -1) continue;
    
    // Find the next lesson export to insert before it
    const nextLessonIdx = content.indexOf('\nexport const ', lessonIdx + 1);
    const insertBefore = nextLessonIdx !== -1 ? nextLessonIdx : content.length;
    
    // Generate exercises
    const newExercises = [];
    
    // 2 passage exercises
    for (let p = 0; p < 2; p++) {
      const v1 = lesson.vocab[p * 2] || lesson.vocab[0];
      const v2 = lesson.vocab[p * 2 + 1] || lesson.vocab[1];
      newExercises.push(
`    { id: ${++maxId}, type: 'passage', instruction: "Matnni to'ldiring:", passage: "Gaplarni to'ldiring. ${v1[0]} va ${v2[0]} so'zlarini ishlating.", blanks: ["${v1[0]}", "${v2[0]}"], acceptedAnswers: [["${v1[0]}"], ["${v2[0]}"]], explanation: "${v1[0]} = ${v1[1]}, ${v2[0]} = ${v2[1]} — ${lesson.topic} mavzusidan" }`
      );
    }
    
    // 2 connection exercises
    for (let c = 0; c < 2; c++) {
      const v = lesson.vocab[c] || lesson.vocab[0];
      newExercises.push(
`    { id: ${++maxId}, type: 'connection', instruction: "${lesson.topic} haqida yozing", prompt: "${v[0]} (${v[1]}) so'zini ishlatib, 3-4 gap yozing.", hints: ["${v[0]} so'zini ishlating", "Kamida 3 gap yozing"], exampleAnswer: "Example: I often use ${v[0]} when I speak English. It means ${v[1]}." }`
      );
    }
    
    // 1 vocab-match
    const v = lesson.vocab[0];
    const wrong1 = lesson.vocab[1] ? lesson.vocab[1][1] : "noto'g'ri";
    const wrong2 = lesson.vocab[2] ? lesson.vocab[2][1] : "boshqa";
    const wrong3 = lesson.vocab[3] ? lesson.vocab[3][1] : "yana";
    newExercises.push(
`    { id: ${++maxId}, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: "${v[0]}", options: ["${v[1]}", "${wrong1}", "${wrong2}", "${wrong3}"], correct: "${v[1]}", explanation: "${v[0]} = ${v[1]} — ${lesson.topic} mavzusidan" }`
    );
    
    totalAdded += newExercises.length;
    
    // Insert before next lesson
    const exercisesBlock = newExercises.join(',\n');
    content = content.substring(0, insertBefore) + exercisesBlock + ',\n' + content.substring(insertBefore);
  }
  
  fs.writeFileSync(filePath, content);
}

console.log(`Total productive exercises added: ${totalAdded}`);
