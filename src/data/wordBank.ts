// Lug'at Xazinasi — multi-phase English headword catalog
// Translations/phonetics/examples are AI-filled on demand and cached in IndexedDB

export type WordGroup = 'a2-b1' | 'b1-b2' | 'phrasal' | 'idiom' | 'academic'
export type WordLevel = 'A2' | 'B1' | 'B2'

export interface HeadWord {
  word:  string
  level: WordLevel
  phase: 1 | 2 | 3
  group: WordGroup
}

function mk(words: string[], level: WordLevel, phase: 1 | 2 | 3, group: WordGroup): HeadWord[] {
  return words.map((word) => ({ word, level, phase, group }))
}

// ── Phase 1 (Weeks 1–4): A2-B1 high-frequency everyday vocabulary ─────────────

const PHASE1: string[] = [
  // Verbs
  'accept','accomplish','achieve','act','adapt','admire','adopt','advertise',
  'advise','affect','agree','allow','announce','apologize','apply','arrange',
  'attend','avoid','behave','believe','blame','cancel','check','collect',
  'communicate','compare','complain','complete','connect','consider','contain',
  'convince','deal','decide','define','delay','describe','discover','discuss',
  'divide','educate','enable','enjoy','examine','expect','explain','express',
  'fail','fill','follow','forget','gather','grow','guess','happen','include',
  'inform','involve','join','judge','keep','laugh','listen','manage','match',
  'mention','miss','notice','offer','organize','overcome','perform','plan',
  'practice','prepare','prevent','provide','realize','receive','recognize',
  'recommend','refer','remain','remove','respond','result','save','seem',
  'share','solve','spend','suggest','support','teach','tend','trust','wonder',
  // Adjectives
  'able','absent','active','actual','afraid','angry','appropriate','aware',
  'basic','brave','careful','certain','clear','common','confident','convenient',
  'correct','curious','different','difficult','effective','emotional','essential',
  'exact','familiar','flexible','fortunate','friendly','general','grateful',
  'honest','important','interesting','kind','likely','logical','modern',
  'necessary','negative','patient','polite','popular','positive','possible',
  'powerful','precise','prepared','proper','proud','responsible','safe',
  'serious','similar','successful','suitable','tired','useful','willing','worried',
  // Nouns
  'ability','absence','action','adult','advantage','advice','age','agreement',
  'aim','amount','attitude','background','balance','behavior','benefit',
  'challenge','character','choice','comfort','comment','decision','direction',
  'doubt','effort','emotion','environment','event','experience','feature',
  'goal','idea','impact','knowledge','language','limit','method','mistake',
  'nature','opinion','opportunity','purpose','reason','research','result',
  'risk','role','situation','skill','strength','success','support','technology',
  'type','value','variety','view','worth',
]

// ── Phase 2 (Weeks 5–8): B1-B2 sophisticated vocabulary ──────────────────────

const PHASE2_VOCAB: string[] = [
  // Verbs
  'advocate','alter','anticipate','articulate','assert','assess','attain',
  'collaborate','compensate','comply','conceal','conceive','confine',
  'consolidate','convey','cope','dedicate','deliberate','demonstrate',
  'diminish','distinguish','elaborate','eliminate','emerge','emphasize',
  'encounter','establish','evaluate','evolve','exceed','exploit','facilitate',
  'fluctuate','generate','hesitate','highlight','impose','inspect','integrate',
  'interpret','justify','modify','motivate','negotiate','perceive','persist',
  'promote','reinforce','restrict','reveal','sustain','transform','undergo',
  'utilize','validate','verify',
  // Adjectives
  'abstract','adequate','ambitious','ambiguous','appealing','approximate',
  'coherent','competent','comprehensive','considerable','controversial',
  'conventional','critical','deliberate','enormous','evident','explicit',
  'fundamental','harsh','inherent','innovative','logical','neutral','obvious',
  'rational','remarkable','stable','substantial','sufficient','thorough',
  'unique','vigorous','vital',
  // Nouns
  'consequence','correlation','initiative','negotiation','realization',
  'strategy','tendency','transition',
]

// ── Phase 2: Phrasal verbs ────────────────────────────────────────────────────

