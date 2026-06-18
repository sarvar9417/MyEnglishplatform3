const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/data/daily');

// Each lesson gets 8 more exercises (passage + connection + vocab-match)
const lessons = [
  // A1
  { file: 'a1Part1.ts', name: 'alphabetAndGreetings', vocab: [['hello','salom'],['goodbye','xayr'],['yes','ha'],['no','yo\'q'],['please','iltimos'],['thank','rahmat'],['sorry','uzr'],['excuse me','kechirasiz']], idStart: 97200 },
  { file: 'a1Part1.ts', name: 'numbers', vocab: [['one','bir'],['two','ikki'],['three','uch'],['four','to\'rt'],['five','besh'],['ten','o\'n'],['twenty','yigirma'],['hundred','yuz']], idStart: 97210 },
  { file: 'a1Part1.ts', name: 'colorsAndShapes', vocab: [['red','qizil'],['blue','ko\'k'],['green','yashil'],['yellow','sariq'],['white','oq'],['black','qora'],['circle','doira'],['square','kvadrat']], idStart: 97220 },
  { file: 'a1Part1.ts', name: 'family', vocab: [['mother','ona'],['father','ota'],['sister','opa'],['brother','aka'],['son','o\'g\'il'],['daughter','qiz'],['grandmother','bobo/onalar'],['grandfather','bobo/ota']], idStart: 97230 },
  { file: 'a1Part2.ts', name: 'demonstratives', vocab: [['this','bu'],['that','u'],['these','bular'],['those','ular']], idStart: 97700 },
  { file: 'a1Part2.ts', name: 'prepositionsOfPlace', vocab: [['in','ichida'],['on','ustida'],['under','ostida'],['next to','yonida'],['between','orasida'],['behind','ortida'],['in front of','oldida']], idStart: 97710 },
  { file: 'a1Part2.ts', name: 'basicAdjectives', vocab: [['big','katta'],['small','kichik'],['good','yaxshi'],['bad','yomon'],['new','yangi'],['old','eski'],['hot','issiq'],['cold','sovuq']], idStart: 97720 },
  { file: 'a1Part2.ts', name: 'thereIsAre', vocab: [['there is','bor'],['there are','borlar'],['some','ba\'zi'],['any','qandaydir']], idStart: 97730 },
  { file: 'a1Part2.ts', name: 'canCant', vocab: [['can','qila olmoq'],['can\'t','qila olmasmak'],['swim','suzmoq'],['drive','haydamoq'],['cook','pishirmoq'],['sing','kuylamoq'],['dance','raqs qilmoq'],['read','o\'qimoq']], idStart: 97740 },
  // A2
  { file: 'a2Part1.ts', name: 'modalVerbs', vocab: [['must','kerak'],['should','maslahat'],['can','mumkin'],['could','mumkin edi'],['may','ruxsat'],['might','mumkin']], idStart: 98200 },
  { file: 'a2Part1.ts', name: 'articles', vocab: [['a','bitta (anor)'],['the','ma\'lum (anor)'],['an','unli boshlanuvchi']], idStart: 98210 },
  { file: 'a2Part1.ts', name: 'prepositions', vocab: [['at','(vaqtda)'],['in','(oy/yil/haftada)'],['on','(kunda)'],['for','(davomida)'],['since','(dan beri)'],['during','(davomida)']], idStart: 98220 },
  { file: 'a2Part1.ts', name: 'questionsLesson', vocab: [['what','nima'],['where','qaerda'],['when','qachon'],['why','nega'],['how','qanday'],['who','kim']], idStart: 98230 },
  { file: 'a2Part1.ts', name: 'countableUncountable', vocab: [['much','ko\'p (nosanoa)'],['many','ko\'p (sanoa)'],['a lot of','ko\'p'],['some','ba\'zi'],['few','kam (sanoa)'],['little','kam (nosanoa)']], idStart: 98240 },
  { file: 'a2Part2.ts', name: 'adjectiveAdverb', vocab: [['quick','tez (sifat)'],['quickly','tez (fe\'l)'],['careful','ehtiyotkor'],['carefully','ehtiyotkorlik bilan'],['slow','sekin (sifat)'],['slowly','sekin (fe\'l)'],['happy','baxtli'],['happily','baxtli ravishda']], idStart: 98700 },
  { file: 'a2Part2.ts', name: 'gerundsInfinitives', vocab: [['enjoy','+ V-ing'],['decide','+ to V'],['avoid','+ V-ing'],['want','+ to V'],['finish','+ V-ing'],['hope','+ to V'],['keep','+ V-ing'],['plan','+ to V']], idStart: 98710 },
  { file: 'a2Part2.ts', name: 'passiveVoice', vocab: [['is/are + V3','passiv (hozirgi)'],['was/were + V3','passiv (o\'tmish)'],['by','bajaruvchi'],['V3','fe\'l uchinchi shakl'],['been','bo\'lgan'],['being','bo\'lib']], idStart: 98720 },
  { file: 'a2Part2.ts', name: 'reportedSpeech', vocab: [['said that','dedi'],['asked if','so\'radi'],['told me','menga aytdi'],['replied','javob berdi'],['exclaimed','baqirdi']], idStart: 98730 },
  { file: 'a2Part2.ts', name: 'firstConditional', vocab: [['if','agar'],['will','kelasi zamon'],['present simple','shart'],['shall','biz uchun']], idStart: 98740 },
  { file: 'a2Part3.ts', name: 'verbPatterns', vocab: [['like','+ V-ing/to V'],['love','+ V-ing/to V'],['prefer','+ V-ing/to V'],['hate','+ V-ing/to V'],['plan','+ to V'],['suggest','+ V-ing'],['imagine','+ V-ing'],['consider','+ V-ing']], idStart: 99200 },
  { file: 'a2Part3.ts', name: 'timePrepositions', vocab: [['at','(vaqtda)'],['in','(oy/yil/haftada)'],['on','(kunda)'],['by','(gacha)'],['until','(gacha)'],['during','(davomida)']], idStart: 99210 },
  { file: 'a2Part3.ts', name: 'possessives', vocab: [['my','mening'],['your','sening'],['his','uning (erkak)'],['her','uning (ayol)'],['its','uning (narsa)'],['our','bizning'],['their','ularning']], idStart: 99220 },
  { file: 'a2Part3.ts', name: 'someAnyNoEvery', vocab: [['some','ba\'zi (tasdiq)'],['any','qandaydir (savol/inkor)'],['no','hech qanday'],['every','har bir'],['someone','kimdir'],['something','nimadir'],['somewhere','qaerdir']], idStart: 99230 },
  { file: 'a2Part4.ts', name: 'presentContinuousFuture', vocab: [['am/is/are + V-ing','kelajak (reja)'],['plan','reja'],['tomorrow','ertaga'],['tonight','kechqurun'],['next week','kelasi hafta']], idStart: 99600 },
  { file: 'a2Part4.ts', name: 'quantifiers', vocab: [['much','ko\'p (nosanoa)'],['many','ko\'p (sanoa)'],['few','kam (sanoa)'],['little','kam (nosanoa)'],['several','bir nechta'],['enough','yetarli']], idStart: 99610 },
  { file: 'a2Part4.ts', name: 'tooEnough', vocab: [['too','haddan tashqari'],['enough','yetarli'],['too + adj','juda'],['adj + enough','yetarli darajada']], idStart: 99620 },
  { file: 'a2Part4.ts', name: 'soSuch', vocab: [['so + adj','shunchalik'],['such + noun','shunday'],['so...that','shunchalik...ki'],['such...that','shunday...ki']], idStart: 99630 },
  // B1
  { file: 'b1Part1.ts', name: 'modalsSpeculation', vocab: [['must','95% ishonch'],['might','30% ishonch'],['could','mumkin'],['can\'t','0% ishonch'],['may','mumkin']], idStart: 101200 },
  { file: 'b1Part1.ts', name: 'modalsObligation', vocab: [['must','majburiyat'],['have to','majburiyat (tashqi)'],['should','maslahat'],['need to','kerak'],['ought to','kerak'],['be supposed to','kerak edi']], idStart: 101210 },
  { file: 'b1Part1.ts', name: 'timeClauses', vocab: [['when','qachon'],['while','...paytda'],['before','...dan oldin'],['after','...dan keyin'],['until','...gacha'],['as soon as','darhol'],['by the time','gacha']], idStart: 101220 },
  { file: 'b1Part1.ts', name: 'wishesRegrets', vocab: [['wish','xohlash'],['regret','afsuslanmoq'],['if only','kaflagan'],['should have','kerak edi'],['could have','imkon bor edi'],['would rather','afzal ko\'rmoq']], idStart: 101230 },
  { file: 'b1Part1.ts', name: 'questionTags', vocab: [['isn\'t it?','emasmida?'],['don\'t they?','qilmasmi?'],['can\'t you?','qila olmayapsizmi?'],['won\'t he?','qilmaydimi?'],['hasn\'t she?','qilganmimi?'],['didn\'t they?','qilishmadi?']], idStart: 101240 },
  { file: 'b1Part1.ts', name: 'indirectQuestions', vocab: [['Could you tell me...?','Ayta olasizmi...?'],['Do you know...?','Bilasizmi...?'],['I wonder...','Qiziq...'],['Would you mind...?','Xohlamaysizmi...?'],['I\'d like to know...','Bilmoqchiman...']], idStart: 101250 },
  { file: 'b1Part1.ts', name: 'futureFormsReview', vocab: [['will','bashorat/va\'da'],['going to','reja/niyat'],['present continuous','rejalashtirilgan'],['will be + V-ing','kelajak davom']], idStart: 101260 },
  { file: 'b1Extra.ts', name: 'relativeClausesB1', vocab: [['who','odamlar'],['which','narsalar'],['where','joylar'],['whose','egalik'],['that','odam/narsa']], idStart: 101700 },
  { file: 'b1Extra.ts', name: 'phrasalVerbsB1', vocab: [['give up','voz kechmoq'],['look after','qarash'],['put off','kechiktirish'],['find out','topmoq'],['turn on','yoqmoq'],['turn off','o\'chirmoq'],['pick up','ko\'tarmoq'],['set up','o\'rnatmoq']], idStart: 101710 },
  // B1+
  { file: 'b1plusPart1.ts', name: 'narrativeTensesB1plus', vocab: [['past simple','asosiy voqea'],['past continuous','fon'],['past perfect','oldingi voqea'],['past perfect continuous','oldingi davom']], idStart: 102200 },
  { file: 'b1plusPart1.ts', name: 'advancedRelativeClausesB1plus', vocab: [['whom','object (rasmiy)'],['whose','egalik'],['where','joy'],['which','narsa'],['that','odam/narsa']], idStart: 102210 },
  { file: 'b1plusPart1.ts', name: 'participleClausesB1plus', vocab: [['V-ing','faol (hodisa)'],['V3','passiv (holat)'],['Having + V3','oldingi'],['being + V3','holat']], idStart: 102220 },
  { file: 'b1plusPart1.ts', name: 'infinitiveGerundAdvancedB1plus', vocab: [['enjoy + V-ing','zavqlanmoq'],['decide + to V','qaror qilmoq'],['avoid + V-ing','qochmoq'],['hope + to V','umid qilmoq'],['admit + -ing','tan olmoq'],['deny + -ing','inkor qilmoq']], idStart: 102230 },
  { file: 'b1plusPart1.ts', name: 'modalPerfectsB1plus', vocab: [['must have','kishli ishonch'],['should have','afsus'],['could have','imkon bor edi'],['might have','mumkin edi'],['needn\'t have','kerak emas edi']], idStart: 102240 },
  { file: 'b1plusPart1.ts', name: 'emphasisDoesB1plus', vocab: [['do + V1','urg\'u (hozirgi)'],['did + V1','urg\'u (o\'tmish)'],['does + V1','urg\'u (3-shaxs)']], idStart: 102250 },
  { file: 'b1plusPart1.ts', name: 'frontingB1plus', vocab: [['Never','hech qachon'],['Rarely','kamdan-kam'],['Seldom','kamdan-kam'],['Not only','faqat emas'],['Hardly','deyarli']], idStart: 102260 },
  { file: 'b1plusPart1.ts', name: 'ellipsisSubstitutionB1plus', vocab: [['ellipsis','tushirib qoldirish'],['substitution','almashtirish'],['do/so/one','o\'rinchi'],['not','inkor']], idStart: 102270 },
  { file: 'b1plusPart1.ts', name: 'concessionB1plus', vocab: [['although','...ga qaramay (gap)'],['despite','...ga qaramay (noun)'],['even though','hatto...ga qaramay'],['in spite of','...ga qaramay'],['however','biroq']], idStart: 102280 },
  { file: 'b1plusPart2.ts', name: 'linkingWordsAdvanced', vocab: [['moreover','bundan tashqari'],['furthermore','shuningdek'],['nevertheless','bundan qaramay'],['however','biroq'],['therefore','shuning uchun']], idStart: 102700 },
  { file: 'b1plusPart2.ts', name: 'collocationsMakeDoHaveTake', vocab: [['make a decision','qaror qilish'],['do homework','vazifani bajarish'],['have a break','tanaffus qilish'],['take a photo','suratga olish'],['make progress','rivojlanish'],['do business','biznes qilish'],['have fun','kular'],['take part','ishtirok etmoq']], idStart: 102710 },
  { file: 'b1plusPart2.ts', name: 'advancedPhrasalVerbs', vocab: [['give up','voz kechmoq'],['put up with','chidamoq'],['run into','uchrashmoq'],['look forward to','kutilmoq'],['come up with','topmoq'],['get away with','qochmoq'],['break down','buzilmoq'],['carry on','davom etmoq']], idStart: 102720 },
  { file: 'b1plusPart2.ts', name: 'idiomsCommon', vocab: [['break the ice','muzni sindirmoq'],['bite the bullet','qattiq qaror qilish'],['cost an arm and a leg','juda qimmat'],['hit the nail on the head','to\'g\'ri aytmoq'],['a piece of cake','oson ish']], idStart: 102730 },
  { file: 'b1plusPart2.ts', name: 'prepositionalPhrases', vocab: [['in spite of','...ga qaramay'],['according to','...ga ko\'ra'],['due to','tufayli'],['instead of','o\'rniga'],['as a result','natijada']], idStart: 102740 },
  { file: 'b1plusPart2.ts', name: 'wordFormation', vocab: [['-tion','fe\'l → olmosh'],['-ment','fe\'l → olmosh'],['-ness','sifat → olmosh'],['un-','inkor'],['re-','qayta'],['-ful','olmosh → sifat'],['-less','olmosh → sifat']], idStart: 102750 },
  { file: 'b1plusPart2.ts', name: 'reportingVerbs', vocab: [['suggest','taklif qilmoq'],['recommend','maslahat bermoq'],['insist','talab qilmoq'],['deny','inkor qilmoq'],['admit','tan olmoq'],['claim','da\'vo qilmoq']], idStart: 102760 },
  { file: 'b1plusPart1.ts', name: 'b1plusReview', vocab: [['although','...ga qaramay'],['must have','kishli ishonch'],['whom','object (rasmiy)'],['substitution','almashtirish']], idStart: 102770 },
  // B2
  { file: 'b2Part1.ts', name: 'subjunctiveB2', vocab: [['were','subjonktiv'],['had + V3','shart o\'tmish'],['be + V','buyruq'],['It\'s time','vaqt keldi'],['If I were you','men sizning o\'rningizda']], idStart: 103200 },
  { file: 'b2Part1.ts', name: 'unrealPastB2', vocab: [['wish + were','hozirgi istak'],['wish + had + V3','o\'tmish afsus'],['if only','kaflagan'],['would rather','afzal ko\'rmoq'],['would sooner','afzal ko\'rmoq']], idStart: 103210 },
  { file: 'b2Part1.ts', name: 'advancedConditionalsB2', vocab: [['provided that','shart bilan'],['in case','holda'],['unless','agar...masa'],['but for','bo\'lmasa'],['on condition that','shart bilan'],['lest','hech qachon']], idStart: 103220 },
  { file: 'b2Part1.ts', name: 'nominalizationB2', vocab: [['decide → decision','qaror'],['arrange → arrangement','tartib'],['agree → agreement','kelishuv'],['develop → development','rivojlanish'],['manage → management','boshqarish'],['investigate → investigation','tekshirish']], idStart: 103230 },
  { file: 'b2Part1.ts', name: 'hedgingB2', vocab: [['might','mumkin'],['could','mumkin'],['it seems','ko\'rinadi'],['apparently','aytishlaricha'],['presumably','taxminan'],['arguably','munozarali']], idStart: 103240 },
  { file: 'b2Part1.ts', name: 'complexPrepositionsB2', vocab: [['in terms of','jihatdan'],['with regard to','bo\'yicha'],['on behalf of','nomidan'],['due to','tufayli'],['as opposed to','teskarisiga'],['in light of','hisobga olib']], idStart: 103250 },
  { file: 'b2Part1.ts', name: 'cohesionB2', vocab: [['this','shu'],['that','u'],['such','shunday'],['the former','birinchisi'],['the latter','ikkinchisi']], idStart: 103260 },
  { file: 'b2Part1.ts', name: 'registerB2', vocab: [['formal','rasmiy'],['informal','norasmiy'],['neutral','neytral'],['colloquial','suhbatdoshlik'],['academic','ilmiy']], idStart: 103270 },
  { file: 'b2Part2.ts', name: 'complexSentencesB2', vocab: [['noun clause','olmosh gap'],['relative clause','nisbat gapi'],['adverb clause','holat gapi'],['conditional clause','shart gapi']], idStart: 103700 },
  { file: 'b2Part2.ts', name: 'advancedModalsB2', vocab: [['must have','kishli ishonch'],['can\'t have','mumkin emas'],['might have','mumkin edi'],['should have','kerak edi'],['could have','imkon bor edi']], idStart: 103710 },
  { file: 'b2Part2.ts', name: 'contrastiveStructuresB2', vocab: [['although','...ga qaramay'],['whereas','holbuki'],['while','holbuki'],['nevertheless','bundan qaramay'],['conversely','teskarisiga']], idStart: 103720 },
  { file: 'b2Part2.ts', name: 'academicCollocationsB2', vocab: [['conduct research','tadqiqot olib borish'],['draw conclusions','xulosa chiqarish'],['raise awareness','ongni oshirish'],['gather data','ma\'lumot to\'plash'],['analyze results','natijalarni tahlil qilish']], idStart: 103730 },
  { file: 'b2Part2.ts', name: 'criticalThinkingB2', vocab: [['claim','da\'vo'],['evidence','dalil'],['counter-argument','qarshi dalil'],['bias','tarafkashlik'],['logical','mantiqiy']], idStart: 103740 },
  { file: 'b2Part2.ts', name: 'b2Review', vocab: [['nominalization','olmoshlashtirish'],['hedging','ehtiyotkorlik'],['cohesion','uzviylik']], idStart: 103750 },
  { file: 'b2Part3.ts', name: 'argumentStructureB2', vocab: [['thesis','tezis'],['claim','da\'vo'],['evidence','dalil'],['rebuttal','rad etish'],['premise','asos']], idStart: 104200 },
  { file: 'b2Part3.ts', name: 'stanceMarkersB2', vocab: [['I believe','men ishonaman'],['it seems','ko\'rinadi'],['clearly','aniqki'],['arguably','munozarali'],['undoubtedly','shubhasiz']], idStart: 104210 },
  { file: 'b2Part3.ts', name: 'paraphrasingB2', vocab: [['in other words','boshqa so\'z bilan'],['that is to say','ya\'ni'],['to put it simply','oddiy qilib aytganda'],['to be precise','aniqroq'],['in essence','asosan']], idStart: 104220 },
  { file: 'b2Part3.ts', name: 'advancedVerbPatternsB2', vocab: [['deny + -ing','inkor qilmoq'],['refuse + to V','rad etmoq'],['admit + -ing','tan olmoq'],['suggest + V-ing','taklif qilmoq'],['apologize + for + V-ing','uzr so\'ramoq']], idStart: 104230 },
  { file: 'b2Part3.ts', name: 'b2ComprehensiveReview', vocab: [['subjunctive','subjonktiv'],['nominalization','olmoshlashtirish'],['hedging','ehtiyotkorlik']], idStart: 104240 },
  { file: 'b2Extra.ts', name: 'inversionB2', vocab: [['Never','hech qachon'],['Rarely','kamdan-kam'],['Not only','faqat emas'],['Hardly','deyarli'],['Scarcely','garchi'],['No sooner','zudlik bilan']], idStart: 104700 },
  { file: 'b2Extra.ts', name: 'cleftSentencesB2', vocab: [['It is...that','...shu...ki'],['It was...who','...shu...kim'],['What...is','...narsa...'],['All...is','...hamma narsa...']], idStart: 104710 },
  { file: 'b2Extra.ts', name: 'advancedPassiveB2', vocab: [['get + V3','passiv (oddiy)'],['have + V + V3','boshqa qildirdim'],['be supposed to','kerak edi'],['get caught up','jalb qilindi']], idStart: 104720 },
  { file: 'b2Extra.ts', name: 'academicVocabularyB2', vocab: [['furthermore','bundan tashqari'],['consequently','natijada'],['subsequently','keyin'],['predominantly','asosan'],['notwithstanding','barcha shunga qaramay']], idStart: 104730 },
];

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
  let maxId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) : 300000;
  
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
    
    const exArrayStart = content.indexOf('exercises: [', lessonIdx);
    if (exArrayStart === -1) continue;
    
    let depth = 0, exEnd = -1;
    const startIdx = exArrayStart + 'exercises: ['.length;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') { if (depth === 0) { exEnd = i; break; } depth--; }
    }
    if (exEnd === -1) continue;
    
    const newExercises = [];
    
    // 4 passage exercises
    for (let p = 0; p < 4; p++) {
      const v1 = lesson.vocab[p * 2] || lesson.vocab[0];
      const v2 = lesson.vocab[p * 2 + 1] || lesson.vocab[1];
      newExercises.push(
`    { id: ${++maxId}, type: 'passage', instruction: "Gaplarni to'ldiring:", passage: "Quyidagi matnni to'ldiring. ${v1[0]} (${v1[1]}) va ${v2[0]} (${v2[1]}) so'zlarini ishlating.", blanks: ["${v1[0]}", "${v2[0]}"], acceptedAnswers: [["${v1[0]}"], ["${v2[0]}"]], explanation: "${v1[0]} = ${v1[1]}, ${v2[0]} = ${v2[1]}" }`
      );
    }
    
    // 4 connection exercises
    for (let c = 0; c < 4; c++) {
      const v = lesson.vocab[c * 2 + 1] || lesson.vocab[c] || lesson.vocab[0];
      const prompts = [
        `${v[0]} (${v[1]}) so'zini ishlatib, 3-4 gap yozing.`,
        `"${v[0]}" mavzusida o'z fikringizni 3-4 gapda yozing.`,
        `Biror bir gapda "${v[0]}" (${v[1]}) so'zini ishlatib yozing.`,
        `${v[0]} haqida 2-3 gap yozing va ma'nosini tushuntiring.`
      ];
      newExercises.push(
`    { id: ${++maxId}, type: 'connection', instruction: "Yozing", prompt: "${prompts[c]}", hints: ["${v[0]} so'zini ishlating", "Kamida 3 gap yozing"], exampleAnswer: "Example: ${v[0]} is a useful word. It means ${v[1]}." }`
      );
    }
    
    // 2 vocab-match
    for (let v = 0; v < 2 && lesson.vocab.length >= 4; v++) {
      const v1 = lesson.vocab[v * 4] || lesson.vocab[0];
      const v2 = lesson.vocab[v * 4 + 1] || lesson.vocab[1];
      const v3 = lesson.vocab[v * 4 + 2] || lesson.vocab[2];
      const v4 = lesson.vocab[v * 4 + 3] || lesson.vocab[3];
      newExercises.push(
`    { id: ${++maxId}, type: 'vocab-match', instruction: "So'zning to'g'ri ma'nosini tanlang", word: "${v1[0]}", options: ["${v1[1]}", "${v2[1]}", "${v3[1]}", "${v4[1]}"], correct: "${v1[1]}", explanation: "${v1[0]} = ${v1[1]}" }`
      );
    }
    
    totalAdded += newExercises.length;
    
    const exercisesStr = '\n' + newExercises.join(',\n') + ',';
    content = content.substring(0, exEnd) + exercisesStr + content.substring(exEnd);
  }
  
  fs.writeFileSync(filePath, content);
}

console.log(`Total productive exercises added: ${totalAdded}`);
