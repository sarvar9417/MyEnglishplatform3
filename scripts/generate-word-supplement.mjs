// scripts/generate-word-supplement.mjs
// Generates SQL supplement for ALL missing words from wordBank.ts + vocabularyWords.ts
// + common essential words, with proper Uzbek translations.
// Existing translations are reused where available from the seed data.

import { readFileSync, writeFileSync } from 'fs'

// ── Step 1: Build translation lookup from existing seed ────────────────────────

const TUPLE_RE = /\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\],?\s*/g
function unescapeJs(s) { return s.replace(/\\(['"\\])/g, '$1') }
function escapeSql(s) { return s.replace(/'/g, "''") }

const existingTranslations = {} // english -> { uzbek, example }

for (const file of ['scripts/words/a1.ts','scripts/words/a2.ts','scripts/words/b1.ts','scripts/words/b2.ts']) {
  const content = readFileSync(file, 'utf-8')
  let m
  while ((m = TUPLE_RE.exec(content)) !== null) {
    const eng = unescapeJs(m[1]).trim().toLowerCase()
    const uzb = unescapeJs(m[2]).trim()
    const ex  = unescapeJs(m[4]).trim()
    if (!existingTranslations[eng]) {
      existingTranslations[eng] = { uzbek: uzb, example: ex }
    }
  }
}

console.log(`Translation lookup: ${Object.keys(existingTranslations).length} ta so'z`)

// ── Step 2: Define all missing words with translations ────────────────────────
// Format: [english, uzbek, example, level]

const FIXED_TRANSLATIONS = {
  // A1-A2 essential missing words
  'act': ['harakat qilmoq', 'We must act now.', 'A2'],
  'agree': ['rozi bo\'lmoq', 'I agree with you.', 'A1'],
  'believe': ['ishonmoq', 'I believe you.', 'A1'],
  'follow': ['ergashmoq', 'Follow me please.', 'A1'],
  'keep': ['saqlamoq', 'Keep the change.', 'A1'],
  'save': ['tejamoq', 'Save your money.', 'A1'],
  'collect': ['yig\'moq', 'I collect stamps.', 'A2'],
  'guess': ['taxmin qilmoq', 'Guess the answer.', 'A2'],
  'happen': ['sodir bo\'lmoq', 'What happened?', 'A2'],
  'grow': ['o\'smoq', 'Plants grow fast.', 'A2'],
  'check': ['tekshirmoq', 'Check your email.', 'A2'],
  'apply': ['murojaat qilmoq', 'Apply for the job.', 'B1'],
  'cancel': ['bekor qilmoq', 'Cancel the order.', 'B1'],
  'fill': ['to\'ldirmoq', 'Fill the form.', 'A2'],
  'miss': ['sog\'inmoq', 'I miss my family.', 'A2'],
  'organize': ['tashkil qilmoq', 'Organize the event.', 'B1'],
  'recognize': ['tanimoq', 'I recognize you.', 'B1'],
  'seem': ['tuyulmoq', 'It seems good.', 'A2'],
  'wonder': ['qiziqmoq', 'I wonder why.', 'B1'],
  'accomplish': ['amalga oshirmoq', 'We accomplished the goal.', 'B1'],
  'advertise': ['reklama qilmoq', 'They advertise online.', 'B1'],
  'advise': ['maslahat bermoq', 'I advise you to wait.', 'B1'],
  'apologize': ['kechirim so\'ramoq', 'I apologize for being late.', 'B1'],
  'attend': ['qatnashmoq', 'Attend the meeting.', 'A2'],
  'communicate': ['muloqot qilmoq', 'Communicate clearly.', 'B1'],
  'compare': ['solishtirmoq', 'Compare the prices.', 'A2'],
  'complain': ['shikoyat qilmoq', 'I complained about the service.', 'B1'],
  'connect': ['ulanmoq', 'Connect to the internet.', 'A2'],
  'consider': ['o\'ylab ko\'rmoq', 'Consider my offer.', 'B1'],
  'contain': ['o\'z ichiga olmoq', 'The box contains books.', 'B1'],
  'convince': ['ishontirmoq', 'I convinced him.', 'B1'],
  'decide': ['qaror qilmoq', 'Decide quickly.', 'A2'],
  'define': ['ta\'riflamoq', 'Define the word.', 'B1'],
  'delay': ['kechiktirmoq', 'Do not delay.', 'B1'],
  'describe': ['tasvirlamoq', 'Describe the picture.', 'A2'],
  'discuss': ['muhokama qilmoq', 'Discuss the topic.', 'B1'],
  'divide': ['bo\'lmoq', 'Divide the cake.', 'B1'],
  'educate': ['ta\'lim bermoq', 'Educate the children.', 'B1'],
  'enable': ['imkon bermoq', 'This enables us to work.', 'B1'],
  'examine': ['tekshirmoq', 'Examine the results.', 'B1'],
  'expect': ['kutmoq', 'I expect good news.', 'A2'],
  'explain': ['tushuntirmoq', 'Explain the lesson.', 'A2'],
  'express': ['ifodalamoq', 'Express your opinion.', 'B1'],
  'fail': ['muvaffaqiyatsizlik', 'Do not fail.', 'A2'],
  'forget': ['unutmoq', 'Do not forget.', 'A1'],
  'gather': ['yig\'ilmoq', 'We gathered together.', 'B1'],
  'include': ['o\'z ichiga olmoq', 'Include everyone.', 'A2'],
  'inform': ['xabardor qilmoq', 'Inform the team.', 'B1'],
  'involve': ['jalb qilmoq', 'Involve the students.', 'B1'],
  'join': ['qo\'shilmoq', 'Join us.', 'A2'],
  'judge': ['hukm qilmoq', 'Do not judge.', 'B1'],
  'laugh': ['kulmoq', 'Laugh out loud.', 'A2'],
  'manage': ['boshqarmoq', 'Manage the project.', 'B1'],
  'match': ['mos kelmoq', 'Match the words.', 'A2'],
  'mention': ['eslatmoq', 'Mention your name.', 'B1'],
  'notice': ['payqamoq', 'I noticed the change.', 'A2'],
  'offer': ['taklif qilmoq', 'Offer your help.', 'A2'],
  'overcome': ['yengmoq', 'Overcome the challenge.', 'B1'],
  'perform': ['ijro etmoq', 'Perform the task.', 'B1'],
  'plan': ['rejalashtirmoq', 'Plan your day.', 'A2'],
  'practice': ['mashq qilmoq', 'Practice every day.', 'A2'],
  'prepare': ['tayyorlamoq', 'Prepare the meal.', 'A2'],
  'prevent': ['oldini olmoq', 'Prevent accidents.', 'B1'],
  'provide': ['ta\'minlamoq', 'Provide information.', 'B1'],
  'receive': ['qabul qilmoq', 'Receive the package.', 'A2'],
  'recommend': ['tavsiya qilmoq', 'I recommend this book.', 'B1'],
  'refer': ['murojaat qilmoq', 'Refer to the manual.', 'B1'],
  'remain': ['qolmoq', 'Remain seated.', 'B1'],
  'remove': ['olib tashlamoq', 'Remove the old one.', 'B1'],
  'respond': ['javob bermoq', 'Respond to the email.', 'B1'],
  'result': ['natija', 'The result is good.', 'A2'],
  'share': ['baham ko\'rmoq', 'Share your ideas.', 'A2'],
  'solve': ['yechmoq', 'Solve the problem.', 'B1'],
  'spend': ['sarflamoq', 'Spend your time wisely.', 'A2'],
  'suggest': ['taklif qilmoq', 'I suggest waiting.', 'B1'],
  'support': ['qo\'llab-quvvatlamoq', 'Support your team.', 'B1'],
  'teach': ['o\'rgatmoq', 'Teach the students.', 'A2'],
  'tend': ['moyil bo\'lmoq', 'Tend to agree.', 'B1'],
  'trust': ['ishonmoq', 'Trust your instinct.', 'A2'],
  // B1-B2 missing words
  'alter': ['o\'zgartirmoq', 'Alter the design.', 'B2'],
  'convey': ['yetkazmoq', 'Convey the message.', 'B2'],
  'emphasize': ['ta\'kidlamoq', 'Emphasize the point.', 'B2'],
  'encounter': ['uchratmoq', 'Encounter a problem.', 'B2'],
  'establish': ['tashkil etmoq', 'Establish a company.', 'B2'],
  'evolve': ['rivojlanmoq', 'Evolve over time.', 'B2'],
  'generate': ['yaratmoq', 'Generate ideas.', 'B2'],
  'hesitate': ['ikkilanmoq', 'Do not hesitate.', 'B2'],
  'highlight': ['ta\'kidlamoq', 'Highlight the key points.', 'B2'],
  'inspect': ['tekshirmoq', 'Inspect the product.', 'B2'],
  'motivate': ['rag\'batlantirmoq', 'Motivate your team.', 'B2'],
  'negotiate': ['muzokara qilmoq', 'Negotiate the terms.', 'B2'],
  'promote': ['targ\'ib qilmoq', 'Promote the product.', 'B2'],
  'reveal': ['oshkor qilmoq', 'Reveal the truth.', 'B2'],
  'transform': ['o\'zgartirmoq', 'Transform the system.', 'B2'],
  'undergo': ['boshdan kechirmoq', 'Undergo training.', 'B2'],
  'utilize': ['foydalanmoq', 'Utilize the resources.', 'B2'],
  'adequate': ['yetarli', 'Adequate preparation.', 'B2'],
  'ambitious': ['shuhratparast', 'An ambitious plan.', 'B2'],
  'appealing': ['jozibali', 'An appealing offer.', 'B2'],
  'critical': ['tanqidiy', 'Critical thinking.', 'B2'],
  'harsh': ['qattiq', 'Harsh conditions.', 'B2'],
  'neutral': ['neytral', 'Stay neutral.', 'B2'],
  'obvious': ['ravshan', 'Obvious answer.', 'B2'],
  'stable': ['barqaror', 'Stable economy.', 'B2'],
  'sufficient': ['yetarli', 'Sufficient funds.', 'B2'],
  'unique': ['noyob', 'Unique opportunity.', 'B2'],
  'vital': ['hayotiy', 'Vital importance.', 'B2'],
  'consequence': ['natija', 'Face the consequences.', 'B2'],
  'initiative': ['tashabbus', 'Take initiative.', 'B2'],
  'negotiation': ['muzokara', 'Business negotiation.', 'B2'],
  'realization': ['anglash', 'Gradual realization.', 'B2'],
  'strategy': ['strategiya', 'Develop a strategy.', 'B2'],
  'tendency': ['moyillik', 'A growing tendency.', 'B2'],
  // Academic AWL missing words
  'approach': ['yondashuv', 'A new approach.', 'B2'],
  'area': ['hudud', 'The study area.', 'B2'],
  'authority': ['hokimiyat', 'Local authority.', 'B2'],
  'available': ['mavjud', 'Available resources.', 'B2'],
  'chapter': ['bob', 'Chapter one.', 'B2'],
  'complex': ['murakkab', 'Complex problem.', 'B2'],
  'concept': ['tushuncha', 'Key concept.', 'B2'],
  'conduct': ['o\'tkazmoq', 'Conduct research.', 'B2'],
  'context': ['kontekst', 'In this context.', 'B2'],
  'contract': ['shartnoma', 'Sign a contract.', 'B2'],
  'contribute': ['hissa qo\'shmoq', 'Contribute to the project.', 'B2'],
  'create': ['yaratmoq', 'Create something new.', 'B2'],
  'data': ['ma\'lumot', 'Analyze the data.', 'B2'],
  'distribute': ['tarqatmoq', 'Distribute the materials.', 'B2'],
  'economy': ['iqtisodiyot', 'The economy is growing.', 'B2'],
  'estimate': ['baholamoq', 'Estimate the cost.', 'B2'],
  'export': ['eksport qilmoq', 'Export goods.', 'B2'],
  'factor': ['omil', 'An important factor.', 'B2'],
  'finance': ['moliya', 'Finance department.', 'B2'],
  'formula': ['formula', 'Mathematical formula.', 'B2'],
  'function': ['funksiya', 'Basic function.', 'B2'],
  'identify': ['aniqlamoq', 'Identify the problem.', 'B2'],
  'income': ['daromad', 'Monthly income.', 'B2'],
  'indicate': ['ko\'rsatmoq', 'Results indicate progress.', 'B2'],
  'individual': ['shaxsiy', 'Each individual.', 'B2'],
  'issue': ['masala', 'Important issue.', 'B2'],
  'labour': ['mehnat', 'Hard labour.', 'B2'],
  'legal': ['qonuniy', 'Legal advice.', 'B2'],
  'major': ['asosiy', 'Major change.', 'B2'],
  'occur': ['yuz bermoq', 'When did it occur?', 'B2'],
  'percent': ['foiz', 'Fifty percent.', 'B2'],
  'period': ['davr', 'A long period.', 'B2'],
  'policy': ['siyosat', 'Company policy.', 'B2'],
  'principle': ['tamoyil', 'Guiding principles.', 'B2'],
  'proceed': ['davom etmoq', 'Proceed with caution.', 'B2'],
  'process': ['jarayon', 'The learning process.', 'B2'],
  'require': ['talab qilmoq', 'This requires effort.', 'B2'],
  'role': ['rol', 'Important role.', 'B2'],
  'section': ['bo\'lim', 'Read the next section.', 'B2'],
  'sector': ['sektor', 'Private sector.', 'B2'],
  'significant': ['muhim', 'Significant progress.', 'B2'],
  'source': ['manba', 'Reliable source.', 'B2'],
  'specific': ['aniq', 'Specific details.', 'B2'],
  'structure': ['tuzilma', 'Organizational structure.', 'B2'],
  'theory': ['nazariya', 'Scientific theory.', 'B2'],
  'vary': ['farq qilmoq', 'Prices vary.', 'B2'],
  'achieve': ['erishmoq', 'Achieve success.', 'B2'],
  'administer': ['boshqarmoq', 'Administer the test.', 'B2'],
  'aspect': ['jihat', 'Consider every aspect.', 'B2'],
  'assist': ['yordam bermoq', 'Assist the customer.', 'B2'],
  'category': ['kategoriya', 'Different categories.', 'B2'],
  'community': ['jamiyat', 'Local community.', 'B2'],
  'compute': ['hisoblamoq', 'Compute the total.', 'B2'],
  'conclude': ['xulosa qilmoq', 'Conclude the meeting.', 'B2'],
  'consume': ['iste\'mol qilmoq', 'Consume less energy.', 'B2'],
  'credit': ['kredit', 'Buy on credit.', 'B2'],
  'culture': ['madaniyat', 'Different cultures.', 'B2'],
  'design': ['loyihalash', 'Design a website.', 'B2'],
  'element': ['element', 'Key elements.', 'B2'],
  'final': ['yakuniy', 'Final decision.', 'B2'],
  'focus': ['diqqat', 'Focus on the goal.', 'B2'],
  'impact': ['ta\'sir', 'Environmental impact.', 'B2'],
  'institute': ['institut', 'Research institute.', 'B2'],
  'invest': ['investitsiya', 'Invest in education.', 'B2'],
  'item': ['element', 'List of items.', 'B2'],
  'journal': ['jurnal', 'Academic journal.', 'B2'],
  'maintain': ['saqlamoq', 'Maintain the system.', 'B2'],
  'normal': ['normal', 'Back to normal.', 'B2'],
  'obtain': ['qo\'lga kiritmoq', 'Obtain permission.', 'B2'],
  'participate': ['ishtirok etmoq', 'Participate in the event.', 'B2'],
  'positive': ['ijobiy', 'Positive attitude.', 'B2'],
  'potential': ['potensial', 'Unlock your potential.', 'B2'],
  'previous': ['oldingi', 'Previous experience.', 'B2'],
  'primary': ['asosiy', 'Primary goal.', 'B2'],
  'purchase': ['sotib olmoq', 'Purchase online.', 'B2'],
  'range': ['qator', 'A wide range.', 'B2'],
  'region': ['mintaqa', 'The region is growing.', 'B2'],
  'regulate': ['tartibga solmoq', 'Regulate the industry.', 'B2'],
  'relevant': ['tegishli', 'Relevant information.', 'B2'],
  'resident': ['rezident', 'Local resident.', 'B2'],
  'resource': ['resurs', 'Natural resources.', 'B2'],
  'secure': ['xavfsiz', 'Secure the data.', 'B2'],
  'seek': ['qidirmoq', 'Seek advice.', 'B2'],
  'select': ['tanlamoq', 'Select your option.', 'B2'],
  'site': ['sayt', 'Construction site.', 'B2'],
  'survey': ['so\'rov', 'Conduct a survey.', 'B2'],
  'text': ['matn', 'Read the text.', 'B2'],
  'tradition': ['an\'ana', 'Cultural tradition.', 'B2'],
  'transfer': ['o\'tkazmoq', 'Transfer the money.', 'B2'],
  'alternative': ['muqobil', 'Alternative solution.', 'B2'],
  'circumstance': ['holat', 'Under the circumstances.', 'B2'],
  'comment': ['izoh', 'Leave a comment.', 'B2'],
  'consent': ['rozilik', 'Give consent.', 'B2'],
  'constant': ['doimiy', 'Constant improvement.', 'B2'],
  'convention': ['anjuman', 'Annual convention.', 'B2'],
  'coordinate': ['muvofiqlashtirmoq', 'Coordinate the team.', 'B2'],
  'document': ['hujjat', 'Important document.', 'B2'],
  'dominate': ['hukmronlik qilmoq', 'Dominate the market.', 'B2'],
  'emphasis': ['urg\'u', 'Place emphasis on.', 'B2'],
  'ensure': ['ta\'minlamoq', 'Ensure safety.', 'B2'],
  'fund': ['fond', 'Raise funds.', 'B2'],
  'immigrate': ['ko\'chib kelmoq', 'Immigrate to a new country.', 'B2'],
  'imply': ['anglatmoq', 'What does this imply?', 'B2'],
  'initial': ['dastlabki', 'Initial stage.', 'B2'],
  'instance': ['masalan', 'For instance.', 'B2'],
  'layer': ['qatlam', 'Multiple layers.', 'B2'],
  'link': ['bog\'lamoq', 'Link the documents.', 'B2'],
  'locate': ['joylashmoq', 'Locate the address.', 'B2'],
  'maximize': ['maksimallashtirmoq', 'Maximize efficiency.', 'B2'],
  'minor': ['kichik', 'Minor issue.', 'B2'],
  'outcome': ['natija', 'Positive outcome.', 'B2'],
  'partner': ['hamkor', 'Business partner.', 'B2'],
  'philosophy': ['falsafa', 'Personal philosophy.', 'B2'],
  'physical': ['jismoniy', 'Physical activity.', 'B2'],
  'publish': ['nashr qilmoq', 'Publish an article.', 'B2'],
  'react': ['munosabat bildirmoq', 'React quickly.', 'B2'],
  'register': ['ro\'yxatdan o\'tmoq', 'Register for the course.', 'B2'],
  'rely': ['tayanmoq', 'Rely on the data.', 'B2'],
  'remove': ['olib tashlamoq', 'Remove the error.', 'B2'],
  'scheme': ['sxema', 'Color scheme.', 'B2'],
  'sequence': ['ketma-ketlik', 'In sequence.', 'B2'],
  'shift': ['siljimoq', 'Shift the focus.', 'B2'],
  'specify': ['aniqlamoq', 'Specify the details.', 'B2'],
  'task': ['vazifa', 'Complete the task.', 'B2'],
  'technical': ['texnik', 'Technical support.', 'B2'],
  'technique': ['texnika', 'Learn the technique.', 'B2'],
  'valid': ['haqiqiy', 'Valid passport.', 'B2'],
  'volume': ['hajm', 'Large volume.', 'B2'],
  // vocabularyWords.ts missing words
  'abundant': ['mo\'l', 'Abundant resources.', 'B1'],
  'acquire': ['egallamoq', 'Acquire knowledge.', 'B1'],
  'analyze': ['tahlil qilmoq', 'Analyze the data.', 'B2'],
  'demonstrate': ['namoyish etmoq', 'Demonstrate the product.', 'B1'],
  'appointment': ['uchrashuv', 'Make an appointment.', 'B1'],
  'frequently': ['tez-tez', 'I frequently travel.', 'B1'],
  'grateful': ['minnatdor', 'I am grateful.', 'B1'],
  'accommodation': ['turar joy', 'Find accommodation.', 'B1'],
  'afford': ['qurbi yetmoq', 'I can afford it.', 'B1'],
  'destination': ['manzil', 'Final destination.', 'B1'],
  'reserve': ['band qilmoq', 'Reserve a table.', 'B1'],
  'journey': ['sayohat', 'Long journey.', 'B1'],
  'departure': ['jo\'nash', 'Departure time.', 'B1'],
  'career': ['kariyera', 'Career opportunity.', 'B1'],
  'deadline': ['muddat', 'Meet the deadline.', 'B1'],
  'disappoint': ['xafa qilmoq', 'Do not disappoint.', 'B1'],
  'fascinate': ['hayratga solmoq', 'It fascinates me.', 'B2'],
  'impress': ['taassurot qoldirmoq', 'Impress the audience.', 'B1'],
  'nervous': ['asabiy', 'I feel nervous.', 'A2'],
  'patient': ['sabrli', 'Be patient.', 'A2'],
  'relief': ['yengillik', 'What a relief!', 'B1'],
  // Phrasal verbs
  'back down': ['chekinmoq', 'He backed down.', 'B1'],
  'break in': ['buzib kirmoq', 'Someone broke in.', 'B1'],
  'break out': ['boshlanmoq', 'Fire broke out.', 'B1'],
  'break through': ['o\'tib olmoq', 'Break through barriers.', 'B1'],
  'call on': ['chaqirmoq', 'Call on a friend.', 'B1'],
  'calm down': ['tinchlanmoq', 'Calm down please.', 'B1'],
  'cope with': ['bardosh bermoq', 'Cope with stress.', 'B1'],
  'cut back': ['qisqartirmoq', 'Cut back on sugar.', 'B1'],
  'cut down on': ['kamaytirmoq', 'Cut down on expenses.', 'B1'],
  'fall apart': ['parchalanmoq', 'The plan fell apart.', 'B1'],
  'get across': ['tushuntirmoq', 'Get the point across.', 'B1'],
  'get away with': ['qutulmoq', 'He got away with it.', 'B1'],
  'keep up with': ['yetib olmoq', 'Keep up with the news.', 'B1'],
  'make up for': ['o\'rnini qoplamoq', 'Make up for lost time.', 'B1'],
  'move on': ['davom etmoq', 'Move on to the next.', 'B1'],
  'pass out': ['hushidan ketmoq', 'He passed out.', 'B1'],
  'pay off': ['o\'zini oqlamoq', 'Hard work pays off.', 'B1'],
  'run out of': ['tugamoq', 'Run out of time.', 'B1'],
  'show off': ['ko\'z-ko\'z qilmoq', 'Stop showing off.', 'B1'],
  'sign up': ['ro\'yxatdan o\'tmoq', 'Sign up for the course.', 'B1'],
  'slow down': ['sekinlashmoq', 'Slow down.', 'B1'],
  'stand out': ['ajralib turmoq', 'Stand out from the crowd.', 'B1'],
  'stick to': ['rioya qilmoq', 'Stick to the plan.', 'B1'],
  'take part in': ['ishtirok etmoq', 'Take part in the competition.', 'B1'],
  'think over': ['o\'ylab ko\'rmoq', 'Think it over.', 'B1'],
  'throw away': ['tashlab yubormoq', 'Throw away the trash.', 'B1'],
  // Adjectives
  'able': ['qodir', 'I am able to help.', 'A2'],
  'absent': ['yo\'q', 'He was absent.', 'A2'],
  'afraid': ['qo\'rqmoq', 'Do not be afraid.', 'A2'],
  'angry': ['jahl', 'I am angry.', 'A2'],
  'brave': ['jasur', 'A brave person.', 'B1'],
  'careful': ['ehtiyotkor', 'Be careful.', 'A2'],
  'clear': ['aniq', 'Clear instructions.', 'A2'],
  'correct': ['to\'g\'ri', 'Correct answer.', 'A2'],
  'curious': ['qiziquvchan', 'Curious mind.', 'B1'],
  'different': ['har xil', 'Different opinions.', 'A1'],
  'difficult': ['qiyin', 'Difficult task.', 'A1'],
  'effective': ['samarali', 'Effective method.', 'B1'],
  'emotional': ['hissiy', 'Emotional response.', 'B1'],
  'fortunate': ['baxtli', 'I feel fortunate.', 'B1'],
  'friendly': ['do\'stona', 'Friendly people.', 'A2'],
  'grateful': ['minnatdor', 'I am grateful.', 'B1'],
  'honest': ['halol', 'Be honest.', 'A2'],
  'important': ['muhim', 'Important meeting.', 'A1'],
  'interesting': ['qiziqarli', 'Interesting book.', 'A1'],
  'kind': ['mehribon', 'Kind person.', 'A2'],
  'likely': ['ehtimol', 'Likely to succeed.', 'B1'],
  'logical': ['mantiqiy', 'Logical reasoning.', 'B1'],
  'modern': ['zamonaviy', 'Modern technology.', 'A2'],
  'necessary': ['zarur', 'Necessary steps.', 'A2'],
  'patient': ['sabrli', 'Be patient.', 'A2'],
  'polite': ['xushmuomala', 'Polite behaviour.', 'A2'],
  'possible': ['mumkin', 'Is it possible?', 'A1'],
  'powerful': ['kuchli', 'Powerful tool.', 'B1'],
  'precise': ['aniq', 'Precise measurement.', 'B1'],
  'prepared': ['tayyor', 'Be prepared.', 'A2'],
  'proper': ['to\'g\'ri', 'Proper way.', 'B1'],
  'proud': ['faxrlanmoq', 'I am proud of you.', 'A2'],
  'safe': ['xavfsiz', 'Stay safe.', 'A2'],
  'serious': ['jiddiy', 'Serious matter.', 'B1'],
  'successful': ['muvaffaqiyatli', 'Successful career.', 'B1'],
  'tired': ['charchagan', 'I am tired.', 'A1'],
  'useful': ['foydali', 'Useful information.', 'A2'],
  'willing': ['tayyor', 'I am willing to help.', 'B1'],
  'worried': ['xavotir', 'Do not be worried.', 'A2'],
  // Nouns
  'action': ['harakat', 'Take action.', 'A2'],
  'adult': ['kattalar', 'Adult education.', 'A2'],
  'advice': ['maslahat', 'Good advice.', 'A2'],
  'age': ['yosh', 'At your age.', 'A1'],
  'background': ['tarix', 'Educational background.', 'B1'],
  'behavior': ['xulq', 'Good behavior.', 'B1'],
  'character': ['xarakter', 'Strong character.', 'B1'],
  'comfort': ['qulaylik', 'Comfort zone.', 'B1'],
  'direction': ['yo\'nalish', 'Wrong direction.', 'A2'],
  'doubt': ['shubha', 'I have doubts.', 'B1'],
  'emotion': ['hissiyot', 'Mixed emotions.', 'B1'],
  'event': ['voqea', 'Special event.', 'A2'],
  'goal': ['maqsad', 'Set a goal.', 'A2'],
  'idea': ['g\'oya', 'Good idea.', 'A1'],
  'knowledge': ['bilim', 'Expand your knowledge.', 'B1'],
  'language': ['til', 'Learn a language.', 'A2'],
  'mistake': ['xato', 'Make a mistake.', 'A2'],
  'opportunity': ['imkoniyat', 'Great opportunity.', 'B1'],
  'reason': ['sabab', 'The reason why.', 'A2'],
  'research': ['tadqiqot', 'Scientific research.', 'B1'],
  'risk': ['xavf', 'Take a risk.', 'B1'],
  'skill': ['ko\'nikma', 'Communication skills.', 'B1'],
  'strength': ['kuch', 'Inner strength.', 'B1'],
  'success': ['muvaffaqiyat', 'Achieve success.', 'B1'],
  'type': ['tur', 'Different types.', 'A2'],
  'worth': ['qadr', 'It is worth it.', 'B1'],
  'deal': ['shartnoma', 'Let us make a deal.', 'B1'],
  'realize': ['anglamoq', 'I realize my mistake.', 'B1'],
  'legislate': ['qonun chiqarmoq', 'The government legislates.', 'B2'],
  'consequent': ['natijaviy', 'Consequent effects.', 'B2'],
  'a piece of cake': ['juda oson', 'This exam is a piece of cake.', 'B2'],
  'all in the same boat': ['bir xil ahvolda', 'We are all in the same boat.', 'B2'],
  "burn your bridges": ["ko'priklarni yoqmoq", 'Do not burn your bridges.', 'B2'],
  'by the skin of your teeth': ['aranga', 'I passed by the skin of my teeth.', 'B2'],
  'give someone the benefit of the doubt': ['shubhada foyda bermoq', 'I gave him the benefit of the doubt.', 'B2'],
  'go back to the drawing board': ['boshidan boshlamoq', 'We went back to the drawing board.', 'B2'],
  'in the heat of the moment': ["qaynoq paytda", 'I said it in the heat of the moment.', 'B2'],
  "jump on the bandwagon": ["ommaga qo'shilmoq", 'Everyone jumped on the bandwagon.', 'B2'],
  'keep someone in the loop': ['xabardor qilmoq', 'Keep me in the loop.', 'B2'],
  'leave no stone unturned': ['barcha imkoniyatlarni ishga solmoq', 'We left no stone unturned.', 'B2'],
  'pass the buck': ["javobgarlikni boshqaga yuklamoq", 'Do not pass the buck.', 'B2'],
  "pull someone's leg": ["birovni masxara qilmoq", "I am just pulling your leg.", 'B2'],
  'take something with a grain of salt': ['shubha bilan qaramoq', 'Take it with a grain of salt.', 'B2'],
  "you can't judge a book by its cover": ["kitobni muqovasiga qarab baholab bo'lmaydi", "Remember, you can't judge a book by its cover.", 'B2'],
}

// ── Step 3: Build word list with proper levels ────────────────────────────────

function getWordData(eng, level) {
  const existing = existingTranslations[eng.toLowerCase()]
  const fixed = FIXED_TRANSLATIONS[eng.toLowerCase()]

  if (fixed) {
    return { uzbek: fixed[0], example: fixed[1], level: fixed[2] }
  }
  if (existing) {
    return { uzbek: existing.uzbek, example: existing.example, level }
  }
  // Fallback: use English word as placeholder
  return { uzbek: `(${eng})`, example: `${eng}.`, level }
}

// Parse wordBank.ts to get all headwords with their assigned levels
function extractArray(content, varName) {
  const startMarker = `const ${varName}:`
  const startIdx = content.indexOf(startMarker)
  if (startIdx === -1) return []
  const slice = content.slice(startIdx)
  const assignIdx = slice.indexOf('= [')
  if (assignIdx === -1) return []
  let depth = 0
  let endIdx = assignIdx + 3
  for (let i = assignIdx + 3; i < slice.length; i++) {
    const ch = slice[i]
    if (ch === '[') depth++
    else if (ch === ']') { if (depth === 0) { endIdx = i + 1; break } depth-- }
  }
  const arrayText = slice.slice(assignIdx + 3, endIdx - 1)
  const words = []
  const strRe = /'((?:[^'\\]|\\.)*)'/g
  let m
  while ((m = strRe.exec(arrayText)) !== null) {
    words.push(unescapeJs(m[1]).trim())
  }
  return words
}

const wbContent = readFileSync('src/data/wordBank.ts', 'utf-8')

const phaseConfig = [
  { var: 'PHASE1', level: 'B1' },
  { var: 'PHASE2_VOCAB', level: 'B2' },
  { var: 'PHASE2_PHRASAL', level: 'B1' },
  { var: 'PHASE3_ACADEMIC', level: 'B2' },
  { var: 'PHASE3_IDIOMS', level: 'B2' },
]

// Check what's already in our seed (english+level combo)
const sqlContent = readFileSync('supabase_words_seed.sql', 'utf-8')
const existingSeed = new Set()
const sqlRe = /\(\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*\)/g
let mm
while ((mm = sqlRe.exec(sqlContent)) !== null) {
  const eng = mm[1].toLowerCase()
  const lvl = mm[3]
  existingSeed.add(`${eng}|${lvl}`)
}

// Collect all missing words
const missing = []

for (const pc of phaseConfig) {
  const words = extractArray(wbContent, pc.var)
  for (const word of words) {
    const key = `${word.toLowerCase()}|${pc.level}`
    if (!existingSeed.has(key)) {
      const data = getWordData(word, pc.level)
      missing.push({ english: word.toLowerCase(), uzbek: data.uzbek, example: data.example, level: data.level, source: `wordBank` })
    }
  }
}

// Add vocabularyWords.ts missing words
const vwContent = readFileSync('src/data/vocabularyWords.ts', 'utf-8')
const vwWords = []
const vwRe = /word:\s*'((?:[^'\\]|\\.)*)'/g
let mmm
while ((mmm = vwRe.exec(vwContent)) !== null) {
  vwWords.push(unescapeJs(mmm[1]).trim())
}

