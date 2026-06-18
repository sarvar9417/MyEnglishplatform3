const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/data/daily');

const lessons = [
  { file: 'a1Part1.ts', name: 'alphabetAndGreetings', topic: 'alphabet and greetings', vocab: [['hello','salom'],['goodbye','xayr'],['please','iltimos'],['thank','rahmat'],['yes','ha'],['no','yo\'q']], idStart: 97100 },
  { file: 'a1Part1.ts', name: 'numbers', topic: 'numbers 1-100', vocab: [['one','bir'],['two','ikki'],['three','uch'],['ten','o\'n'],['twenty','yigirma'],['hundred','yuz']], idStart: 97110 },
  { file: 'a1Part1.ts', name: 'colorsAndShapes', topic: 'colors and shapes', vocab: [['red','qizil'],['blue','ko\'k'],['green','yashil'],['yellow','sariq'],['circle','doira'],['square','kvadrat']], idStart: 97120 },
  { file: 'a1Part1.ts', name: 'family', topic: 'family members', vocab: [['mother','ona'],['father','ota'],['sister','opa/uka'],['brother','aka'],['family','oya-la']], idStart: 97130 },
  { file: 'a1Part2.ts', name: 'demonstratives', topic: 'this/that/these/those', vocab: [['this','bu'],['that','u'],['these','bular'],['those','ular']], idStart: 97600 },
  { file: 'a1Part2.ts', name: 'prepositionsOfPlace', topic: 'prepositions of place', vocab: [['in','ichida'],['on','ustida'],['under','ostida'],['next to','yonida'],['between','orasida']], idStart: 97610 },
  { file: 'a1Part2.ts', name: 'basicAdjectives', topic: 'basic adjectives', vocab: [['big','katta'],['small','kichik'],['good','yaxshi'],['bad','yomon'],['new','yangi'],['old','eski']], idStart: 97620 },
  { file: 'a1Part2.ts', name: 'thereIsAre', topic: 'there is/are', vocab: [['there is','bor'],['there are','borlar'],['some','ba\'zi'],['any','qandaydir']], idStart: 97630 },
  { file: 'a1Part2.ts', name: 'canCant', topic: 'can/can\'t', vocab: [['can','qila olmoq'],['can\'t','qila olmasmak'],['swim','suzmoq'],['drive','haydamoq'],['cook','pishirmoq']], idStart: 97640 },
  { file: 'a2Part1.ts', name: 'modalVerbs', topic: 'modal verbs', vocab: [['must','kerak'],['should','maslahat'],['can','mumkin'],['could','mumkin edi'],['may','ruxsat']], idStart: 98100 },
  { file: 'a2Part1.ts', name: 'articles', topic: 'articles a/the', vocab: [['a','bitta'],['the','ma\'lum'],['an','unli boshlanuvchi']], idStart: 98110 },
  { file: 'a2Part1.ts', name: 'prepositions', topic: 'prepositions', vocab: [['at','(vaqtda)'],['in','(oy/yil/haftada)'],['on','(kunda)'],['for','(davomida)'],['since','(dan beri)']], idStart: 98120 },
  { file: 'a2Part1.ts', name: 'questionsLesson', topic: 'question formation', vocab: [['what','nima'],['where','qaerda'],['when','qachon'],['why','nega'],['how','qanday']], idStart: 98130 },
  { file: 'a2Part1.ts', name: 'countableUncountable', topic: 'countable/uncountable', vocab: [['much','ko\'p (nosanoa)'],['many','ko\'p (sanoa)'],['a lot of','ko\'p'],['some','ba\'zi'],['few','kam']], idStart: 98140 },
  { file: 'a2Part2.ts', name: 'adjectiveAdverb', topic: 'adjective vs adverb', vocab: [['quick','tez (sifat)'],['quickly','tez (fe\'l)'],['careful','ehtiyotkor'],['carefully','ehtiyotkorlik bilan'],['slow','sekin (sifat)'],['slowly','sekin (fe\'l)']], idStart: 98600 },
  { file: 'a2Part2.ts', name: 'gerundsInfinitives', topic: 'gerunds and infinitives', vocab: [['enjoy','+ V-ing'],['decide','+ to V'],['avoid','+ V-ing'],['want','+ to V'],['finish','+ V-ing']], idStart: 98610 },
  { file: 'a2Part2.ts', name: 'passiveVoice', topic: 'passive voice', vocab: [['is/are + V3','passiv (hozirgi)'],['was/were + V3','passiv (o\'tmish)'],['by','bajaruvchi'],['V3','fe\'l uchinchi shakl']], idStart: 98620 },
  { file: 'a2Part2.ts', name: 'reportedSpeech', topic: 'reported speech', vocab: [['said that','dedi'],['asked if','so\'radi'],['told me','menga aytdi'],['replied','javob berdi']], idStart: 98630 },
  { file: 'a2Part2.ts', name: 'firstConditional', topic: 'first conditional', vocab: [['if','agar'],['will','kelasi zamon'],['present simple','shart'],['shall','biz uchun']], idStart: 98640 },
  { file: 'a2Part3.ts', name: 'verbPatterns', topic: 'verb patterns', vocab: [['like','+ V-ing/to V'],['love','+ V-ing/to V'],['prefer','+ V-ing/to V'],['hate','+ V-ing/to V'],['plan','+ to V']], idStart: 99100 },
  { file: 'a2Part3.ts', name: 'timePrepositions', topic: 'time prepositions', vocab: [['at','(vaqtda)'],['in','(oy/yil/haftada)'],['on','(kunda)'],['by','(gacha)'],['until','(gacha)']], idStart: 99110 },
  { file: 'a2Part3.ts', name: 'possessives', topic: 'possessives', vocab: [['my','mening'],['your','sening'],['his','uning (erkak)'],['her','uning (ayol)'],['their','ularning'],['its','uning (narsa)']], idStart: 99120 },
  { file: 'a2Part3.ts', name: 'someAnyNoEvery', topic: 'some/any/no/every', vocab: [['some','ba\'zi (tasdiq)'],['any','qandaydir (savol/inkor)'],['no','hech qanday'],['every','har bir'],['someone','kimdir']], idStart: 99130 },
  { file: 'a2Part4.ts', name: 'presentContinuousFuture', topic: 'present continuous for future', vocab: [['am/is/are + V-ing','kelajak (reja)'],['plan','reja'],['tomorrow','ertaga'],['tonight','kechqurun']], idStart: 99500 },
  { file: 'a2Part4.ts', name: 'quantifiers', topic: 'quantifiers', vocab: [['much','ko\'p (nosanoa)'],['many','ko\'p (sanoa)'],['few','kam (sanoa)'],['little','kam (nosanoa)'],['several','bir nechta']], idStart: 99510 },
  { file: 'a2Part4.ts', name: 'tooEnough', topic: 'too/enough', vocab: [['too','haddan tashqari'],['enough','yetarli'],['too + adj','juda'],['adj + enough','yetarli darajada']], idStart: 99520 },
  { file: 'a2Part4.ts', name: 'soSuch', topic: 'so/such', vocab: [['so + adj','shunchalik'],['such + noun','shunday'],['so...that','shunchalik...ki'],['such...that','shunday...ki']], idStart: 99530 },
  { file: 'b1Part1.ts', name: 'modalsSpeculation', topic: 'modals for speculation', vocab: [['must','95% ishonch'],['might','30% ishonch'],['could','mumkin'],['can\'t','0% ishonch'],['may','mumkin']], idStart: 101100 },
  { file: 'b1Part1.ts', name: 'modalsObligation', topic: 'modals for obligation', vocab: [['must','majburiyat'],['have to','majburiyat (tashqi)'],['should','maslahat'],['need to','kerak'],['ought to','kerak']], idStart: 101110 },
  { file: 'b1Part1.ts', name: 'timeClauses', topic: 'time clauses', vocab: [['when','qachon'],['while','...paytda'],['before','...dan oldin'],['after','...dan keyin'],['until','...gacha'],['as soon as','darhol']], idStart: 101120 },
  { file: 'b1Part1.ts', name: 'wishesRegrets', topic: 'wishes and regrets', vocab: [['wish','xohlash'],['regret','afsuslanmoq'],['if only','kaflagan'],['should have','kerak edi'],['could have','imkon bor edi']], idStart: 101130 },
  { file: 'b1Part1.ts', name: 'questionTags', topic: 'question tags', vocab: [['isn\'t it?','emasmida?'],['don\'t they?','qilmasmi?'],['can\'t you?','qila olmayapsizmi?'],['won\'t he?','qilmaydimi?'],['hasn\'t she?','qilganmimi?']], idStart: 101140 },
  { file: 'b1Part1.ts', name: 'indirectQuestions', topic: 'indirect questions', vocab: [['Could you tell me...?','Ayta olasizmi...?'],['Do you know...?','Bilasizmi...?'],['I wonder...','Qiziq...'],['Would you mind...?','Xohlamaysizmi...?']], idStart: 101150 },
  { file: 'b1Part1.ts', name: 'futureFormsReview', topic: 'future forms', vocab: [['will','bashorat/va\'da'],['going to','reja/niyat'],['present continuous','rejalashtirilgan'],['will be + V-ing','kelajak davom']], idStart: 101160 },
  { file: 'b1Extra.ts', name: 'relativeClausesB1', topic: 'relative clauses', vocab: [['who','odamlar'],['which','narsalar'],['where','joylar'],['whose','egalik'],['that','odam/narsa']], idStart: 101600 },
  { file: 'b1Extra.ts', name: 'phrasalVerbsB1', topic: 'phrasal verbs', vocab: [['give up','voz kechmoq'],['look after','qarash'],['put off','kechiktirish'],['find out','topmoq'],['turn on','yoqmoq'],['turn off','o\'chirmoq']], idStart: 101610 },
  { file: 'b1plusPart1.ts', name: 'narrativeTensesB1plus', topic: 'narrative tenses', vocab: [['past simple','asosiy voqea'],['past continuous','fon'],['past perfect','oldingi voqea'],['past perfect continuous','oldingi davom']], idStart: 102100 },
  { file: 'b1plusPart1.ts', name: 'advancedRelativeClausesB1plus', topic: 'advanced relative clauses', vocab: [['whom','object (rasmiy)'],['whose','egalik'],['where','joy'],['which','narsa'],['that','odam/narsa']], idStart: 102110 },
  { file: 'b1plusPart1.ts', name: 'participleClausesB1plus', topic: 'participle clauses', vocab: [['V-ing','faol (hodisa)'],['V3','passiv (holat)'],['Having + V3','oldingi'],['being + V3','holat']], idStart: 102120 },
  { file: 'b1plusPart1.ts', name: 'infinitiveGerundAdvancedB1plus', topic: 'infinitive vs gerund', vocab: [['enjoy + V-ing','zavqlanmoq'],['decide + to V','qaror qilmoq'],['avoid + V-ing','qochmoq'],['hope + to V','umid qilmoq'],['admit + -ing','tan olmoq']], idStart: 102130 },
  { file: 'b1plusPart1.ts', name: 'modalPerfectsB1plus', topic: 'modal perfects', vocab: [['must have','kishli ishonch'],['should have','afsus'],['could have','imkon bor edi'],['might have','mumkin edi'],['needn\'t have','kerak emas edi']], idStart: 102140 },
  { file: 'b1plusPart1.ts', name: 'emphasisDoesB1plus', topic: 'emphatic do/does/did', vocab: [['do + V1','urg\'u (hozirgi)'],['did + V1','urg\'u (o\'tmish)'],['does + V1','urg\'u (3-shaxs)']], idStart: 102150 },
  { file: 'b1plusPart1.ts', name: 'frontingB1plus', topic: 'fronting and inversion', vocab: [['Never','hech qachon'],['Rarely','kamdan-kam'],['Seldom','kamdan-kam'],['Not only','faqat emas'],['Hardly','deyarli']], idStart: 102160 },
  { file: 'b1plusPart1.ts', name: 'ellipsisSubstitutionB1plus', topic: 'ellipsis and substitution', vocab: [['ellipsis','tushirib qoldirish'],['substitution','almashtirish'],['do/so/one','o\'rinchi'],['not','inkor']], idStart: 102170 },
  { file: 'b1plusPart1.ts', name: 'concessionB1plus', topic: 'concession', vocab: [['although','...ga qaramay (gap)'],['despite','...ga qaramay (noun)'],['even though','hatto...ga qaramay'],['in spite of','...ga qaramay'],['however','biroq']], idStart: 102180 },
  { file: 'b1plusPart2.ts', name: 'linkingWordsAdvanced', topic: 'advanced linking words', vocab: [['moreover','bundan tashqari'],['furthermore','shuningdek'],['nevertheless','bundan qaramay'],['however','biroq'],['therefore','shuning uchun']], idStart: 102600 },
  { file: 'b1plusPart2.ts', name: 'collocationsMakeDoHaveTake', topic: 'collocations', vocab: [['make a decision','qaror qilish'],['do homework','vazifani bajarish'],['have a break','tanaffus qilish'],['take a photo','suratga olish'],['make progress','rivojlanish'],['do business','biznes qilish']], idStart: 102610 },
  { file: 'b1plusPart2.ts', name: 'advancedPhrasalVerbs', topic: 'advanced phrasal verbs', vocab: [['give up','voz kechmoq'],['put up with','chidamoq'],['run into','uchrashmoq'],['look forward to','kutilmoq'],['come up with','topmoq'],['get away with','qochmoq']], idStart: 102620 },
  { file: 'b1plusPart2.ts', name: 'idiomsCommon', topic: 'common idioms', vocab: [['break the ice','muzni sindirmoq'],['bite the bullet','qattiq qaror qilish'],['cost an arm and a leg','juda qimmat'],['hit the nail on the head','to\'g\'ri aytmoq'],['a piece of cake','oson ish']], idStart: 102630 },
  { file: 'b1plusPart2.ts', name: 'prepositionalPhrases', topic: 'prepositional phrases', vocab: [['in spite of','...ga qaramay'],['according to','...ga ko\'ra'],['due to','tufayli'],['instead of','o\'rniga'],['as a result','natijada']], idStart: 102640 },
  { file: 'b1plusPart2.ts', name: 'wordFormation', topic: 'word formation', vocab: [['-tion','fe\'l → olmosh'],['-ment','fe\'l → olmosh'],['-ness','sifat → olmosh'],['un-','inkor'],['re-','qayta'],['-ful','olmosh → sifat'],['-less','olmosh → sifat']], idStart: 102650 },
  { file: 'b1plusPart2.ts', name: 'reportingVerbs', topic: 'reporting verbs', vocab: [['suggest','taklif qilmoq'],['recommend','maslahat bermoq'],['insist','talab qilmoq'],['deny','inkor qilmoq'],['admit','tan olmoq'],['claim','da\'vo qilmoq']], idStart: 102660 },
  { file: 'b2Part1.ts', name: 'subjunctiveB2', topic: 'subjunctive mood', vocab: [['were','subjonktiv'],['had + V3','shart o\'tmish'],['be + V','buyruq'],['It\'s time','vaqt keldi']], idStart: 103100 },
  { file: 'b2Part1.ts', name: 'unrealPastB2', topic: 'unreal past', vocab: [['wish + were','hozirgi istak'],['wish + had + V3','o\'tmish afsus'],['if only','kaflagan'],['would rather','afzal ko\'rmoq']], idStart: 103110 },
  { file: 'b2Part1.ts', name: 'advancedConditionalsB2', topic: 'advanced conditionals', vocab: [['provided that','shart bilan'],['in case','holda'],['unless','agar...masa'],['but for','bo\'lmasa'],['on condition that','shart bilan']], idStart: 103120 },
  { file: 'b2Part1.ts', name: 'nominalizationB2', topic: 'nominalization', vocab: [['decide → decision','qaror'],['arrange → arrangement','tartib'],['agree → agreement','kelishuv'],['develop → development','rivojlanish'],['manage → management','boshqarish']], idStart: 103130 },
  { file: 'b2Part1.ts', name: 'hedgingB2', topic: 'hedging', vocab: [['might','mumkin'],['could','mumkin'],['it seems','ko\'rinadi'],['apparently','aytishlaricha'],['presumably','taxminan']], idStart: 103140 },
  { file: 'b2Part1.ts', name: 'complexPrepositionsB2', topic: 'complex prepositions', vocab: [['in terms of','jihatdan'],['with regard to','bo\'yicha'],['on behalf of','nomidan'],['due to','tufayli'],['as opposed to','teskarisiga']], idStart: 103150 },
  { file: 'b2Part1.ts', name: 'cohesionB2', topic: 'cohesion', vocab: [['this','shu'],['that','u'],['such','shunday'],['the former','birinchisi'],['the latter','ikkinchisi']], idStart: 103160 },
  { file: 'b2Part1.ts', name: 'registerB2', topic: 'register', vocab: [['formal','rasmiy'],['informal','norasmiy'],['neutral','neytral'],['colloquial','suhbatdoshlik']], idStart: 103170 },
  { file: 'b2Part2.ts', name: 'complexSentencesB2', topic: 'complex sentences', vocab: [['noun clause','olmosh gap'],['relative clause','nisbat gapi'],['adverb clause','holat gapi'],['conditional clause','shart gapi']], idStart: 103600 },
  { file: 'b2Part2.ts', name: 'advancedModalsB2', topic: 'advanced modals', vocab: [['must have','kishli ishonch'],['can\'t have','mumkin emas'],['might have','mumkin edi'],['should have','kerak edi'],['could have','imkon bor edi']], idStart: 103610 },
  { file: 'b2Part2.ts', name: 'contrastiveStructuresB2', topic: 'contrastive structures', vocab: [['although','...ga qaramay'],['whereas','holbuki'],['while','holbuki'],['nevertheless','bundan qaramay'],['conversely','teskarisiga']], idStart: 103620 },
  { file: 'b2Part2.ts', name: 'academicCollocationsB2', topic: 'academic collocations', vocab: [['conduct research','tadqiqot olib borish'],['draw conclusions','xulosa chiqarish'],['raise awareness','ongni oshirish'],['gather data','ma\'lumot to\'plash'],['analyze results','natijalarni tahlil qilish']], idStart: 103630 },
  { file: 'b2Part2.ts', name: 'criticalThinkingB2', topic: 'critical thinking', vocab: [['claim','da\'vo'],['evidence','dalil'],['counter-argument','qarshi dalil'],['bias','tarafkashlik'],['logical','mantiqiy']], idStart: 103640 },
  { file: 'b2Part3.ts', name: 'argumentStructureB2', topic: 'argument structure', vocab: [['thesis','tezis'],['claim','da\'vo'],['evidence','dalil'],['rebuttal','rad etish'],['premise','asos']], idStart: 104100 },
  { file: 'b2Part3.ts', name: 'stanceMarkersB2', topic: 'stance markers', vocab: [['I believe','men ishonaman'],['it seems','ko\'rinadi'],['clearly','aniqki'],['arguably','munozarali'],['undoubtedly','shubhasiz']], idStart: 104110 },
  { file: 'b2Part3.ts', name: 'paraphrasingB2', topic: 'paraphrasing', vocab: [['in other words','boshqa so\'z bilan'],['that is to say','ya\'ni'],['to put it simply','oddiy qilib aytganda'],['to be precise','aniqroq'],['in essence','asosan']], idStart: 104120 },
  { file: 'b2Part3.ts', name: 'advancedVerbPatternsB2', topic: 'advanced verb patterns', vocab: [['deny + -ing','inkor qilmoq'],['refuse + to V','rad etmoq'],['admit + -ing','tan olmoq'],['suggest + V-ing','taklif qilmoq'],['apologize + for + V-ing','uzr so\'ramoq']], idStart: 104130 },
  { file: 'b2Extra.ts', name: 'inversionB2', topic: 'inversion', vocab: [['Never','hech qachon'],['Rarely','kamdan-kam'],['Not only','faqat emas'],['Hardly','deyarli'],['Scarcely','garchi']], idStart: 104600 },
  { file: 'b2Extra.ts', name: 'cleftSentencesB2', topic: 'cleft sentences', vocab: [['It is...that','...shu...ki'],['It was...who','...shu...kim'],['What...is','...narsa...'],['All...is','...hamma narsa...']], idStart: 104610 },
  { file: 'b2Extra.ts', name: 'advancedPassiveB2', topic: 'advanced passive', vocab: [['get + V3','passiv (oddiy)'],['have + V + V3','boshqa qildirdim'],['be supposed to','kerak edi'],['get caught up','jalb qilindi']], idStart: 104620 },
  { file: 'b2Extra.ts', name: 'academicVocabularyB2', topic: 'academic vocabulary', vocab: [['furthermore','bundan tashqari'],['consequently','natijada'],['subsequently','keyin'],['predominantly','asosan'],['notwithstanding','barcha shunga qaramay']], idStart: 104630 },
];

