import React, { useState } from 'react';
import { 
  WifiOff, 
  Wifi, 
  DownloadCloud, 
  CheckCircle2, 
  Trash2, 
  HardDrive, 
  Zap, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  Play, 
  ExternalLink,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { Exam } from '../types/exam';
import { 
  downloadExamForOffline, 
  removeExamFromOffline, 
  isExamDownloaded, 
  getOfflineStorageSummary,
  calculateObjectSize
} from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';

interface OfflineGuideAndManagerProps {
  exams: Exam[];
  lang: 'am' | 'en';
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: (offline: boolean) => void;
  onStartExam: (exam: Exam, mode: 'exam' | 'practice') => void;
}

export const OfflineGuideAndManager: React.FC<OfflineGuideAndManagerProps> = ({
  exams,
  lang,
  isSimulatedOffline,
  setIsSimulatedOffline,
  onStartExam
}) => {
  const isAm = lang === 'am';
  const [, setRefreshKey] = useState(0);

  const handleDownload = (exam: Exam) => {
    downloadExamForOffline(exam);
    setRefreshKey(prev => prev + 1);
  };

  const handleRemove = (examId: string) => {
    removeExamFromOffline(examId);
    setRefreshKey(prev => prev + 1);
  };

  const storageSummary = getOfflineStorageSummary();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Recommendation Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isAm ? 'ለእርስዎ 100% ነጻ እና Offline የሆነው ምርጥ መፍትሔ' : '100% Free & Offline-First Recommended Architecture'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {isAm 
              ? 'GitHub Raw (ነጻ ማስተናገጃ) + IndexedDB (አንዴ አውርዶ በኦፍላይን መጠቀም)'
              : 'GitHub Raw (Zero-Cost Hosting) + IndexedDB Offline Caching'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed mb-6">
            {isAm 
              ? 'ጥያቄዎትን በትክክል መለሰናል፦ ተማሪዎች ፈተናውን አንዴ በኢንተርኔት ካወረዱ በኋላ ኢንተርኔቱን ሙሉ በሙሉ አጥፍተው በስልካቸው ወይም በኮምፒውተራቸው ላይ እንዲፈተኑ እና ለዚህም ምንም አይነት ወጪ (100% ነጻ) እንዳይኖርዎት ምርጡ አሰራር ይህ ነው።'
              : 'The optimal choice for your exact needs: host the raw JSON on GitHub Gist (100% free forever, no server cost), and let students download each exam once into local device storage for perpetual offline use.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                0$
              </div>
              <div>
                <div className="text-xs font-bold text-white">{isAm ? '100% ነጻ' : '100% Free'}</div>
                <div className="text-[11px] text-slate-400">{isAm ? 'ምንም ክፍያ ወይም የዳታቤዝ ወጪ የለም' : 'Zero hosting fees forever'}</div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{isAm ? 'ሙሉ በሙሉ Offline' : '100% Offline Ready'}</div>
                <div className="text-[11px] text-slate-400">{isAm ? 'አንዴ ካወረዱ በኋላ ኢንተርኔት አያስፈልግም' : 'Works without internet'}</div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                &lt;1M
              </div>
              <div>
                <div className="text-xs font-bold text-white">{isAm ? 'ቀላል የአፕ ሳይዝ' : 'Tiny App Size'}</div>
                <div className="text-[11px] text-slate-400">{isAm ? 'በቅጽበት Publish ያደርጋል' : 'Instant deployment'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Offline Testing Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">
                {isAm ? 'የኦፍላይን ፈተናዎች ማውረጃ እና መፈተኛ (Offline Hub)' : 'Offline Download & Testing Manager'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isAm 
                ? 'ከዚህ በታች ያሉትን ፈተናዎች አንዴ ያውርዱ፤ ከዚያ "የኦፍላይን ሁነታ (Offline Mode)" አብርተው ያለ ምንም ኢንተርኔት ፈተናውን ይሞክሩ!'
                : 'Download exams once, then toggle the simulated offline mode to test full functionality without an active connection.'}
            </p>
          </div>

          {/* Offline Mode Switcher */}
          <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              {isSimulatedOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span>{isAm ? 'ኦፍላይን ሁነታ:' : 'Offline Mode:'}</span>
            </span>
            <button
              onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isSimulatedOffline
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isSimulatedOffline ? (isAm ? 'በኦፍላይን ላይ ነው (ON)' : 'Active (OFFLINE)') : (isAm ? 'በኦንላይን ነው (OFF)' : 'Inactive (ONLINE)')}
            </button>
          </div>
        </div>

        {/* Storage stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-slate-950 rounded-xl border border-slate-800/80 my-4 text-xs">
          <div className="text-slate-300">
            {isAm ? 'በስልክዎ/ብሮውዘርዎ ላይ የተጫኑ ፈተናዎች፡ ' : 'Downloaded Exams on Device: '}
            <strong className="text-emerald-400">{storageSummary.count} {isAm ? 'ፈተናዎች' : 'Exams'}</strong>
          </div>
          <div className="text-slate-400 font-mono">
            {isAm ? 'የተያዘው ቦታ፡ ' : 'Storage Used: '}
            <strong className="text-white">{storageSummary.formattedSize}</strong>
          </div>
        </div>

        {/* Exams Download List */}
        <div className="space-y-3">
          {exams.map((exam) => {
            const downloaded = isExamDownloaded(exam.id);
            const sizeInfo = calculateObjectSize(exam);

            return (
              <div
                key={exam.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  downloaded
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">
                      {isAm ? exam.titleAm || exam.title : exam.title}
                    </span>
                    {downloaded ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {isAm ? 'በስልክ ላይ ተቀምጧል (Offline Ready)' : 'Downloaded'}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {isAm ? 'አልወረደም' : 'Not Downloaded'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {exam.questions.length} {isAm ? 'ጥያቄዎች' : 'Questions'} &bull; {exam.totalTimeMinutes} {isAm ? 'ደቂቃ' : 'mins'} &bull; {sizeInfo.formatted}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!downloaded ? (
                    <button
                      onClick={() => handleDownload(exam)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>{isAm ? 'ለ Offline አውርድ' : 'Download for Offline'}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onStartExam(exam, 'exam')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isAm ? 'በኦፍላይን ተፈተን' : 'Launch Offline Exam'}</span>
                      </button>
                      <button
                        onClick={() => handleRemove(exam.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title={isAm ? 'ከስልክ አጥፋ' : 'Remove from Offline'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Instructions: How to Set Up 100% Free Offline Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{isAm ? 'ይህን አሰራር እንዴት ደረጃ በደረጃ ተግባራዊ እንደሚያደርጉት' : 'How to Implement This 4-Step Architecture'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAm 
              ? 'ይህን ቀላል አሰራር በመጠቀም በሺህ የሚቆጠሩ ፈተናዎችን በነጻ ማስተናገድ ይችላሉ።'
              : 'Follow these 4 simple steps to host thousands of exams at 0 cost.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">1</span>
              <span>{isAm ? 'ጥያቄዎችን በ JSON ፋይል ማዘጋጀት' : 'Prepare Exams in JSON'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAm 
                ? 'በዚህ አፕ ውስጥ ያለውን "ጥያቄዎችን ከፋፍል (File Splitter)" በመጠቀም ትልቁን ፋይልዎን ወደ ትናንሽ ፈተናዎች (ምሳሌ፡ `grade12_math.json`) ቆራርጠው ያውርዱ።'
                : 'Use the built-in Question Splitter tab to break your heavy test banks into individual subject files.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">2</span>
              <span>{isAm ? 'በ GitHub Gist ላይ በነጻ መጫን' : 'Upload to GitHub Gist for Free'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAm 
                ? 'ወደ gist.github.com ይግቡ፤ የ .json ፋይሉን ለጥፈው "Create Public Gist" ይበሉ። ከዚያ "Raw" የሚለውን ተጭነው የሊንኩን አድራሻ (URL) ይውሰዱ። 100% ነጻ ነው!'
                : 'Create a free public Gist at gist.github.com. Click "Raw" to obtain the direct fetchable JSON link.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">3</span>
              <span>{isAm ? 'በአፑ ውስጥ በአንዲት መስመር ኮድ መጥራት' : 'Fetch on Download Click'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAm 
                ? 'ተማሪው "አውርድ" ሲል ብቻ አፑ በ `fetch(url)` ጥያቄዎቹን አምጥቶ በስልኩ IndexedDB / localStorage ውስጥ ያስቀምጣል።'
                : 'The app fetches the JSON over HTTP only when the student requests download, and stores it in device memory.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">4</span>
              <span>{isAm ? 'ተማሪው ሙሉ በሙሉ Offline ይጠቀማል' : '100% Offline Access'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAm 
                ? 'አንዴ ከተቀመጠ በኋላ ተማሪው ዳታ ሳያበራ ፈተናውን ይፈተናል፣ ሰዓቱ ይቆጥራል፣ ውጤቱንና ማብራሪያውን ያያል!'
                : 'Zero mobile data needed afterwards. The timer, answers, review, and scoring work smoothly offline.'}
            </p>
          </div>
        </div>

        {/* Copyable Client Cache Code */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>{isAm ? 'ለስልክዎ ወይም ለብሮውዘርዎ የሚሆን የኦፍላይን ኮድ ምሳሌ፡' : 'Complete TypeScript One-Time Offline Fetch & Cache Code:'}</span>
            </span>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <code>{`// 1. ፈተናውን አንዴ በነጻ ከ GitHub አውርዶ በስልኩ ማስቀመጥ (One-time Download)
async function downloadAndCacheExam(examId, githubRawUrl) {
  // ከ GitHub Raw JSON በነጻ ማውረድ
  const res = await fetch(githubRawUrl);
  const examData = await res.json();
  
  // በስልኩ / ብሮውዘሩ LocalStorage ወይም IndexedDB ውስጥ መመዝገብ
  localStorage.setItem(\`offline_exam_\${examId}\`, JSON.stringify(examData));
  alert('ፈተናው በስልክዎ ላይ ተቀምጧል! አሁን ኢንተርኔት አጥፍተው መፈተን ይችላሉ።');
}

// 2. በኦፍላይን ሁነታ ፈተናውን ማንበብ (ኢንተርኔት ሳያስፈልገው ይሰራል!)
function loadOfflineExam(examId) {
  const cached = localStorage.getItem(\`offline_exam_\${examId}\`);
  if (!cached) throw new Error('ይህ ፈተና እስካሁን አልወረደም፤ እባክዎ መጀመሪያ ያውርዱት');
  return JSON.parse(cached); // የፈተና ጥያቄዎች ዝርዝር
}`}</code>
          </pre>
        </div>
      </div>

      {/* PWA Mobile Install Card */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isAm ? 'አፑን በስልክዎ ስክሪን ላይ እንደ ሞባይል አፕ ይጫኑ (PWA)' : 'Install ExamPortal to Mobile Home Screen (PWA)'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAm 
                ? 'ልክ እንደ ተለመደው አንድሮይድ/አይፎን አፕሊኬሽን ያለ ብሮውዘር ባር ሙሉ ስክሪን ሆኖ በኦፍላይን ይከፈታል!'
                : 'Launches full-screen from mobile home screen and runs fully offline.'}
            </p>
          </div>
        </div>

        <div>
          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