for (const word of vwWords) {
  const guessedLevel = { 'abundant':'B1', 'acquire':'B1', 'analyze':'B2', 'demonstrate':'B1', 'appointment':'B1', 'delay':'B1', 'frequently':'B1', 'grateful':'B1', 'realize':'B1', 'accommodation':'B1', 'afford':'B1', 'destination':'B1', 'recommend':'B1', 'reserve':'B1', 'journey':'B1', 'departure':'B1', 'career':'B1', 'deadline':'B1', 'apologize':'B1', 'disappoint':'B1', 'fascinate':'B2', 'impress':'B1', 'nervous':'A2', 'patient':'A2', 'relief':'B1' }[word.toLowerCase()] || 'B1'
  // Check if already in missing (from wordBank) or already in seed
  const inMissing = missing.some(m => m.english === word.toLowerCase())
  const inSeed = existingSeed.has(`${word.toLowerCase()}|${guessedLevel}`) || existingSeed.has(`${word.toLowerCase()}|B1`) || existingSeed.has(`${word.toLowerCase()}|B2`)
  if (!inMissing && !inSeed) {
    const data = getWordData(word, guessedLevel)
    missing.push({ english: word.toLowerCase(), uzbek: data.uzbek, example: data.example, level: data.level, source: 'vocabWords' })
  }
}

