export const projectSummary = {
  title: 'Al-Hidayah',
  subtitle: 'Project Research Workspace',
  projectMeta: 'Kitab al-Taharah · Foundational treatise',
}

function segment({
  id,
  chapter,
  topic,
  heading,
  arabic,
  userTranslation = '',
  bestTranslation,
  evaluation,
  status = 'Completed',
  statusTone = 'ready',
  tags = [],
  notes = [],
  vocabulary = [],
  relatedIds = [],
}) {
  return {
    id,
    chapter,
    topic,
    heading,
    arabic,
    userTranslation,
    bestTranslation,
    evaluation,
    status,
    statusTone,
    tags,
    notes,
    vocabulary,
    relatedIds,
  }
}

export const researchSegments = [
  segment({
    id: '1.1',
    chapter: 'Chapter 1: Purity',
    topic: 'Water types',
    heading: 'Pure water as original purifier',
    arabic: 'الماء المطلق طهور لا يخرج عن الطهورية إلا بتغير أحد أوصافه بنجاسة ظاهرة.',
    userTranslation: 'Absolute water is purifying and does not leave purification unless one of its qualities changes by an apparent impurity.',
    bestTranslation: 'Unrestricted water is purifying. It does not cease to be purifying unless one of its qualities is changed by a manifest impurity.',
    evaluation: 'Good core meaning. Keep “unrestricted water” consistent because this term anchors later water categories.',
    tags: ['purity', 'water', 'definition'],
    notes: ['Use “unrestricted water” for ماء مطلق throughout this chapter.'],
    vocabulary: [{ arabic: 'الماء المطلق', transliteration: 'al-māʾ al-muṭlaq', gloss: 'unrestricted water; water without qualifying mixture' }],
    relatedIds: ['1.2', '1.7'],
  }),
  segment({
    id: '1.2',
    chapter: 'Chapter 1: Purity',
    topic: 'Water types',
    heading: 'Purifying water categories',
    arabic: 'والماء الذي يجوز به الوضوء كل ماء نزل من السماء أو نبع من الأرض ما دام باقيا على أصل خلقته.',
    userTranslation: 'Water that may be used for ablution is every water that descends from the sky or comes from the earth while remaining in its original nature.',
    bestTranslation: 'Water valid for ablution is any water that falls from the sky or springs from the earth, so long as it remains upon its original created state.',
    evaluation: 'Accurate overall. The phrase “original created state” should remain consistent across later water passages.',
    tags: ['purity', 'water', 'definition'],
    notes: ['Good candidate for a recurring terminology note.'],
    vocabulary: [{ arabic: 'أصل خلقته', transliteration: 'aṣl khalqatih', gloss: 'its original created state' }],
    relatedIds: ['1.1', '1.4'],
  }),
  segment({
    id: '1.3',
    chapter: 'Chapter 1: Purity',
    topic: 'Jumu’ah conditions',
    heading: 'Comprehensive city condition',
    arabic: 'لا تصح الجمعة إلا في مصر جامع أو في مصلى المصر ولا تجوز في القرى لقوله ﷺ لا جمعة ولا تشريق ولا فطر ولا أضحى إلا في مصر جامع.',
    userTranslation: "Jumu'ah prayer is only valid in a comprehensive city or in the prayer area of the city. It is not permissible in villages.",
    bestTranslation: 'The Friday prayer is only valid in a comprehensive city or in the city prayer-ground, not in villages. A comprehensive city is one with authority to establish judgments and public order.',
    evaluation: 'Strong handling of the legal condition. Preserve the distinction between the main city and its attached outskirts, and keep attributed views clearly separated.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['fiqh', 'validity', 'city-condition'],
    notes: ['Keep al-Karkhī and al-Thaljī views distinct.', 'Avoid making the ruling sound like a general recommendation.'],
    vocabulary: [
      { arabic: 'مصر جامع', transliteration: 'misr jāmiʿ', gloss: 'comprehensive city; a large urban centre with civic authority' },
      { arabic: 'أفنية', transliteration: 'afniyah', gloss: 'outskirts or attached surrounding areas' },
    ],
    relatedIds: ['1.2', '2.3'],
  }),
  segment({
    id: '1.4',
    chapter: 'Chapter 1: Purity',
    topic: 'Tayammum',
    heading: 'Earth substitute when water is unavailable',
    arabic: 'والتيمم جائز عند عدم الماء أو العجز عن استعماله بالصعيد الطاهر على الوجه المأمور به.',
    userTranslation: 'Tayammum is permissible when water is absent or one cannot use it, with clean earth according to the instructed way.',
    bestTranslation: 'Dry ablution is permitted when water is unavailable, or when one is unable to use it, using pure earth in the prescribed manner.',
    evaluation: 'Readable and faithful. “Dry ablution” is user-friendly, but preserve the technical term in support notes where helpful.',
    tags: ['purity', 'substitution', 'tayammum'],
    notes: ['Consider surfacing this as a revision contrast with ablution passages.'],
    vocabulary: [{ arabic: 'الصعيد الطاهر', transliteration: 'al-ṣaʿīd al-ṭāhir', gloss: 'pure earth or clean surface material' }],
    relatedIds: ['1.2', '1.5'],
  }),
  segment({
    id: '1.5',
    chapter: 'Chapter 1: Purity',
    topic: 'Impurity',
    heading: 'Water changed by impurity',
    arabic: 'فإن تغير طعمه أو لونه أو ريحه بنجاسة لم يجز استعماله في رفع الحدث ولا في إزالة الخبث.',
    userTranslation: 'If its taste, color, or smell changes by filth, it cannot be used to remove ritual impurity or physical filth.',
    bestTranslation: 'If its taste, colour, or smell is altered by an impurity, it may not be used to remove ritual impurity or to cleanse physical impurity.',
    evaluation: 'Needs a cleaner distinction between ritual impurity and physical impurity; do not translate both with the same English word.',
    status: 'Weak area',
    statusTone: 'weak',
    tags: ['purity', 'impurity', 'terminology'],
    notes: ['Repeated issue: حدث and خبث need separate English renderings.'],
    vocabulary: [
      { arabic: 'الحدث', transliteration: 'al-ḥadath', gloss: 'ritual impurity state' },
      { arabic: 'الخبث', transliteration: 'al-khabath', gloss: 'physical impurity or filth' },
    ],
    relatedIds: ['1.1', '1.7'],
  }),
  segment({
    id: '1.6',
    chapter: 'Chapter 1: Purity',
    topic: 'Wells',
    heading: 'Drawing water from wells',
    arabic: 'وإذا وقعت نجاسة في البئر نزح منها بقدر ما يغلب على الظن زوال أثرها.',
    userTranslation: 'If impurity falls into a well, water is drawn from it according to what mostly gives confidence that its trace is gone.',
    bestTranslation: 'When an impurity falls into a well, water is drawn out in an amount that gives predominant confidence that its trace has been removed.',
    evaluation: 'Good. “Predominant confidence” carries the legal estimation better than “mostly gives confidence.”',
    tags: ['purity', 'wells', 'estimation'],
    notes: ['Useful example of ظن as practical legal estimation.'],
    vocabulary: [{ arabic: 'غلبة الظن', transliteration: 'ghalabat al-ẓann', gloss: 'predominant confidence or probability' }],
    relatedIds: ['1.5'],
  }),
  segment({
    id: '1.7',
    chapter: 'Chapter 1: Purity',
    topic: 'Used water',
    heading: 'Used water and ritual lifting',
    arabic: 'والماء المستعمل لا يرفع الحدث عند أصحابنا وإن كان طاهرا في نفسه.',
    userTranslation: '',
    bestTranslation: 'Used water does not remove ritual impurity according to our school, even though it is pure in itself.',
    evaluation: 'No user translation saved yet. This is a high-value comparison item because “pure” and “purifying” diverge here.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['purity', 'used-water', 'missing-translation'],
    notes: ['Add a user attempt before using this in review drills.'],
    vocabulary: [{ arabic: 'الماء المستعمل', transliteration: 'al-māʾ al-mustaʿmal', gloss: 'used water' }],
    relatedIds: ['1.1', '1.5'],
  }),
  segment({
    id: '1.8',
    chapter: 'Chapter 1: Purity',
    topic: 'Animal remnants',
    heading: 'Residual water from animals',
    arabic: 'وسؤر الهرة طاهر غير مكروه لأنها من الطوافين عليكم والطوافات.',
    userTranslation: 'The leftover water of a cat is pure and not disliked because it is among those who go around you.',
    bestTranslation: 'The leftover water from a cat is pure and not disliked, because cats are among those that move freely around you.',
    evaluation: 'Accurate and readable. The prophetic phrase can be paraphrased here because the legal point is habitual contact.',
    tags: ['purity', 'animals', 'remnants'],
    notes: ['Good example where literal quotation is less important than legal rationale.'],
    vocabulary: [{ arabic: 'سؤر', transliteration: 'suʾr', gloss: 'leftover water after drinking' }],
    relatedIds: ['1.6'],
  }),
  segment({
    id: '2.1',
    chapter: 'Chapter 2: Prayer',
    topic: 'Prayer timing',
    heading: 'Beginning of the noon prayer window',
    arabic: 'وأول وقت الظهر إذا زالت الشمس وآخره عند أبي حنيفة إذا صار ظل كل شيء مثليه سوى فيء الزوال.',
    userTranslation: 'The first time of Zuhr is when the sun declines, and its end according to Abu Hanifa is when the shadow of everything is twice its length excluding the noon shadow.',
    bestTranslation: 'The noon prayer begins when the sun passes its zenith. According to Abū Ḥanīfah, it ends when each object’s shadow reaches twice its length, excluding the zenith shadow.',
    evaluation: 'Needs review around “zenith shadow”; the source distinguishes original shadow from the measured later shadow.',
    status: 'Weak area',
    statusTone: 'weak',
    tags: ['prayer', 'time', 'shadow'],
    notes: ['Repeated issue: technical measurements need a brief plain-English clarification.'],
    vocabulary: [{ arabic: 'فيء الزوال', transliteration: 'fayʾ al-zawāl', gloss: 'the shadow present at zenith' }],
    relatedIds: ['2.2', '2.7'],
  }),
  segment({
    id: '2.2',
    chapter: 'Chapter 2: Prayer',
    topic: 'Prayer timing',
    heading: 'Afternoon prayer timing dispute',
    arabic: 'وعندهما يدخل وقت العصر إذا صار ظل كل شيء مثله بعد فيء الزوال.',
    userTranslation: 'According to the two companions, Asr enters when the shadow of everything becomes equal to it after the zenith shadow.',
    bestTranslation: 'According to the two companions, the time of ʿAṣr begins when each object’s shadow equals its length in addition to the zenith shadow.',
    evaluation: 'Good content, but “after the zenith shadow” is ambiguous. Prefer “in addition to the zenith shadow.”',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['prayer', 'time', 'dispute'],
    notes: ['Related directly to the shadow wording problem in 2.1.'],
    vocabulary: [{ arabic: 'عندهما', transliteration: 'ʿindahumā', gloss: 'according to the two companions' }],
    relatedIds: ['2.1'],
  }),
  segment({
    id: '2.3',
    chapter: 'Chapter 2: Prayer',
    topic: 'Congregational conditions',
    heading: 'Public order and city authority',
    arabic: 'والحكم غير مقصور على المصلى بل تجوز في جميع أفنية المصر لأنها بمنزلته في حوائج أهله.',
    userTranslation: 'The ruling is not limited to the prayer area; rather, it is permissible throughout all the outskirts of the city because they are like it for the needs of its people.',
    bestTranslation: 'The ruling is not confined to the prayer-ground; it applies throughout the city’s attached outskirts, because those areas share the city’s status in meeting the needs of its people.',
    evaluation: 'This is a strong revision anchor for the Jumu’ah passage. It clarifies why attached outskirts can share the legal status of the city.',
    tags: ['fiqh', 'city-condition', 'related-ruling'],
    notes: ['Useful citation for explaining 1.3.'],
    vocabulary: [{ arabic: 'حوائج أهله', transliteration: 'ḥawāʾij ahlih', gloss: 'the needs of its people' }],
    relatedIds: ['1.3'],
  }),
  segment({
    id: '2.4',
    chapter: 'Chapter 2: Prayer',
    topic: 'Travel',
    heading: 'Shortening prayer during travel',
    arabic: 'ويقصر المسافر الفرض الرباعي إذا جاوز عمران مصره قاصدا مسيرة ثلاثة أيام.',
    userTranslation: 'A traveler shortens the four-unit obligation when he passes the buildings of his city intending a journey of three days.',
    bestTranslation: 'A traveller shortens each four-unit obligatory prayer once he has passed the inhabited bounds of his city while intending a journey of three days.',
    evaluation: 'Strong. “Inhabited bounds” is a good phrase for عمران here and avoids sounding like a single building.',
    tags: ['prayer', 'travel', 'shortening'],
    notes: ['Potential cross-link with city-boundary passages.'],
    vocabulary: [{ arabic: 'عمران مصره', transliteration: 'ʿumrān miṣrih', gloss: 'inhabited bounds of his city' }],
    relatedIds: ['2.3', '2.5'],
  }),
  segment({
    id: '2.5',
    chapter: 'Chapter 2: Prayer',
    topic: 'Congregation',
    heading: 'Minimum congregation condition',
    arabic: 'وتنعقد الجماعة بواحد مع الإمام في غير الجمعة عند عامة أصحابنا.',
    userTranslation: 'Congregation is formed by one person with the imam except for Friday prayer according to our general companions.',
    bestTranslation: 'A congregation is established by one person together with the imam, except in Friday prayer, according to the general position of our school.',
    evaluation: 'Needs revision: “our general companions” sounds unnatural. Use “general position of our school.”',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['prayer', 'congregation', 'wording'],
    notes: ['Avoid literalizing أصحابنا where it means school authorities.'],
    vocabulary: [{ arabic: 'عامة أصحابنا', transliteration: 'ʿāmmat aṣḥābinā', gloss: 'the general position of our school' }],
    relatedIds: ['2.3', '2.6'],
  }),
  segment({
    id: '2.6',
    chapter: 'Chapter 2: Prayer',
    topic: 'Friday sermon',
    heading: 'Sermon before Friday prayer',
    arabic: 'ومن شرط الجمعة الخطبة قبل الصلاة مشتملة على ذكر الله تعالى.',
    userTranslation: 'Among the conditions of Friday prayer is the sermon before the prayer containing remembrance of Allah Most High.',
    bestTranslation: 'A condition of Friday prayer is that a sermon precede the prayer and include remembrance of God Most High.',
    evaluation: 'Clear and concise. “Precede” handles قبل الصلاة better than “before the prayer” in this legal construction.',
    tags: ['prayer', 'jumuah', 'sermon'],
    notes: ['Good clean example for condition syntax.'],
    vocabulary: [{ arabic: 'الخطبة', transliteration: 'al-khuṭbah', gloss: 'sermon' }],
    relatedIds: ['1.3', '2.5'],
  }),
  segment({
    id: '2.7',
    chapter: 'Chapter 2: Prayer',
    topic: 'Direction',
    heading: 'Prayer direction after effort',
    arabic: 'ومن اشتبهت عليه القبلة فتحرى وصلى ثم تبين خطؤه لم يعد عندنا.',
    userTranslation: 'Whoever the qiblah is unclear to him should investigate and pray, then if his mistake becomes clear he does not repeat according to us.',
    bestTranslation: 'If the qiblah is unclear to someone, he exercises judgment and prays; if his error later becomes clear, he does not repeat the prayer according to our school.',
    evaluation: 'Needs smoother English. Preserve the sequence: uncertainty, effort, prayer, later discovery.',
    status: 'Weak area',
    statusTone: 'weak',
    tags: ['prayer', 'qiblah', 'judgment'],
    notes: ['تحرى is not merely “investigate”; it is practical judgment after effort.'],
    vocabulary: [{ arabic: 'تحرى', transliteration: 'taḥarrā', gloss: 'to exercise careful judgment' }],
    relatedIds: ['2.1'],
  }),
  segment({
    id: '3.1',
    chapter: 'Chapter 3: Zakat',
    topic: 'Threshold',
    heading: 'Silver threshold for zakat',
    arabic: 'ولا زكاة في الفضة حتى تبلغ مائتي درهم فإذا بلغت ففيها ربع العشر.',
    userTranslation: 'There is no zakat on silver until it reaches two hundred dirhams; when it reaches that, one quarter of one tenth is due.',
    bestTranslation: 'No zakat is due on silver until it reaches two hundred dirhams. Once it reaches that amount, one-fortieth is due.',
    evaluation: 'Meaning is correct. “One-fortieth” is clearer than “one quarter of one tenth” for modern readers.',
    tags: ['zakat', 'nisab', 'silver'],
    notes: ['Good place for a conversion note if product later supports units.'],
    vocabulary: [{ arabic: 'ربع العشر', transliteration: 'rubʿ al-ʿushr', gloss: 'one-fortieth; 2.5%' }],
    relatedIds: ['3.2'],
  }),
  segment({
    id: '3.2',
    chapter: 'Chapter 3: Zakat',
    topic: 'Trade goods',
    heading: 'Valuing trade inventory',
    arabic: 'وتقوم عروض التجارة عند تمام الحول بما هو أنفع للفقراء من النقدين.',
    userTranslation: 'Trade goods are evaluated at completion of the year by whichever of the two currencies is more beneficial for the poor.',
    bestTranslation: 'Trade inventory is valued at the completion of the lunar year according to whichever of the two currencies is more beneficial for the poor.',
    evaluation: 'Needs a note on حول as a lunar zakat year. Otherwise the comparison is clear.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['zakat', 'trade', 'valuation'],
    notes: ['Add “lunar year” in support language when translating حول.'],
    vocabulary: [{ arabic: 'عروض التجارة', transliteration: 'ʿurūḍ al-tijārah', gloss: 'trade inventory or goods held for sale' }],
    relatedIds: ['3.1', '3.3'],
  }),
  segment({
    id: '3.3',
    chapter: 'Chapter 3: Zakat',
    topic: 'Debts',
    heading: 'Debt offset against zakat',
    arabic: 'والدين المستغرق للنصاب يمنع وجوب الزكاة في الأموال الباطنة.',
    userTranslation: 'A debt that consumes the nisab prevents zakat from being obligatory on hidden wealth.',
    bestTranslation: 'A debt that exhausts the zakat threshold prevents zakat from becoming obligatory on non-apparent wealth.',
    evaluation: 'Weak terminology: “hidden wealth” sounds suspicious in English. Use “non-apparent wealth” and explain the category.',
    status: 'Weak area',
    statusTone: 'weak',
    tags: ['zakat', 'debt', 'terminology'],
    notes: ['الأموال الباطنة is technical; do not moralize it in English.'],
    vocabulary: [{ arabic: 'الأموال الباطنة', transliteration: 'al-amwāl al-bāṭinah', gloss: 'non-apparent wealth, such as cash or trade goods' }],
    relatedIds: ['3.1'],
  }),
  segment({
    id: '3.4',
    chapter: 'Chapter 3: Zakat',
    topic: 'Crops',
    heading: 'Agricultural produce rate',
    arabic: 'وفيما سقت السماء العشر وفيما سقي بدالية أو نضح نصف العشر.',
    userTranslation: 'Whatever the sky waters has a tenth, and whatever is watered by a waterwheel or carrying has half a tenth.',
    bestTranslation: 'Produce irrigated by rainfall owes one-tenth, while produce irrigated by mechanical drawing or manual watering owes one-twentieth.',
    evaluation: 'Good structure but revise “whatever the sky waters.” The best translation is clearer and less literal.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['zakat', 'crops', 'rates'],
    notes: ['Prefer percentage/rate clarity in financial passages.'],
    vocabulary: [{ arabic: 'نصف العشر', transliteration: 'niṣf al-ʿushr', gloss: 'one-twentieth; 5%' }],
    relatedIds: ['3.1'],
  }),
  segment({
    id: '3.5',
    chapter: 'Chapter 3: Zakat',
    topic: 'Gold',
    heading: 'Gold threshold without user attempt',
    arabic: 'ولا شيء في الذهب حتى يبلغ عشرين مثقالا فإذا بلغ ففيه نصف مثقال.',
    bestTranslation: 'No zakat is due on gold until it reaches twenty mithqāls. Once it reaches that amount, half a mithqāl is due.',
    evaluation: 'No user translation saved yet. This is useful for a future unit/threshold comparison drill.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['zakat', 'gold', 'missing-translation'],
    notes: ['Missing user translation; keep in revision queue.'],
    vocabulary: [{ arabic: 'مثقال', transliteration: 'mithqāl', gloss: 'a classical gold-weight unit' }],
    relatedIds: ['3.1'],
  }),
  segment({
    id: '4.1',
    chapter: 'Chapter 4: Fasting',
    topic: 'Intention',
    heading: 'Intention for Ramadan fasting',
    arabic: 'ويصح صوم رمضان بنية من الليل إلى ما قبل نصف النهار الشرعي.',
    userTranslation: 'The fast of Ramadan is valid with an intention from the night until before half of the legal day.',
    bestTranslation: 'The Ramadan fast is valid with an intention made during the night up until before the midpoint of the legal day.',
    evaluation: 'Clear. “Midpoint of the legal day” should be explained in a note if this appears in study mode.',
    tags: ['fasting', 'intention', 'time'],
    notes: ['Potential glossary item: النهار الشرعي.'],
    vocabulary: [{ arabic: 'نصف النهار الشرعي', transliteration: 'niṣf al-nahār al-sharʿī', gloss: 'midpoint of the legal day' }],
    relatedIds: ['4.2'],
  }),
  segment({
    id: '4.2',
    chapter: 'Chapter 4: Fasting',
    topic: 'Dawn',
    heading: 'True dawn boundary',
    arabic: 'والاعتبار في الإمساك بطلوع الفجر الصادق لا بما يظهر قبله من البياض المستطيل.',
    userTranslation: 'The consideration in stopping is the rising of the true dawn, not what appears before it of lengthwise whiteness.',
    bestTranslation: 'The point for beginning abstention is the appearance of true dawn, not the earlier vertical whiteness that may appear before it.',
    evaluation: 'Weak phrasing. “Lengthwise whiteness” should become “vertical whiteness” or be explained as false dawn.',
    status: 'Weak area',
    statusTone: 'weak',
    tags: ['fasting', 'dawn', 'astronomy'],
    notes: ['Repeated issue: spatial descriptions need plain-English help.'],
    vocabulary: [{ arabic: 'الفجر الصادق', transliteration: 'al-fajr al-ṣādiq', gloss: 'true dawn' }],
    relatedIds: ['4.1'],
  }),
  segment({
    id: '4.3',
    chapter: 'Chapter 4: Fasting',
    topic: 'Travel',
    heading: 'Traveler choosing to fast',
    arabic: 'والمسافر إن صام أجزأه وإن أفطر فعليه القضاء ولا كفارة.',
    userTranslation: 'If the traveler fasts it suffices him, and if he breaks the fast then he owes makeup and no expiation.',
    bestTranslation: 'If a traveller fasts, it counts for him; if he does not fast, he must make it up later and no expiation is due.',
    evaluation: 'Strong and readable. “Does not fast” is often smoother than “breaks the fast” in this context.',
    tags: ['fasting', 'travel', 'makeup'],
    notes: ['Good example of preserving legal consequence without over-literal wording.'],
    vocabulary: [{ arabic: 'القضاء', transliteration: 'al-qaḍāʾ', gloss: 'making up a missed obligation' }],
    relatedIds: ['2.4'],
  }),
  segment({
    id: '4.4',
    chapter: 'Chapter 4: Fasting',
    topic: 'Expiation',
    heading: 'Expiation after deliberate violation',
    arabic: 'وتجب الكفارة بالجماع عمدا في أداء رمضان بعد صحة النية.',
    userTranslation: 'Expiation becomes obligatory by intercourse deliberately in the performance of Ramadan after the validity of intention.',
    bestTranslation: 'Expiation is required for deliberate intercourse during a current Ramadan fast after a valid intention has been made.',
    evaluation: 'Needs revision. The current translation is too syntactic; make the legal condition readable as a single rule.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['fasting', 'expiation', 'wording'],
    notes: ['Avoid “performance of Ramadan” as a literal rendering of أداء رمضان.'],
    vocabulary: [{ arabic: 'أداء رمضان', transliteration: 'adāʾ ramaḍān', gloss: 'a current Ramadan fast, not a makeup fast' }],
    relatedIds: ['4.1', '4.3'],
  }),
  segment({
    id: '5.1',
    chapter: 'Chapter 5: Transactions',
    topic: 'Sales',
    heading: 'Sale with a condition',
    arabic: 'والبيع بشرط لا يقتضيه العقد ولا يلائمه فاسد عند أصحابنا.',
    userTranslation: 'A sale with a condition not required by the contract and not suitable to it is invalid according to our companions.',
    bestTranslation: 'A sale containing a condition that the contract does not require and that does not accord with it is irregular according to our school.',
    evaluation: 'Needs terminology care. فاسد in Hanafi transactions is often “irregular,” not simply invalid.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['transactions', 'sale', 'terminology'],
    notes: ['Mark فاسد as a recurring high-risk translation term.'],
    vocabulary: [{ arabic: 'فاسد', transliteration: 'fāsid', gloss: 'irregular or defective, context-dependent' }],
    relatedIds: ['5.2'],
  }),
  segment({
    id: '5.2',
    chapter: 'Chapter 5: Transactions',
    topic: 'Defects',
    heading: 'Option due to defect',
    arabic: 'ومن وجد بالمبيع عيبا قديما فهو بالخيار إن شاء رده وإن شاء أمسكه.',
    userTranslation: 'Whoever finds an old defect in the sold item has the option: if he wants he returns it and if he wants he keeps it.',
    bestTranslation: 'A buyer who discovers a pre-existing defect in the sold item has the option either to return it or to keep it.',
    evaluation: 'Good meaning but revise for idiomatic English. “Pre-existing defect” is better than “old defect.”',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['transactions', 'defect', 'option'],
    notes: ['Good comparison drill: literal vs legal-English phrasing.'],
    vocabulary: [{ arabic: 'عيب قديم', transliteration: 'ʿayb qadīm', gloss: 'pre-existing defect' }],
    relatedIds: ['5.1'],
  }),
  segment({
    id: '5.3',
    chapter: 'Chapter 5: Transactions',
    topic: 'Salam',
    heading: 'Deferred delivery terms',
    arabic: 'ولا يصح السلم إلا في معلوم الجنس والقدر والصفة والأجل.',
    userTranslation: 'Salam is not valid except in what is known in genus, measure, description, and term.',
    bestTranslation: 'A salam contract is valid only when the genus, quantity, description, and delivery term are all specified.',
    evaluation: 'Weak phrase “known in genus.” This should be converted into contract-specification language.',
    status: 'Weak area',
    statusTone: 'weak',
    tags: ['transactions', 'salam', 'contract'],
    notes: ['This is a strong candidate for a translation comparison drill.'],
    vocabulary: [{ arabic: 'الأجل', transliteration: 'al-ajal', gloss: 'deferred term or delivery date' }],
    relatedIds: ['5.1'],
  }),
  segment({
    id: '5.4',
    chapter: 'Chapter 5: Transactions',
    topic: 'Lease',
    heading: 'Known period in leases',
    arabic: 'ولا تصح الإجارة حتى تكون المنفعة معلومة والمدة معلومة.',
    userTranslation: 'A lease is not valid until the benefit is known and the period is known.',
    bestTranslation: 'A lease is valid only when both the usufruct and the term are specified.',
    evaluation: 'Good legal structure. Consider “usufruct” only if the learner knows the term; otherwise pair it with “benefit.”',
    tags: ['transactions', 'lease', 'term'],
    notes: ['Potential vocabulary note: منفعة can be benefit/usufruct depending audience.'],
    vocabulary: [{ arabic: 'المنفعة', transliteration: 'al-manfaʿah', gloss: 'benefit or usufruct in a lease' }],
    relatedIds: ['5.3'],
  }),
  segment({
    id: '5.5',
    chapter: 'Chapter 5: Transactions',
    topic: 'Agency',
    heading: 'Agency wording without attempt',
    arabic: 'وتصح الوكالة بكل لفظ يدل على الإذن والإنابة.',
    bestTranslation: 'Agency is valid through any wording that indicates authorization and deputizing another to act.',
    evaluation: 'No user translation saved yet. This is useful for testing missing-attempt states in the reader.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['transactions', 'agency', 'missing-translation'],
    notes: ['Missing user translation; keep action language gentle and non-punitive.'],
    vocabulary: [{ arabic: 'الإنابة', transliteration: 'al-inābah', gloss: 'appointing another to act on one’s behalf' }],
    relatedIds: ['5.4'],
  }),
  segment({
    id: '5.6',
    chapter: 'Chapter 5: Transactions',
    topic: 'Evidence',
    heading: 'Testimony and rights',
    arabic: 'وتقبل الشهادة في حقوق العباد إذا استكملت شروطها وانتفت التهمة.',
    userTranslation: 'Testimony is accepted in the rights of servants when its conditions are completed and suspicion is absent.',
    bestTranslation: 'Testimony is accepted in private rights when its conditions are fulfilled and grounds for suspicion are absent.',
    evaluation: 'Needs revision: “rights of servants” is misleading. Use “private rights” or explain حقوق العباد.',
    status: 'Needs revision',
    statusTone: 'review',
    tags: ['evidence', 'testimony', 'rights'],
    notes: ['حقوق العباد is a recurring phrase; add it to terminology review.'],
    vocabulary: [{ arabic: 'حقوق العباد', transliteration: 'ḥuqūq al-ʿibād', gloss: 'private or interpersonal rights' }],
    relatedIds: ['5.1'],
  }),
]

