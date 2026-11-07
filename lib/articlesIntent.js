'use strict';

// "I want to travel / emigrate" articles, written around the exact phrases
// people type in each dialect (Egyptian "عايز أسافر", Levantine "بدي سافر",
// standard "أريد أسافر / أريد أهاجر"). Each one names only official routes and
// official sites, promises no visa or job, and ends in the concierge chat with
// the visitor's question already typed (`ask`).

const T = (ar, fr, en) => ({ ar, fr, en });
const L = (href, ar, fr, en) => ({ href, label: T(ar, fr, en) });

const IRCC = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html';
const CHANCENKARTE = 'https://www.make-it-in-germany.com/en/visa-residence/types/job-search-opportunity-card';
const SKILLSELECT = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect';
const DV = 'https://dvprogram.state.gov/';
const UK_SKILLED = 'https://www.gov.uk/skilled-worker-visa';
const ITALY = 'https://www.interno.gov.it/';
const TR_EVISA = 'https://www.evisa.gov.tr/';
const MOHRE = 'https://www.mohre.gov.ae/';
const QIWA = 'https://www.qiwa.sa/';

const SCAM = L('/blog/spot-fake-job-offer', 'كيف تكشف عرض العمل المزيّف', 'Repérer une fausse offre d\'emploi', 'Spot a fake job offer');
const GULF = [
  L('/work-in-saudi-arabia', 'العمل في السعودية', 'Travailler en Arabie saoudite', 'Working in Saudi Arabia'),
  L('/work-in-uae', 'العمل في الإمارات', 'Travailler aux Émirats', 'Working in the UAE'),
  L('/work-in-qatar', 'العمل في قطر', 'Travailler au Qatar', 'Working in Qatar'),
  L('/work-in-kuwait', 'العمل في الكويت', 'Travailler au Koweït', 'Working in Kuwait'),
];

