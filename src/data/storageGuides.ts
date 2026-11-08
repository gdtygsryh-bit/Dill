import { StorageArchitecture } from '../types/exam';

export const STORAGE_SOLUTIONS: StorageArchitecture[] = [
  {
    id: 'firebase-firestore',
    name: 'Firebase Firestore / Cloud Database',
    nameAm: 'ፋየርቤዝ ፋይርስቶር (Firebase Firestore)',
    recommendedFor: 'Best for dynamic apps, user progress tracking, and live quiz updates without rebuilding.',
    recommendedForAm: 'ፈተናዎችን በቀላሉ በየክፍሉ ለመለየት፣ የተማሪዎችን ውጤት ለመመዝገብ እና አዳዲስ ፈተናዎችን አፑን ደግሞ ሳይጭኑ (Rebuild ሳያደርጉ) ለመጨመር ምርጡ መንገድ።',
    cost: 'Free tier available (50,000 reads/day free)',
    costAm: 'ነጻ ደረጃ አለው (በቀን እስከ 50,000 ንባብ ነጻ)',
    difficulty: 'Easy',
    difficultyAm: 'ቀላል',
    pros: [
      'App bundle size stays tiny (<1MB)',
      'Add or update questions anytime without republishing the app',
      'Load only 1 exam or 20 questions at a time (pagination)',
      'Built-in offline support on mobile and web'
    ],
    prosAm: [
      'የአፑ መጠን (Bundle Size) በጣም ትንሽ (<1MB) ሆኖ ይቀራል',
      'አፑን ደግመው ሳያሳትሙ (Publish ሳያደርጉ) በማንኛውም ሰዓት አዳዲስ ጥያቄዎችን መጨመር ይቻላል',
      'ተማሪው የከፈተውን ፈተና ብቻ (ወይም 20 ጥያቄዎችን ብቻ) ይጭናል (Lazy loading)',
      'የተጠቃሚ ውጤት እና Login በቀላሉ ማገናኘት ይቻላል'
    ],
    cons: [
      'Requires internet on first load to cache data',
      'Needs basic Firebase project setup'
    ],
    consAm: [
      'ለመጀመሪያ ጊዜ ጥያቄውን ለማምጣት የኢንተርኔት ግንኙነት ይፈልጋል',
      'ቀላል የFirebase project ማዘጋጀት ይጠይቃል'
    ],
    steps: [
      '1. Create a free Firebase project at console.firebase.google.com',
      '2. Create a collection named "exams" or "questions"',
      '3. In your app, import only the questions for the chosen subject using `getDocs()` or `onSnapshot()`',
      '4. Keep image files in Cloud Storage or Imgur, save only URLs in the question object'
    ],
    stepsAm: [
      '1. በ console.firebase.google.com ነጻ የFirebase ፕሮጀክት ይክፈቱ',
      '2. "exams" ወይም "questions" የሚል Collection ይፍጠሩ',
      '3. በአፕልኬሽኑ ውስጥ ተማሪው የፈለገውን ትምህርት ብቻ `getDocs()` በማድረግ አምጡ',
      '4. የጥያቄ ስዕሎችን (images) በ Cloud Storage ወይም Imgur አስቀምጠው የሊንኩን አድራሻ (URL) ብቻ በዳታቤዝ ያስቀምጡ'
    ],
    codeSnippet: `// 1. ጥያቄዎችን በ Firebase ውስጥ ማስቀመጫ እና ማምጫ ኮድ
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const db = getFirestore(app);

// ተማሪው የመረጠውን የፈተና ጥያቄ ብቻ ከደመና ማምጣት (Bundle Size አይጨምርም!)
export async function fetchExamQuestions(subjectId, year) {
  const q = query(
    collection(db, 'questions'),
    where('subject', '==', subjectId),
    where('year', '==', year)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}`,
    codeLang: 'typescript',
    iconName: 'Database'
  },
  {
    id: 'github-raw-gist',
    name: 'GitHub Gist / GitHub Raw (100% Free & Simplest)',
    nameAm: 'ጊትሃብ ጂስት ወይም ሮው ፋይል (GitHub Gist / Raw JSON)',
    recommendedFor: 'Completely free, no database setup required, perfect for static question banks.',
    recommendedForAm: 'ምንም አይነት ዳታቤዝ ማዋቀር ለማይፈልጉ፣ 100% ነጻ እና በቀላሉ JSON ፋይሎችን በኢንተርኔት ለማስተናገድ።',
    cost: '100% Free Forever',
    costAm: '100% ነጻ ለዘለዓለም',
    difficulty: 'Easy',
    difficultyAm: 'ቀላል',
    pros: [
      'Zero backend or database configuration required',
      'Host thousands of exams without paying a cent',
      'Simple `fetch(url)` retrieves questions on demand',
      'Can edit questions directly on GitHub from your phone or PC'
    ],
    prosAm: [
      'ምንም ሰርቨር ወይም ዳታቤዝ ኮንፊገሬሽን አያስፈልገውም',
      'በሺህ የሚቆጠሩ ፈተናዎችን በነጻ ማስተናገድ ይችላሉ',
      'በቀላል `fetch(url)` ፈተናውን በደቂቃ ውስጥ ይጭናል',
      'ጥያቄ ላይ ስህተት ቢኖር ከስልክዎ ወይም ከኮምፒውተርዎ በቀጥታ ጊትሃብ ላይ ማረም ይቻላል'
    ],
    cons: [
      'Anyone with the raw URL can read the JSON file',
      'Not suitable if questions must be strictly confidential before test'
    ],
    consAm: [
      'ሊንኩን ያገኘ ሰው የጥያቄውን JSON ፋይል ማንበብ ይችላል',
      'ጥያቄዎቹ እጅግ ሚስጥራዊ ከሆኑ ተስማሚ አይደለም'
    ],
    steps: [
      '1. Create a GitHub Gist at gist.github.com or a public GitHub repository',
      '2. Save your exam as JSON (e.g., `grade12_math_2016.json`)',
      '3. Click "Raw" to get the raw URL (e.g. `https://raw.githubusercontent.com/...`)',
      '4. In your app, use `fetch(rawUrl).then(res => res.json())` when the user selects that exam'
    ],
    stepsAm: [
      '1. በ gist.github.com ወይም GitHub ላይ የፈተናውን JSON ፋይል ያስቀምጡ',
      '2. እያንዳንዱን የፈተና አይነት ለየብቻ ፋይል ያድርጉ (ምሳሌ፡ `grade12_biology.json`)',
      '3. "Raw" የሚለውን ቁልፍ ተጭነው የሊንኩን አድራሻ ይቅዱ',
      '4. በአፕልኬሽንዎ ውስጥ ተማሪው ፈተና ሲመርጥ በ `fetch(url)` ጥያቄዎቹን በቀላሉ ይጫኑ'
    ],
    codeSnippet: `// 2. ከ GitHub Raw / Gist ፈተና በ URL የመጫን ኮድ
export async function loadExamFromUrl(examUrl) {
  try {
    const response = await fetch(examUrl);
    if (!response.ok) throw new Error('ፈተናውን ማምጣት አልተቻለም');
    const questions = await response.json();
    return questions; // የፈተና ጥያቄዎች ዝርዝር
  } catch (err) {
    console.error('Error fetching exam:', err);
    throw err;
  }
}

// ምሳሌ አጠቃቀም:
// const math2016 = await loadExamFromUrl('https://raw.githubusercontent.com/user/exams/main/math_2016.json');`,
    codeLang: 'typescript',
    iconName: 'Code'
  },
  {
    id: 'cloud-storage-cdn',
    name: 'Cloud Storage (Google Cloud Storage / Supabase / AWS S3)',
    nameAm: 'ክላውድ ስቶሬጅ (Google Cloud Storage / Supabase Storage)',
    recommendedFor: 'Large question banks with lots of diagrams, formulas, and audio files.',
    recommendedForAm: 'ብዙ ስዕላዊ መግለጫዎች፣ የፊዚክስ/ሂሳብ ፎርሙላዎች ወይም የድምፅ ፈተናዎች ላሏቸው ትላልቅ የጥያቄ ባንኮች።',
    cost: 'Free tier available (5GB free storage)',
    costAm: 'ነጻ ደረጃ አለው (እስከ 5GB ነጻ ማከማቻ)',
    difficulty: 'Medium',
    difficultyAm: 'መካከለኛ',
    pros: [
      'Unlimited storage capacity for millions of questions',
      'Fast global CDN delivery',
      'Secure public or signed private URL access',
      'Keeps app bundle under 500 KB'
    ],
    prosAm: [
      'ለሚሊዮኖች ጥያቄዎች በቂ ያልተገደበ የማከማቻ ቦታ',
      'በጣም ፈጣን የፈተና ማውረጃ ፍጥነት (CDN)',
      'የአፑን መጠን ከ 500 KB በታች ያደርገዋል',
      'ስዕሎች እና የፈተና ፋይሎች ተመቻችተው ይቀመጣሉ'
    ],
    cons: [
      'Requires cloud account configuration'
    ],
    consAm: [
      'የክላውድ አካውንት መክፈትና ማስተካከል ይጠይቃል'
    ],
    steps: [
      '1. Open Google Cloud Console or Supabase dashboard',
      '2. Create a storage bucket called `exam-assets`',
      '3. Upload exam files in folder structure: `/grade12/math/2016.json`',
      '4. App downloads and caches the file in IndexedDB for 100% offline access'
    ],
    stepsAm: [
      '1. Google Cloud ወይም Supabase Dashboard ይክፈቱ',
      '2. `exam-assets` የሚል ባኬት (Bucket) ይፍጠሩ',
      '3. ፈተናዎቹን በፎልደር አደራጅተው ይጫኑ፡ `/grade12/chemistry/2016.json`',
      '4. አፕልኬሽኑ ተማሪው አንዴ ሲያወርድ በስልኩ ወይም በብሮውዘሩ IndexedDB ውስጥ እንዲቀመጥ ያደርጋል'
    ],
    codeSnippet: `// 3. ከ Cloud Storage አውርዶ በስልኩ (IndexedDB) በነጻ የማስቀመጫ ስልት
async function getExamWithOfflineCache(examId, storageUrl) {
  // 1. መጀመሪያ በስልኩ/ብሮውዘሩ ውስጥ መቀመጡን ማረጋገጥ
  const cached = await getLocalExam(examId);
  if (cached) return cached;

  // 2. ከሌለ ከ Cloud Storage ማውረድ
  const res = await fetch(storageUrl);
  const data = await res.json();

  // 3. ለቀጣይ ጊዜ ኦፍላይን እንዲሰራ ማከማቸት
  await saveLocalExam(examId, data);
  return data;
}`,
    codeLang: 'typescript',
    iconName: 'Cloud'
  },
  {
    id: 'google-sheets-api',
    name: 'Google Sheets as Database (No-Code Friendly)',
    nameAm: 'ጉግል ሺትስ እንደ ዳታቤዝ (Google Sheets API)',
    recommendedFor: 'Teachers and non-programmers who want to type questions in Excel/Sheets.',
    recommendedForAm: 'ጥያቄዎችን በቀላሉ በ Excel ወይም Google Sheets ውስጥ መጻፍ ለሚፈልጉ መምህራን እና ፈታኞች።',
    cost: '100% Free',
    costAm: '100% ነጻ',
    difficulty: 'Easy',
    difficultyAm: 'ቀላል',
    pros: [
      'Super easy to enter questions in table columns: Question, A, B, C, D, Answer, Explanation',
      'Multiple teachers can collaborate on the same sheet',
      'Real-time updates without touching the app code',
      'Exportable to CSV/JSON anytime'
    ],
    prosAm: [
      'ጥያቄዎችን ልክ እንደ ኤክሴል ሰንጠረዥ ለመጻፍ እጅግ በጣም አመቺ (ጥያቄ, ሀ, ለ, ሐ, መ, መልስ)',
      'ብዙ መምህራን በአንድ ጊዜ በአንድ ሺት ላይ ጥያቄ ማዘጋጀት ይችላሉ',
      'የአፑን ኮድ ሳትነኩ በሺት ላይ አዳዲስ ጥያቄዎችን መጨመር',
      'በማንኛውም ጊዜ ወደ JSON መቀየር ይቻላል'
    ],
    cons: [
      'Not suited for extremely high traffic (quota limits)',
      'Slightly slower than dedicated databases'
    ],
    consAm: [
      'በጣም ከፍተኛ የተጠቃሚ ብዛት ሲኖር የጉግል ገደብ (Quota) ሊኖር ይችላል',
      'ከተለየ ዳታቤዝ አንጻር መጠነኛ የፍጥነት ልዩነት አለው'
    ],
    steps: [
      '1. Create a Google Sheet with columns: Question, OptionA, OptionB, OptionC, OptionD, Correct, Explanation',
      '2. File > Share > "Anyone with the link can view"',
      '3. File > Share > "Publish to web" as CSV or JSON',
      '4. In the app, fetch the public sheet CSV or use Google Sheets API'
    ],
    stepsAm: [
      '1. በ Google Sheet ላይ ዓምዶችን ያዘጋጁ፡ ጥያቄ, ምርጫ ሀ, ምርጫ ለ, ምርጫ ሐ, ምርጫ መ, ትክክለኛ መልስ, ማብራሪያ',
      '2. Share አድርገው "Anyone with the link can view" ይምረጡ',
      '3. File > Share > "Publish to web" የሚለውን ተጭነው የCSV ሊንኩን ይውሰዱ',
      '4. አፕልኬሽኑ ሊንኩን አንብቦ በቀጥታ የፈተና ጥያቄ ያደርገዋል'
    ],
    codeSnippet: `// 4. ከ Google Sheets በቀጥታ የፈተና ጥያቄዎችን የማንበቢያ ቀላል ኮድ
export async function fetchGoogleSheetExam(sheetId) {
  const url = \`https://docs.google.com/spreadsheets/d/\${sheetId}/gviz/tq?tqx=out:json\`;
  const res = await fetch(url);
  const text = await res.text();
  // Google visualization JSON wrapper ማስተካከል
  const json = JSON.parse(text.substr(47).slice(0, -2));
  return json.table.rows.map(r => ({
    question: r.c[0]?.v,
    options: [r.c[1]?.v, r.c[2]?.v, r.c[3]?.v, r.c[4]?.v],
    answer: r.c[5]?.v,
    explanation: r.c[6]?.v
  }));
}`,
    codeLang: 'javascript',
    iconName: 'FileSpreadsheet'
  }
];