// Refinements that derive from a segment's real properties, so they apply to
// ANY project. The old 'City terms' chip was a fixture specific to the Al-Hidayah
// sample and leaked into every project (S3-005).
export const quickRefinements = [
  { id: 'revision', label: 'Needs revision' },
  { id: 'no-translation', label: 'No translation' },
  { id: 'vocab-rich', label: 'Vocab rich' },
]

export function getResearchStats(segments = researchSegments) {
  const vocabularyNotes = segments.reduce((total, item) => total + item.vocabulary.length, 0)
  const notes = segments.reduce((total, item) => total + item.notes.length, 0)
  // Needs-attention counts ONLY validated attention states ('weak' = needs
  // revision, 'review' = the reference demo's review items) — never 'neutral'
  // (unstarted / attempted-ungraded), which the old `!== 'ready'` wrongly swept in
  // and presented as learner mistakes (material problem #2).
  const needsAttention = segments.filter((item) => item.statusTone === 'weak' || item.statusTone === 'review').length
  const completed = segments.filter((item) => item.statusTone === 'ready').length
  const missingTranslations = segments.filter((item) => !item.userTranslation).length

  return {
    totalSegments: segments.length,
    vocabularyNotes,
    notes,
    needsAttention,
    completed,
    missingTranslations,
  }
}