const ARTICLES = [
  {
    slug: 'want-to-travel-abroad-egypt',
    publishedAt: '2026-11-07',
    meta: {
      ar: { title: 'عايز أسافر برّه مصر: إزاي أسافر أشتغل بطريقة قانونية', description: 'عايز تسافر السعودية أو الكويت أو إيطاليا أو كندا؟ الطرق الحقيقية والأوراق والمواقع الرسمية، وإزاي تتجنب النصب. واسأل المساعد عن حالتك.' },
      fr: { title: "Quitter l'Égypte pour travailler à l'étranger : les vraies voies légales", description: "Arabie saoudite, Koweït, Italie, Canada : les vraies démarches, les documents, les sites officiels et comment éviter les arnaques." },
      en: { title: 'Want to Leave Egypt to Work Abroad? The Real Legal Routes', description: 'Saudi Arabia, Kuwait, Italy, Canada: the real steps, the documents, the official sites, and how to avoid scams. Then ask the concierge about your case.' },
    },
    h1: T('عايز أسافر برّه مصر؟ الطرق الحقيقية للشغل في الخارج', "Vous voulez quitter l'Égypte pour travailler ? Les vraies voies", 'Want to Leave Egypt to Work? The Real Routes'),
    intro: T(
      'لو بتقول "عايز أسافر أشتغل برّه"، فيه طرق قانونية حقيقية، وكل طريق له شروط واضحة. هنا أهمها، مع المواقع الرسمية، وبعدها المساعد يكمّل معاك خطوة بخطوة حسب مهنتك.',
      "Si vous vous dites « je veux partir travailler à l'étranger », il existe de vraies voies légales, chacune avec des conditions claires. Voici les principales, avec les sites officiels ; ensuite le concierge vous accompagne étape par étape selon votre métier.",
      'If you keep thinking "I want to go work abroad", there are real legal routes, each with clear conditions. Here are the main ones with their official sites; then the concierge walks you through it step by step for your trade.'),
    sections: [
      {
        h2: T('الخليج: السعودية والكويت والإمارات وقطر', 'Le Golfe : Arabie saoudite, Koweït, Émirats, Qatar', 'The Gulf: Saudi Arabia, Kuwait, UAE, Qatar'),
        paras: T(
          ['الشغل في الخليج بيبدأ بعقد من صاحب عمل حقيقي، وهو اللي بيطلب لك التأشيرة والإقامة. ما تشتريش "فيزا حرّة": بيعها مخالف، وممكن تلاقي نفسك بدون إقامة قانونية.'],
          ["Le travail dans le Golfe commence par un contrat d'un vrai employeur, qui demande le visa et le permis de séjour pour vous. N'achetez jamais un « visa libre » : c'est illégal et vous pouvez vous retrouver sans statut."],
          ['Work in the Gulf starts with a contract from a real employer, who applies for your visa and residence. Never buy a so-called "free visa": selling it is illegal and can leave you without legal status.']),
        links: [...GULF, L(QIWA, 'منصة قوى (السعودية)', 'Plateforme Qiwa (Arabie saoudite)', 'Qiwa platform (Saudi Arabia)')],
      },
      {
        h2: T('إيطاليا: نظام الحصص السنوية', "L'Italie : les quotas annuels (decreto flussi)", 'Italy: the yearly work quotas (decreto flussi)'),
        paras: T(
          ['إيطاليا بتفتح كل سنة عدد محدد من تصاريح العمل لغير الأوروبيين. صاحب العمل في إيطاليا هو اللي بيقدّم الطلب باسمك في المواعيد الرسمية، وبعد الموافقة تطلب التأشيرة من القنصلية الإيطالية. أي حد بيبيع لك "عقد إيطاليا مضمون" قبل كده، خلي بالك.'],
          ["Chaque année, l'Italie ouvre un nombre fixe de permis de travail pour les non-Européens. C'est l'employeur en Italie qui dépose la demande à votre nom aux dates officielles ; après l'accord, vous demandez le visa au consulat italien. Méfiez-vous de quiconque vend un « contrat garanti pour l'Italie »."],
          ['Each year Italy opens a fixed number of work permits for non-Europeans. The employer in Italy files the request in your name on the official dates; once approved, you apply for the visa at the Italian consulate. Be wary of anyone selling a "guaranteed Italy contract".']),
        links: [L(ITALY, 'وزارة الداخلية الإيطالية', "Ministère de l'Intérieur italien", 'Italian Ministry of the Interior')],
      },
      {
        h2: T('كندا وألمانيا: الهجرة بالمهارة', 'Canada et Allemagne : immigrer par les compétences', 'Canada and Germany: skills-based immigration'),
        paras: T(
          ['كندا: نظام الدخول السريع بيدّي نقاط على السن والتعليم واللغة والخبرة. إنشاء الملف على موقع الحكومة الكندية مجاني.', 'ألمانيا: بطاقة الفرص بتسمح لك تدخل تدوّر على شغل، بشرط مؤهل معترف بيه أو نقاط كافية، ومعاك مصاريف معيشتك.'],
          ["Canada : Entrée express attribue des points selon l'âge, les études, la langue et l'expérience. Créer son profil sur le site du gouvernement est gratuit.", "Allemagne : la carte d'opportunité (Chancenkarte) permet de venir chercher un emploi, avec un diplôme reconnu ou assez de points, et de quoi vivre pendant la recherche."],
          ['Canada: Express Entry scores you on age, education, language and experience. Creating the profile on the government site is free.', 'Germany: the Opportunity Card lets you come to look for work if you have a recognised qualification or enough points, plus money to live on while you search.']),
        links: [L(IRCC, 'الدخول السريع (الحكومة الكندية)', 'Entrée express (gouvernement du Canada)', 'Express Entry (Government of Canada)'), L(CHANCENKARTE, 'بطاقة الفرص الألمانية', "Carte d'opportunité (Make it in Germany)", 'Germany Opportunity Card (Make it in Germany)')],
      },
      {
        h2: T('قبل ما تدفع أي جنيه', 'Avant de payer quoi que ce soit', 'Before you pay anything'),
        bullets: T(
          ['اتأكد إن شركة التوظيف مرخّصة من وزارة العمل المصرية.', 'ما فيش حد يقدر يضمن لك فيزا أو عقد مقابل فلوس.', 'العقد لازم يكون باسم صاحب عمل حقيقي تقدر تتحقق منه.', 'ما تسلّمش جواز سفرك الأصلي لوسيط.'],
          ["Vérifiez que l'agence de recrutement est agréée par le ministère égyptien du Travail.", "Personne ne peut vous garantir un visa ou un contrat contre de l'argent.", 'Le contrat doit porter le nom d\'un vrai employeur que vous pouvez vérifier.', "Ne confiez jamais votre passeport original à un intermédiaire."],
          ['Check that the recruitment agency is licensed by the Egyptian Ministry of Labour.', 'Nobody can guarantee you a visa or a contract for money.', 'The contract must name a real employer you can verify.', 'Never hand your original passport to a middleman.']),
        links: [SCAM],
      },
    ],
    faq: [
      { q: T('عايز أسافر السعودية أشتغل، أعمل إيه؟', 'Je veux travailler en Arabie saoudite : par où commencer ?', 'I want to work in Saudi Arabia: where do I start?'),
        a: T('محتاج عقد من صاحب عمل سعودي هو اللي بيطلب لك التأشيرة. دوّر على وظائف معلنة في مهنتك، واتأكد من الشركة قبل ما توقّع. المساعد يقدر يدوّر لك على وظائف حقيقية حسب مهنتك.', "Il vous faut un contrat d'un employeur saoudien, qui demande le visa pour vous. Cherchez des offres publiées dans votre métier et vérifiez l'entreprise avant de signer. Le concierge peut chercher de vraies offres pour votre métier.", 'You need a contract from a Saudi employer, who applies for the visa. Look for published openings in your trade and check the company before signing. The concierge can search real openings for your trade.') },
      { q: T('عايز أسافر إيطاليا للشغل، فيه طريقة قانونية؟', "Je veux travailler en Italie : y a-t-il une voie légale ?", 'I want to work in Italy: is there a legal way?'),
        a: T('أيوه: نظام الحصص السنوية، بس صاحب العمل في إيطاليا هو اللي بيقدّم الطلب، والأماكن محدودة.', "Oui : les quotas annuels (decreto flussi), mais c'est l'employeur en Italie qui dépose la demande, et les places sont limitées.", 'Yes: the yearly quotas (decreto flussi), but the employer in Italy files the request, and places are limited.') },
      { q: T('عايز أهاجر كندا من مصر، أبدأ منين؟', "Je veux immigrer au Canada depuis l'Égypte : par où commencer ?", 'I want to immigrate to Canada from Egypt: where do I start?'),
        a: T('ابدأ باختبار لغة معتمد بالإنجليزي أو الفرنساوي، وتقييم شهادتك، وبعدها أنشئ ملف الدخول السريع مجانًا على موقع الحكومة الكندية.', "Commencez par un test de langue reconnu (anglais ou français) et l'évaluation de votre diplôme, puis créez gratuitement votre profil Entrée express sur le site du gouvernement.", 'Start with an approved English or French language test and an assessment of your degree, then create your Express Entry profile for free on the government site.') },
      { q: T('ينفع أسافر من غير فلوس؟', "Peut-on partir sans argent ?", 'Can I go abroad with no money?'),
        a: T('كل طريق فيه مصاريف (جواز، اختبارات، رسوم). أقرب طريق لميزانية قليلة غالبًا عقد عمل حقيقي أو منحة ممولة بالكامل. المساعد يدوّر لك على الاتنين.', "Chaque voie a des frais (passeport, tests, droits). Avec peu de moyens, le plus réaliste est souvent un vrai contrat de travail ou une bourse entièrement financée. Le concierge cherche les deux.", 'Every route has costs (passport, tests, fees). On a small budget the most realistic is usually a real job contract or a fully funded scholarship. The concierge searches both.') },
    ],
    ask: T('أنا من مصر وعايز أسافر أشتغل برّه. ساعدني أعرف الطريق المناسب لمهنتي.', "Je suis égyptien et je veux partir travailler à l'étranger. Aidez-moi à trouver la bonne voie pour mon métier.", "I'm from Egypt and want to work abroad. Help me find the right route for my trade."),
    note: T('ما بنوعدش بفيزا ولا بشغل: بنوريك الطرق الرسمية ونساعدك تمشي فيها صح.', 'Nous ne promettons ni visa ni emploi : nous montrons les voies officielles et vous aidons à les suivre correctement.', 'We promise no visa and no job: we show the official routes and help you follow them properly.'),
  },
  {
    slug: 'want-to-travel-abroad-levant',
    publishedAt: '2026-11-07',
    meta: {
      ar: { title: 'بدي سافر برّا البلد: كيف تطلع تشتغل أو تدرس بطريقة قانونية', description: 'بدك تسافر على ألمانيا أو تركيا أو دبي أو كندا؟ الطرق الرسمية من سوريا ولبنان والأردن وفلسطين، والأوراق، وكيف تتجنب النصب.' },
      fr: { title: "Partir travailler ou étudier à l'étranger depuis la Syrie, le Liban, la Jordanie ou la Palestine", description: "Allemagne, Turquie, Dubaï, Canada : les voies officielles, les documents et comment éviter les arnaques." },
      en: { title: 'Leaving Syria, Lebanon, Jordan or Palestine to Work or Study Abroad', description: 'Germany, Turkey, Dubai, Canada: the official routes, the documents, and how to avoid scams.' },
    },
    h1: T('بدي سافر برّا البلد: كيف تطلع تشتغل أو تدرس بطريقة قانونية', "Partir travailler ou étudier à l'étranger depuis le Levant", 'Leaving the Levant to Work or Study Abroad'),
    intro: T(
      'إذا عم تقول "بدي سافر"، أول سؤال: لشو؟ شغل، دراسة، أو إقامة دائمة. وثاني سؤال: شو جواز سفرك، لأن الشروط بتختلف حسب الجنسية. هون أهم الطرق مع مواقعها الرسمية.',
      "Si vous voulez partir, la première question est : pour quoi faire ? Travail, études ou installation durable. La seconde : quel passeport, car les règles changent selon la nationalité. Voici les principales voies et leurs sites officiels.",
      'If you want to leave, the first question is: for what? Work, study, or settling for good. The second: which passport, because the rules change with nationality. Here are the main routes and their official sites.'),
    sections: [
      {
        h2: T('ألمانيا: الشغل أو البحث عن شغل', "Allemagne : travailler ou chercher un emploi", 'Germany: work, or come to look for work'),
        paras: T(
          ['مع عرض عمل ومؤهل معترف فيه، فيك تطلب تأشيرة عامل ماهر. وبدون عرض، بطاقة الفرص بتسمح لك تجي تدوّر على شغل إذا عندك مؤهل معترف فيه أو نقاط كافية ومصاريف معيشتك.'],
          ["Avec une offre d'emploi et un diplôme reconnu, vous demandez un visa de travailleur qualifié. Sans offre, la carte d'opportunité permet de venir chercher un emploi avec un diplôme reconnu ou assez de points, et de quoi vivre."],
          ['With a job offer and a recognised qualification you apply for a skilled-worker visa. Without an offer, the Opportunity Card lets you come to look for work with a recognised qualification or enough points, plus money to live on.']),
        links: [L(CHANCENKARTE, 'بطاقة الفرص الألمانية', "Carte d'opportunité (Make it in Germany)", 'Germany Opportunity Card (Make it in Germany)')],
      },
      {
        h2: T('تركيا: السفر شي والشغل شي تاني', "Turquie : voyager n'est pas travailler", 'Turkey: visiting is not working'),
        paras: T(
          ['بعض الجنسيات بتقدر تطلب التأشيرة الإلكترونية من الموقع الرسمي فقط، وبعضها بيحتاج تأشيرة من السفارة. أما الشغل فبدّه إذن عمل بيطلبه صاحب العمل التركي، والتأشيرة السياحية ما بتسمح بالشغل.'],
          ["Certaines nationalités peuvent demander l'e-visa sur le site officiel uniquement ; d'autres ont besoin d'un visa de l'ambassade. Pour travailler, il faut un permis de travail demandé par l'employeur turc ; le visa touristique ne le permet pas."],
          ['Some nationalities can get the e-visa from the official site only; others need a visa from the embassy. To work you need a work permit requested by the Turkish employer; a tourist visa does not allow work.']),
        links: [L(TR_EVISA, 'التأشيرة الإلكترونية التركية (الموقع الرسمي)', 'e-Visa turc (site officiel)', 'Turkish e-Visa (official site)')],
      },
      {
        h2: T('دبي والإمارات والخليج', 'Dubaï, les Émirats et le Golfe', 'Dubai, the UAE and the Gulf'),
        paras: T(
          ['الشغل بالإمارات بيبدأ بعقد من صاحب عمل بيطلب لك إذن العمل والإقامة. انتبه من أي حدا بيبيعك "فيزا زيارة وبتلاقي شغل هونيك" بمبلغ كبير.'],
          ["Travailler aux Émirats commence par un contrat d'un employeur qui demande votre permis de travail et de séjour. Méfiez-vous de ceux qui vendent cher un « visa visite, tu trouveras sur place »."],
          ['Working in the UAE starts with a contract from an employer who applies for your work and residence permit. Be wary of anyone selling an expensive "visit visa, you will find work there".']),
        links: [L(MOHRE, 'وزارة الموارد البشرية والتوطين (الإمارات)', 'Ministère des Ressources humaines (Émirats)', 'UAE Ministry of Human Resources'), ...GULF.slice(1)],
      },
      {
        h2: T('كندا: الدخول السريع والدراسة', 'Canada : Entrée express et études', 'Canada: Express Entry and study'),
        paras: T(
          ['الدخول السريع بيعتمد على النقاط: السن، التعليم، اللغة، والخبرة. وفي كمان تأشيرة دراسة بتحتاج قبول من جامعة أو كلية معتمدة وإثبات قدرة مالية. والمنح بتخفف التكلفة.'],
          ["Entrée express repose sur des points : âge, études, langue, expérience. Il y a aussi le permis d'études, qui exige une admission dans un établissement reconnu et une preuve de moyens ; les bourses réduisent le coût."],
          ['Express Entry is points-based: age, education, language, experience. There is also the study permit, which needs an admission to a recognised school and proof of funds; scholarships reduce the cost.']),
        links: [L(IRCC, 'الدخول السريع (الحكومة الكندية)', 'Entrée express (gouvernement du Canada)', 'Express Entry (Government of Canada)'), L('/study-opportunities', 'برامج دراسية ومنح موثّقة', 'Programmes et bourses vérifiés', 'Verified study programs and scholarships')],
      },
    ],
    faq: [
      { q: T('بدي سافر على ألمانيا، شو لازمني؟', "Je veux aller en Allemagne : que me faut-il ?", 'I want to go to Germany: what do I need?'),
        a: T('مؤهل معترف فيه في ألمانيا، ولغة (ألماني أو إنجليزي حسب الطريق)، وإما عرض عمل أو بطاقة الفرص مع مصاريف معيشتك.', "Un diplôme reconnu en Allemagne, une langue (allemand ou anglais selon la voie), et soit une offre d'emploi, soit la carte d'opportunité avec de quoi vivre.", 'A qualification recognised in Germany, a language (German or English depending on the route), and either a job offer or the Opportunity Card plus money to live on.') },
      { q: T('بدي سافر على تركيا، بقدر اشتغل فيها؟', "Je veux aller en Turquie : puis-je y travailler ?", 'I want to go to Turkey: can I work there?'),
        a: T('بس بإذن عمل بيطلبه صاحب العمل. التأشيرة السياحية ما بتسمح بالشغل.', "Seulement avec un permis de travail demandé par l'employeur. Le visa touristique ne permet pas de travailler.", 'Only with a work permit requested by the employer. A tourist visa does not allow work.') },
      { q: T('بدي سافر على دبي، كيف بلاقي شغل؟', "Je veux aller à Dubaï : comment trouver un emploi ?", 'I want to go to Dubai: how do I find work?'),
        a: T('دوّر على وظائف معلنة بمهنتك وقدّم من بلدك، واتأكد من الشركة قبل ما تدفع أي شي. المساعد بيدوّر لك على وظائف حقيقية.', "Cherchez des offres publiées dans votre métier, postulez depuis chez vous et vérifiez l'entreprise avant de payer quoi que ce soit. Le concierge cherche de vraies offres.", 'Look for published openings in your trade, apply from home, and check the company before paying anything. The concierge searches real openings.') },
      { q: T('كيف بدي سافر على كندا؟', 'Comment partir au Canada ?', 'How do I get to Canada?'),
        a: T('أهم الطرق: الدخول السريع للعمال المهرة، أو الدراسة بقبول من جامعة معتمدة. كل الطلبات على موقع الحكومة الكندية.', "Les grandes voies : Entrée express pour les travailleurs qualifiés, ou les études avec une admission reconnue. Toutes les demandes se font sur le site du gouvernement.", 'The main routes: Express Entry for skilled workers, or study with an admission from a recognised school. Every application is on the government site.') },
    ],
    ask: T('بدي سافر برّا البلد لأشتغل أو أدرس. ساعدني أعرف شو الطريق المناسب إلي.', "Je veux partir à l'étranger pour travailler ou étudier. Aidez-moi à trouver la bonne voie pour moi.", 'I want to leave to work or study abroad. Help me find the right route for me.'),
    note: T('ما منوعد بفيزا ولا بشغل: منفرجيك الطرق الرسمية ومنساعدك تمشي فيها صح.', 'Nous ne promettons ni visa ni emploi : nous montrons les voies officielles et vous aidons à les suivre correctement.', 'We promise no visa and no job: we show the official routes and help you follow them properly.'),
  },
  {
    slug: 'want-to-travel-abroad',
    publishedAt: '2026-11-07',
    meta: {
      ar: { title: 'أريد أن أسافر: من أين أبدأ؟ دليل عملي للسفر والعمل والدراسة', description: 'أريد أسافر وما عندي فلوس؟ دولة حلوة ورخيصة؟ خطوات عملية: الهدف، الجواز والتأشيرة، الميزانية، والحماية من النصب. واسأل المساعد عن حالتك.' },
      fr: { title: "Je veux partir à l'étranger : par où commencer ?", description: "Peu de budget ? Quel pays choisir ? Les étapes concrètes : objectif, passeport et visa, budget et protection contre les arnaques." },
      en: { title: 'I Want to Travel Abroad: Where Do I Start?', description: 'Little money? Which country? The practical steps: your goal, passport and visa, budget, and staying safe from scams.' },
    },
    h1: T('أريد أن أسافر: من أين أبدأ؟', "Je veux partir à l'étranger : par où commencer ?", 'I Want to Travel Abroad: Where Do I Start?'),
    intro: T(
      'سواء كنت تقول "أريد أسافر" أو "ابغى أسافر" أو "بغيت نسافر"، الخطوات نفسها: حدّد الهدف، تأكد من الجواز والتأشيرة، احسب الميزانية، واحمِ نفسك من النصب.',
      "Que vous disiez « je veux voyager » ou « je veux partir », les étapes sont les mêmes : fixer l'objectif, vérifier passeport et visa, calculer le budget et vous protéger des arnaques.",
      'Whatever words you use, the steps are the same: set the goal, check your passport and visa, work out the budget, and protect yourself from scams.'),
    sections: [
      {
        h2: T('حدّد هدفك أولًا', "Fixez d'abord votre objectif", 'Decide your goal first'),
        bullets: T(
          ['سياحة أو زيارة: تأشيرة زيارة وتذكرة وحجز.', 'عمل: عقد من صاحب عمل حقيقي قبل السفر.', 'دراسة: قبول جامعي، ويفضّل منحة.', 'علاج: مركز يحدده طبيبك، ونحن نساعد في الترتيبات.'],
          ['Tourisme ou visite : visa visiteur, billet et réservation.', "Travail : un contrat d'un vrai employeur avant de partir.", 'Études : une admission, idéalement avec une bourse.', 'Soins : un centre indiqué par votre médecin ; nous aidons pour la logistique.'],
          ['Tourism or a visit: visitor visa, ticket and booking.', 'Work: a contract from a real employer before you leave.', 'Study: an admission, ideally with a scholarship.', 'Treatment: a centre your doctor names; we help with the logistics.']),
        links: [L('/study-opportunities', 'برامج دراسية ومنح موثّقة', 'Programmes et bourses vérifiés', 'Verified study programs and scholarships'), L('/medical-providers', 'مراكز علاج موثّقة', 'Centres de soins vérifiés', 'Verified medical providers')],
      },
      {
        h2: T('الجواز والتأشيرة', 'Passeport et visa', 'Passport and visa'),
        paras: T(
          ['الشروط تختلف حسب جنسيتك وليس حسب رغبتك. تحقق دائمًا من موقع السفارة أو البوابة الحكومية الرسمية للدولة التي تريدها، ولا تدفع رسوم تأشيرة لمواقع وسيطة تشبه الرسمية.'],
          ["Les règles dépendent de votre nationalité. Vérifiez toujours sur le site de l'ambassade ou le portail officiel du pays visé, et ne payez jamais de frais de visa sur des sites intermédiaires qui imitent les sites officiels."],
          ['The rules depend on your nationality. Always check the embassy site or the official government portal of the country you want, and never pay visa fees on look-alike intermediary sites.']),
      },
      {
        h2: T('الميزانية: إذا ما عندك فلوس كثير', "Le budget : si vous avez peu d'argent", 'Budget: if you do not have much money'),
        paras: T(
          ['أرخص الطرق عادة: منحة ممولة بالكامل، أو عقد عمل يغطي فيه صاحب العمل جزءًا من التكاليف. وللسفر القصير، قارن أسعار الطيران قبل الحجز.'],
          ["Les voies les moins chères sont souvent une bourse entièrement financée ou un contrat où l'employeur couvre une partie des frais. Pour un court voyage, comparez les vols avant de réserver."],
          ['The cheapest routes are usually a fully funded scholarship or a job contract where the employer covers part of the costs. For a short trip, compare flight prices before booking.']),
        links: [L('/flights', 'أرخص رحلات الطيران', 'Vols les moins chers', 'Cheapest flights'), L('/blog/scholarships-arab-students', 'منح دراسية للطلاب العرب', 'Bourses pour étudiants arabes', 'Scholarships for Arab students')],
      },
      {
        h2: T('احمِ نفسك من النصب', 'Protégez-vous des arnaques', 'Protect yourself from scams'),
        bullets: T(
          ['لا أحد يضمن تأشيرة مقابل مال.', 'لا تسلّم جوازك الأصلي لوسيط.', 'تحقق من الشركة أو المكتب قبل الدفع.'],
          ["Personne ne garantit un visa contre de l'argent.", "Ne confiez pas votre passeport original à un intermédiaire.", "Vérifiez l'entreprise ou le bureau avant de payer."],
          ['Nobody can guarantee a visa for money.', 'Do not hand your original passport to a middleman.', 'Check the company or office before paying.']),
        links: [SCAM, L('/blog/verify-immigration-consultant', 'كيف تتأكد من مستشار الهجرة', 'Vérifier un consultant en immigration', 'Verify an immigration consultant')],
      },
    ],
    faq: [
      { q: T('أريد أسافر وما عندي فلوس، شو الحل؟', "Je veux partir mais je n'ai pas d'argent : que faire ?", 'I want to travel but have no money: what can I do?'),
        a: T('ابدأ بالطرق التي يتحمل فيها طرف آخر جزءًا من التكلفة: منحة ممولة بالكامل أو عقد عمل حقيقي. المساعد يبحث لك عن الاثنين حسب وضعك.', "Commencez par les voies où quelqu'un d'autre paie une partie : bourse entièrement financée ou vrai contrat de travail. Le concierge cherche les deux selon votre situation.", 'Start with routes where someone else covers part of the cost: a fully funded scholarship or a real job contract. The concierge searches both for your situation.') },
      { q: T('ابي اسافر دولة حلوة ورخيصة، وين أروح؟', 'Quel pays beau et pas cher choisir ?', 'Which country is nice and cheap to visit?'),
        a: T('يعتمد على جوازك (أي دول تدخلها بسهولة) وعلى سعر الطيران من مدينتك. اكتب للمساعد جنسيتك ومدينتك وميزانيتك ليقارن لك.', "Cela dépend de votre passeport (les pays accessibles facilement) et du prix des vols depuis votre ville. Donnez au concierge votre nationalité, votre ville et votre budget pour comparer.", 'It depends on your passport (which countries are easy to enter) and on flight prices from your city. Give the concierge your nationality, city and budget to compare.') },
      { q: T('أريد أسافر إلى تركيا، شو أحتاج؟', 'Je veux aller en Turquie : que me faut-il ?', 'I want to go to Turkey: what do I need?'),
        a: T('حسب جنسيتك: بعض الجنسيات تدخل بدون تأشيرة، وبعضها يطلب التأشيرة الإلكترونية من الموقع الرسمي فقط، وبعضها يحتاج السفارة.', "Selon votre nationalité : certaines entrent sans visa, d'autres demandent l'e-visa sur le site officiel uniquement, d'autres passent par l'ambassade.", 'It depends on nationality: some enter visa-free, some get the e-visa from the official site only, some need the embassy.') },
    ],
    ask: T('أريد أن أسافر. هذه جنسيتي ومدينتي وهدفي: ساعدني أعرف من أين أبدأ.', "Je veux partir à l'étranger. Voici ma nationalité, ma ville et mon objectif : aidez-moi à savoir par où commencer.", 'I want to travel abroad. Here are my nationality, city and goal: help me know where to start.'),
    note: T('لا نَعِد بتأشيرة ولا بنتيجة مضمونة: نرشدك بخطوات حقيقية تناسب وضعك.', 'Nous ne promettons ni visa ni résultat garanti : nous vous guidons avec de vraies étapes adaptées à votre situation.', 'We promise no visa and no guaranteed outcome: we guide you with real steps that fit your situation.'),
  },
  {
    slug: 'want-to-immigrate',
    publishedAt: '2026-11-07',
    meta: {
      ar: { title: 'أريد أن أهاجر: الطرق القانونية إلى كندا وألمانيا وأستراليا وأمريكا وأوروبا', description: 'أريد أهاجر، من أين أبدأ؟ الطرق الرسمية للهجرة إلى كندا وألمانيا وأستراليا وأمريكا وبريطانيا وإيطاليا، وهل الهجرة ممكنة بدون لغة أو بدون مال.' },
      fr: { title: 'Je veux émigrer : les voies légales vers le Canada, l\'Allemagne, l\'Australie, les États-Unis et l\'Europe', description: "Par où commencer ? Les voies officielles d'immigration vers le Canada, l'Allemagne, l'Australie, les États-Unis, le Royaume-Uni et l'Italie, et ce qui est possible sans langue ou sans argent." },
      en: { title: 'I Want to Immigrate: Legal Routes to Canada, Germany, Australia, the US and Europe', description: 'Where to start? The official immigration routes to Canada, Germany, Australia, the US, the UK and Italy, and what is possible without a language or without money.' },
    },
    h1: T('أريد أن أهاجر: الطرق القانونية إلى كندا وألمانيا وأستراليا وأمريكا وأوروبا', 'Je veux émigrer : les voies légales', 'I Want to Immigrate: The Legal Routes'),
    intro: T(
      'الهجرة الدائمة لها طرق رسمية قليلة وواضحة، وكلها على مواقع حكومية. أي شخص يبيعك "هجرة مضمونة" يبيعك وهمًا. هذه أهم الطرق، وبعدها يساعدك المساعد تعرف أيها يناسبك.',
      "L'immigration durable passe par quelques voies officielles claires, toutes sur des sites gouvernementaux. Quiconque vend une « immigration garantie » vend du vent. Voici les principales ; le concierge vous aide ensuite à voir laquelle vous convient.",
      'Permanent immigration runs through a few clear official routes, all on government sites. Anyone selling a "guaranteed immigration" is selling nothing. Here are the main ones; the concierge then helps you see which fits you.'),
    sections: [
      {
        h2: T('كندا', 'Canada', 'Canada'),
        paras: T(
          ['الدخول السريع: نظام نقاط على السن والتعليم واللغة والخبرة. إنشاء الملف مجاني، والرسوم الحكومية تُدفع لاحقًا عند الدعوة. يحتاج اختبار لغة معتمد بالإنجليزية أو الفرنسية.'],
          ["Entrée express : un système de points (âge, études, langue, expérience). Créer le profil est gratuit ; les frais du gouvernement se paient après l'invitation. Un test de langue reconnu en anglais ou en français est exigé."],
          ['Express Entry: a points system (age, education, language, experience). Creating the profile is free; government fees are paid after an invitation. It requires an approved English or French language test.']),
        links: [L(IRCC, 'الدخول السريع (الحكومة الكندية)', 'Entrée express (gouvernement du Canada)', 'Express Entry (Government of Canada)'), L('/express-entry-draws', 'آخر سحوبات الدخول السريع', 'Derniers tirages Entrée express', 'Latest Express Entry draws')],
      },
      {
        h2: T('ألمانيا', 'Allemagne', 'Germany'),
        paras: T(
          ['تأشيرة العامل الماهر مع عرض عمل ومؤهل معترف به، أو بطاقة الفرص للبحث عن عمل داخل ألمانيا.'],
          ["Visa de travailleur qualifié avec une offre et un diplôme reconnu, ou carte d'opportunité pour chercher un emploi sur place."],
          ['Skilled-worker visa with a job offer and a recognised qualification, or the Opportunity Card to look for work in Germany.']),
        links: [L(CHANCENKARTE, 'بطاقة الفرص الألمانية', "Carte d'opportunité (Make it in Germany)", 'Germany Opportunity Card (Make it in Germany)')],
      },
      {
        h2: T('أستراليا وبريطانيا', 'Australie et Royaume-Uni', 'Australia and the UK'),
        paras: T(
          ['أستراليا: تقديم إبداء اهتمام عبر نظام سكيل سيليكت للمهن المطلوبة. بريطانيا: تأشيرة العامل الماهر تحتاج عرضًا من صاحب عمل مرخّص له بالكفالة.'],
          ["Australie : une déclaration d'intérêt dans SkillSelect pour les métiers recherchés. Royaume-Uni : le visa Skilled Worker exige une offre d'un employeur agréé comme parrain."],
          ['Australia: an expression of interest in SkillSelect for in-demand occupations. UK: the Skilled Worker visa needs an offer from an employer licensed to sponsor.']),
        links: [L(SKILLSELECT, 'سكيل سيليكت (الحكومة الأسترالية)', 'SkillSelect (gouvernement australien)', 'SkillSelect (Australian Government)'), L(UK_SKILLED, 'تأشيرة العامل الماهر (الحكومة البريطانية)', 'Visa Skilled Worker (gouvernement britannique)', 'Skilled Worker visa (UK Government)')],
      },
      {
        h2: T('أمريكا: قرعة الهجرة', 'États-Unis : la loterie de la carte verte', 'USA: the Diversity Visa lottery'),
        paras: T(
          ['التسجيل في القرعة مجاني وعلى الموقع الرسمي فقط. الأهلية تعتمد على بلد الميلاد وتتغير كل سنة، وتحتاج شهادة ثانوية أو خبرة عمل مؤهلة. أي موقع يطلب منك مالًا للتسجيل ليس رسميًا.'],
          ["L'inscription est gratuite et uniquement sur le site officiel. L'éligibilité dépend du pays de naissance et change chaque année ; il faut un diplôme de fin d'études secondaires ou une expérience de travail admissible. Tout site qui fait payer l'inscription n'est pas officiel."],
          ['Entry is free and only on the official site. Eligibility depends on country of birth and changes every year, and you need a high-school diploma or qualifying work experience. Any site charging to enter is not official.']),
        links: [L(DV, 'موقع قرعة الهجرة الرسمي', 'Site officiel de la loterie', 'Official Diversity Visa site')],
      },
      {
        h2: T('هل تمكن الهجرة بدون لغة أو بدون مال؟', 'Émigrer sans langue ou sans argent ?', 'Immigrating without a language or without money?'),
        paras: T(
          ['بصراحة: أغلب طرق الهجرة بالمهارة تطلب لغة أو تمنح نقاطًا عليها، وكثير منها يطلب إثبات قدرة مالية ما لم يكن معك عرض عمل. الطرق الأقرب لميزانية قليلة: عقد عمل حقيقي، أو منحة دراسية ممولة بالكامل.'],
          ["Franchement : la plupart des voies qualifiées exigent une langue ou la notent, et beaucoup demandent une preuve de moyens sauf avec une offre d'emploi. Avec peu de moyens, le plus réaliste reste un vrai contrat de travail ou une bourse entièrement financée."],
          ['Honestly: most skilled routes require a language or score it, and many ask for proof of funds unless you have a job offer. On a small budget, the most realistic remain a real job contract or a fully funded scholarship.']),
        links: [L('/blog/work-abroad-without-degree', 'السفر للعمل مهما كانت إمكانياتك', "Travailler à l'étranger, quels que soient vos moyens", 'Working abroad, whatever your means')],
      },
    ],
    faq: [
      { q: T('اريد اهاجر الى كندا مجانا، هل ممكن؟', 'Peut-on immigrer au Canada gratuitement ?', 'Can I immigrate to Canada for free?'),
        a: T('إنشاء ملف الدخول السريع مجاني، لكن هناك رسوم حكومية واختبار لغة لاحقًا. لا أحد يستطيع أن يبيعك تأشيرة مضمونة.', "Créer le profil Entrée express est gratuit, mais il y a ensuite des frais du gouvernement et un test de langue. Personne ne peut vous vendre un visa garanti.", 'Creating the Express Entry profile is free, but there are government fees and a language test later. Nobody can sell you a guaranteed visa.') },
      { q: T('اريد اهاجر من العراق، من وين أبدأ؟', "Je veux émigrer depuis l'Irak : par où commencer ?", 'I want to emigrate from Iraq: where do I start?'),
        a: T('نفس الطرق الرسمية متاحة، لكن الشروط تختلف حسب الجواز. ابدأ بتحديد مهنتك ومستوى لغتك، والمساعد يقارن لك الطرق المناسبة.', "Les mêmes voies officielles existent, mais les règles varient selon le passeport. Commencez par votre métier et votre niveau de langue ; le concierge compare les voies adaptées.", 'The same official routes exist, but rules vary by passport. Start with your trade and language level; the concierge compares the routes that fit.') },
      { q: T('اريد ان اهاجر الى اوروبا، أي دولة أسهل؟', "Je veux émigrer en Europe : quel pays est le plus simple ?", 'I want to immigrate to Europe: which country is easiest?'),
        a: T('لا توجد دولة "سهلة" للجميع: ألمانيا مناسبة لأصحاب المؤهلات المعترف بها، وإيطاليا وإسبانيا عبر عقود عمل. الأنسب يعتمد على مهنتك ولغتك.', "Aucun pays n'est « facile » pour tous : l'Allemagne convient aux diplômes reconnus, l'Italie et l'Espagne passent par des contrats de travail. Le meilleur choix dépend de votre métier et de votre langue.", 'No country is "easy" for everyone: Germany suits recognised qualifications, Italy and Spain go through job contracts. The best fit depends on your trade and language.') },
    ],
    ask: T('أريد أن أهاجر. ساعدني أعرف أي طريق قانوني يناسب مهنتي ولغتي.', "Je veux émigrer. Aidez-moi à trouver la voie légale adaptée à mon métier et à ma langue.", 'I want to immigrate. Help me find the legal route that fits my trade and language.'),
    note: T('لا نَعِد بهجرة ولا بتأشيرة: نرشدك إلى الطرق الرسمية ونساعدك على السير فيها.', "Nous ne promettons ni immigration ni visa : nous vous guidons vers les voies officielles et vous aidons à les suivre.", 'We promise no immigration and no visa: we point you to the official routes and help you follow them.'),
  },
];

module.exports = { ARTICLES };