export const WHY_SIZE_EXCEEDED = {
  titleAm: 'ለምንድነው አፑ "Size በዝቶ" ያልታተመው (Publish ያላደረገው)?',
  titleEn: 'Why did your App exceed the size limit during publish?',
  reasons: [
    {
      causeAm: '1. በሺህ የሚቆጠሩ ጥያቄዎችን በኮዱ (JavaScript/TypeScript) ውስጥ በቀጥታ ማስቀመጥ',
      causeEn: '1. Hardcoding massive question arrays directly in source code',
      detailAm: 'ጥያቄዎቹን በ App.tsx ወይም በ src/ ፎልደር ውስጥ እንደ ትልቅ Array ስናስቀምጣቸው የኮምፓይለሩ ፋይል (JavaScript bundle) ከ 20MB በላይ ይሆንና ሆስቲንጉ ወይም ፕላትፎርሙ ውድቅ ያደርገዋል።',
      detailEn: 'Bundling large JSONs into Vite/Webpack output creates multi-megabyte bundle chunks that exceed Cloud Run and web host upload caps.'
    },
    {
      causeAm: '2. ስዕሎችን እንደ Base64 ጽሑፍ በኮድ ውስጥ ማስቀመጥ',
      causeEn: '2. Storing images as Base64 strings inside JSON',
      detailAm: 'ስዕሎችን ወደ Base64 string ስንቀይር የፋይሉ መጠን በ 33% ያድጋል። 100 ስዕሎች ብቻ የኮዱን መጠን ከ 150MB በላይ ሊያደርጉት ይችላሉ።',
      detailEn: 'Base64 strings expand image size by 33%. A few dozen diagrams quickly inflate the project past git and build thresholds.'
    },
    {
      causeAm: '3. ሁሉንም የትምህርት አይነቶች በአንድ ፋይል ማጨቅ',
      causeEn: '3. Storing all grades and subjects in a single mega file',
      detailAm: 'የ12ኛ ክፍል፣ የ11ኛ ክፍል፣ ፊዚክስ፣ ኬሚስትሪ፣ ሂሳብ ሁሉንም በአንድ ትልቅ ፋይል ውስጥ ማስቀመጥ።',
      detailEn: 'Loading all subjects and years simultaneously instead of on-demand chunking.'
    }
  ],
  solutionsSummaryAm: 'መፍትሔው፡ አፕልኬሽኑ የፈተና ማሳያ (UI Interface) ብቻ ሆኖ እንዲቆይ ማድረግ ሲሆን፤ ጥያቄዎቹን በደመና (Cloud Database, GitHub Raw, ወይም Cloud Storage) ማስቀመጥ ነው። ተማሪው ፈተና ሲመርጥ ጥያቄው በኢንተርኔት ይወርዳል!',
  solutionsSummaryEn: 'The Golden Rule: Keep your web app strictly as a sleek user interface (<1MB). Store questions remotely in Cloud DB or CDN, and fetch only the active exam on demand!'
};