export function getRevisionQueue(segments = researchSegments) {
  const stats = getResearchStats(segments)
  const comparisonItems = segments.filter((item) => item.userTranslation && item.bestTranslation).length

  // Every entry derives from the project's OWN segment data. The former
  // "Recurring terms · N city-condition links" entry was a fixture-specific
  // topic that read as "0 city-condition links" on any real project (S3-005);
  // it is replaced by the segment's real vocabulary count.
  return [
    {
      id: 'weak',
      label: 'Weak segments',
      detail: `${stats.needsAttention} to review`,
      filter: 'weak',
      query: '',
    },
    {
      id: 'vocab',
      label: 'Vocabulary notes',
      detail: `${stats.vocabularyNotes} captured`,
      filter: 'vocabulary',
      query: '',
    },
    {
      id: 'comparison',
      label: 'Translation comparison',
      detail: `${comparisonItems} comparison-ready`,
      filter: 'all',
      query: '',
    },
  ]
}

export function getFilterCount(filterId, segments = researchSegments) {
  if (filterId === 'all' || filterId === 'segments') {
    return segments.length
  }

  if (filterId === 'vocabulary') {
    return segments.reduce((total, item) => total + item.vocabulary.length, 0)
  }

  if (filterId === 'mistakes' || filterId === 'weak') {
    return segments.filter((item) => item.statusTone === 'weak' || item.statusTone === 'review').length
  }

  if (filterId === 'notes') {
    return segments.reduce((total, item) => total + item.notes.length, 0)
  }

  if (filterId === 'completed') {
    return segments.filter((item) => item.statusTone === 'ready').length
  }

  return 0
}