// Group by file
const byFile = {};
for (const l of lessons) {
  if (!byFile[l.file]) byFile[l.file] = [];
  byFile[l.file].push(l);
}

let totalAdded = 0;

for (const [fileName, fileLessons] of Object.entries(byFile)) {
  const filePath = path.join(DIR, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const idMatches = content.match(/id:\s*(\d{4,6})/g);
  let maxId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) : 200000;
  
  // Find the end of the file (last closing bracket + semicolon) to append
  // Actually, find each lesson and insert before next lesson
  for (const lesson of fileLessons) {
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
    
    // Find exercises: [ after this lesson start
    const exArrayStart = content.indexOf('exercises: [', lessonIdx);
    if (exArrayStart === -1) continue;
    
    // Find matching ] for exercises array
    let depth = 0, exEnd = -1;
    const startIdx = exArrayStart + 'exercises: ['.length;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') { if (depth === 0) { exEnd = i; break; } depth--; }
    }
    if (exEnd === -1) continue;
    
    const newExercises = [];
    
    // 2 passage exercises
    for (let p = 0; p < 2; p++) {
      const v1 = lesson.vocab[p * 2] || lesson.vocab[0];
      const v2 = lesson.vocab[p * 2 + 1] || lesson.vocab[1];
      newExercises.push(
`    { id: ${++maxId}, type: 'passage', instruction: "Matnni to'ldiring:", passage: "Gaplarni to'ldiring. Quyidagi so'zlarni ishlating: ${v1[0]}, ${v2[0]}.", blanks: ["${v1[0]}", "${v2[0]}"], acceptedAnswers: [["${v1[0]}"], ["${v2[0]}"]], explanation: "${v1[0]} = ${v1[1]}, ${v2[0]} = ${v2[1]} — ${lesson.topic}" }`
      );
    }
    
    // 2 connection exercises
    for (let c = 0; c < 2; c++) {
      const v = lesson.vocab[c * 2] || lesson.vocab[0];
      newExercises.push(
`    { id: ${++maxId}, type: 'connection', instruction: "${lesson.topic} haqida yozing", prompt: "${v[0]} (${v[1]}) so'zini ishlatib, 3-4 gap yozing. ${v[0]} so'zini to'g'ri ishlatganingizni tekshiring.", hints: ["${v[0]} so'zini ishlating", "Kamida 3 gap yozing", "Grammatikani to'g'ri yozing"], exampleAnswer: "Example: I often use ${v[0]} in my daily life. It means ${v[1]} in Uzbek." }`
      );
    }
    
    // 1 vocab-match
    const v = lesson.vocab[0];
    const wrong1 = lesson.vocab[1] ? lesson.vocab[1][1] : "noto'g'ri";
    const wrong2 = lesson.vocab[2] ? lesson.vocab[2][1] : "boshqa";
    const wrong3 = lesson.vocab[3] ? lesson.vocab[3][1] : "yana";
    newExercises.push(
`    { id: ${++maxId}, type: 'vocab-match', instruction: "So'zning ma'nosini tanlang", word: "${v[0]}", options: ["${v[1]}", "${wrong1}", "${wrong2}", "${wrong3}"], correct: "${v[1]}", explanation: "${v[0]} = ${v[1]}" }`
    );
    
    // 2 more connection exercises (richer prompts)
    for (let c = 0; c < 2; c++) {
      const v = lesson.vocab[c * 2 + 2] || lesson.vocab[c] || lesson.vocab[0];
      newExercises.push(
`    { id: ${++maxId}, type: 'connection', instruction: "Kichik paragraf yozing", prompt: "${v[0]} (${v[1]}) mavzusida 4-5 gapdan iborat kichik paragraf yozing. O'z fikringizni bildiring.", hints: ["${v[0]} so'zini ishlating", "4-5 gap yozing", "O'z fikringizni yozing"], exampleAnswer: "I think ${v[0]} is very important. In Uzbek we say ${v[1]}. I use this word every day." }`
      );
    }
    
    totalAdded += newExercises.length;
    
    // Insert before closing bracket
    const exercisesStr = '\n' + newExercises.join(',\n') + ',';
    content = content.substring(0, exEnd) + exercisesStr + content.substring(exEnd);
  }
  
  fs.writeFileSync(filePath, content);
}

console.log(`Total productive exercises added: ${totalAdded}`);