console.log(`\nJami qo'shiladigan so'zlar: ${missing.length} ta`)
const byLevel = {}
for (const w of missing) { byLevel[w.level] = (byLevel[w.level] || 0) + 1 }
for (const [lvl, cnt] of Object.entries(byLevel)) { console.log(`  ${lvl}: ${cnt} ta`) }

// ── Step 4: Generate SQL ──────────────────────────────────────────────────────

const BATCH = 500
const inserts = []
for (let i = 0; i < missing.length; i += BATCH) {
  const batch = missing.slice(i, i + BATCH)
  const rows = batch.map((w) =>
    `  ('${escapeSql(w.english)}', '${escapeSql(w.uzbek)}', '${w.level}', '${escapeSql(w.example)}', '')`
  )
  inserts.push(
    `insert into public.words (english, uzbek, level, example, phonetic) values\n${rows.join(',\n')}\non conflict (english, level) do nothing;`
  )
}

const sql = `-- ═══════════════════════════════════════════════════════════════════════════
-- EnglishPath — Missing Words Supplement (${missing.length} words)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Generated by scripts/generate-word-supplement.mjs
--
-- This adds ALL words from wordBank.ts + vocabularyWords.ts that were
-- missing from the main supabase_words_seed.sql.
-- ═══════════════════════════════════════════════════════════════════════════

${inserts.join('\n\n')}

-- Verify
do $$
declare
  a1_cnt int; a2_cnt int; b1_cnt int; b2_cnt int; total int;
begin
  select count(*) into a1_cnt from public.words where level = 'A1';
  select count(*) into a2_cnt from public.words where level = 'A2';
  select count(*) into b1_cnt from public.words where level = 'B1';
  select count(*) into b2_cnt from public.words where level = 'B2';
  total := a1_cnt + a2_cnt + b1_cnt + b2_cnt;
  raise notice '✅ Words total — A1: %, A2: %, B1: %, B2: % (total: %)',
    a1_cnt, a2_cnt, b1_cnt, b2_cnt, total;
end $$;
`

const outPath = 'supabase_words_supplement.sql'
writeFileSync(outPath, sql, 'utf-8')
console.log(`\n✅ ${outPath} yaratildi (${missing.length} so'z)`)

// Also show samples of missing words without translations
const noTrans = missing.filter(w => w.uzbek.startsWith('('))
if (noTrans.length > 0) {
  console.log(`\n⚠️ ${noTrans.length} ta so'z tarjimasiz qoldi:`)
  noTrans.slice(0, 20).forEach(w => console.log(`  ${w.english} (${w.level})`))
}