export function normalizeSearchValue(value = '') {
  return value.trim().toLocaleLowerCase()
}

function matchesQuickRefinement(segmentItem, quickId) {
  if (!quickId) {
    return true
  }

  if (quickId === 'revision') {
    return segmentItem.statusTone !== 'ready'
  }

  if (quickId === 'no-translation') {
    return !segmentItem.userTranslation
  }

  if (quickId === 'vocab-rich') {
    return segmentItem.vocabulary.length > 1
  }

  if (quickId === 'city-terms') {
    return segmentItem.tags.includes('city-condition') || normalizeSearchValue(segmentItem.heading).includes('city')
  }

  return true
}

export function getFilteredSegments({ query, filterId, quickId }, segments = researchSegments) {
  const normalizedQuery = normalizeSearchValue(query)

  return segments.filter((segmentItem) => {
    const matchesFilter =
      filterId === 'all' ||
      filterId === 'segments' ||
      (filterId === 'vocabulary' && segmentItem.vocabulary.length > 0) ||
      (filterId === 'mistakes' && segmentItem.statusTone !== 'ready') ||
      (filterId === 'weak' && segmentItem.statusTone !== 'ready') ||
      (filterId === 'notes' && segmentItem.notes.length > 0) ||
      (filterId === 'completed' && segmentItem.statusTone === 'ready')

    if (!matchesFilter || !matchesQuickRefinement(segmentItem, quickId)) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    const searchable = [
      segmentItem.id,
      segmentItem.chapter,
      segmentItem.topic,
      segmentItem.heading,
      segmentItem.arabic,
      segmentItem.userTranslation || 'no user translation missing translation',
      segmentItem.bestTranslation,
      segmentItem.evaluation,
      segmentItem.status,
      ...segmentItem.tags,
      ...segmentItem.notes,
      ...segmentItem.vocabulary.flatMap((term) => [term.arabic, term.transliteration, term.gloss]),
    ].join(' ')

    return normalizeSearchValue(searchable).includes(normalizedQuery)
  })
}