const PHASE2_PHRASAL: string[] = [
  'back down','back up','break down','break in','break out','break through',
  'break up','bring about','bring up','call off','call on','calm down',
  'carry on','carry out','catch up','come across','come up with','cope with',
  'cut back','cut down on','deal with','drop off','end up','fall apart',
  'fall behind','figure out','get across','get along with','get away with',
  'get over','get rid of','give in','give up','go ahead','go through',
  'grow up','hand in','hold on','keep up with','let down','look after',
  'look forward to','look into','look up','make up','make up for',
  'move on','pass out','pay off','pick up','point out','put off',
  'put up with','run into','run out of','set up','show off','sign up',
  'slow down','sort out','stand out','stick to','take off','take over',
  'take part in','take up','think over','throw away','turn down',
  'turn out','work out',
]

// ── Phase 3 (Weeks 9–12): Academic Word List (AWL) sublists 1–5 ──────────────

const PHASE3_ACADEMIC: string[] = [
  // AWL Sublist 1
  'analyse','approach','area','authority','available','chapter',
  'commission','complex','concept','conduct','consistent','constitute',
  'context','contract','contribute','create','data','define','derive',
  'distribute','economy','environment','estimate','export','factor',
  'finance','formula','function','identify','income','indicate','individual',
  'interpret','involve','issue','labour','legal','legislate','major',
  'occur','percent','period','policy','principle','proceed','process',
  'require','respond','role','section','sector','significant','source',
  'specific','structure','theory','vary',
  // AWL Sublist 2
  'achieve','acquire','administer','aspect','assist','category','commission',
  'community','compute','conclude','consequent','consume','credit','culture',
  'design','distinct','element','evaluate','final','focus','impact',
  'institute','invest','item','journal','maintain','normal','obtain',
  'participate','positive','potential','previous','primary','purchase',
  'range','region','regulate','relevant','resident','resource','restrict',
  'secure','seek','select','site','survey','text','tradition','transfer',
  // AWL Sublist 3
  'alternative','circumstance','comment','compensate','component','consent',
  'considerable','constant','constrain','contribute','convention','coordinate',
  'demonstrate','document','dominate','emphasis','ensure','exclude',
  'framework','fund','illustrate','immigrate','imply','initial','instance',
  'interact','justify','layer','link','locate','maximize','minor',
  'negate','outcome','partner','philosophy','physical','proportion',
  'publish','react','register','rely','remove','scheme','sequence',
  'shift','specify','sufficient','task','technical','technique',
  'technology','valid','volume',
]

// ── Phase 3: Common B2-level idioms ──────────────────────────────────────────

const PHASE3_IDIOMS: string[] = [
  'a blessing in disguise',
  'a piece of cake',
  'all in the same boat',
  'at the drop of a hat',
  'back to square one',
  'bite the bullet',
  'break the ice',
  'burn your bridges',
  'by the skin of your teeth',
  'call it a day',
  'cut corners',
  'every cloud has a silver lining',
  'face the music',
  'give someone the benefit of the doubt',
  'go back to the drawing board',
  'hang in there',
  'hit the nail on the head',
  'hit the sack',
  'in the heat of the moment',
  'jump on the bandwagon',
  'keep someone in the loop',
  'kill two birds with one stone',
  'leave no stone unturned',
  'let the cat out of the bag',
  'miss the boat',
  'on the fence',
  'once in a blue moon',
  'over the moon',
  'pass the buck',
  'pull someone\'s leg',
  'see eye to eye',
  'spill the beans',
  'take something with a grain of salt',
  'the ball is in your court',
  'the best of both worlds',
  'the tip of the iceberg',
  'throw in the towel',
  'under the weather',
  'up in the air',
  'you can\'t judge a book by its cover',
]

// ── Combined catalog ──────────────────────────────────────────────────────────

export const WORD_BANK: HeadWord[] = [
  ...mk(PHASE1,           'B1', 1, 'a2-b1'),
  ...mk(PHASE2_VOCAB,     'B2', 2, 'b1-b2'),
  ...mk(PHASE2_PHRASAL,   'B1', 2, 'phrasal'),
  ...mk(PHASE3_ACADEMIC,  'B2', 3, 'academic'),
  ...mk(PHASE3_IDIOMS,    'B2', 3, 'idiom'),
]

export const WORD_BANK_TOTAL = WORD_BANK.length

export const GROUP_LABEL: Record<WordGroup, string> = {
  'a2-b1':    'A2-B1',
  'b1-b2':    'B1-B2',
  'phrasal':  'Phrasal Verbs',
  'idiom':    'Idiomlar',
  'academic': 'Academic',
}
