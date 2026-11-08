import React, { useState } from 'react';
import { 
  STORAGE_SOLUTIONS, 
  WHY_SIZE_EXCEEDED 
} from '../data/storageGuides';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Layers, 
  Server, 
  HardDrive, 
  FileSpreadsheet, 
  Database, 
  Code, 
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface StorageGuideViewProps {
  lang: 'am' | 'en';
  onNavigateToSplitter: () => void;
  onNavigateToRemote: () => void;
  onNavigateToExams: () => void;
}

export const StorageGuideView: React.FC<StorageGuideViewProps> = ({
  lang,
  onNavigateToSplitter,
  onNavigateToRemote,
  onNavigateToExams
}) => {
  const isAm = lang === 'am';
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>('firebase-firestore');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedSolution = STORAGE_SOLUTIONS.find(s => s.id === selectedSolutionId) || STORAGE_SOLUTIONS[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Code': return <Code className="w-5 h-5 text-sky-400" />;
      case 'Cloud': return <HardDrive className="w-5 h-5 text-indigo-400" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      default: return <Server className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>{isAm ? 'የፈተና Size በዝቶ ለተቸገሩ ቀጥተኛ መፍትሔ' : 'Direct Fix for "Bundle Size Exceeded"'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            {isAm 
              ? 'ፈተናዎቹን የት እንዲቀመጡ ላርጋቸው? (የት ማስቀመጥ ይሻላል?)' 
              : 'Where should exam questions be stored to avoid size limits?'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed mb-6">
            {isAm 
              ? 'በመጀመሪያ አይዞዎ! ፈተናዎችን በኮዱ (JavaScript/TypeScript) ውስጥ በቀጥታ ስናስቀምጣቸው የአፑ መጠን ስለሚበዛ Publish ማድረግ አይቻልም። ትክክለኛው መንገድ ጥያቄዎቹን በደመና (Cloud DB / Storage / GitHub Gist) አስቀምጦ ተማሪው የፈለገውን ፈተና ብቻ በኢንተርኔት እንዲያወርድ ማድረግ ነው።'
              : 'Hardcoding thousands of questions inside the React source code creates massive bundles that fail deployment. The standard architectural fix is remote storage: keep the app small (<1MB) and load exams dynamically.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToSplitter}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/30"
            >
              <span>{isAm ? 'ጥያቄዎችዎን ቆራርጠው JSON ያውርዱ' : 'Split My Questions into Chunks'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToRemote}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-colors"
            >
              <span>{isAm ? 'የርቀት ፈተና በ URL ሞክሩ' : 'Try Loading from URL'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToExams}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-medium text-sm transition-colors"
            >
              <span>{isAm ? 'የተዘጋጁ ፈተናዎችን ይፈተኑ' : 'Take Demo Exams'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Comparison: Wrong vs Right Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Wrong Way */}
        <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-5 relative">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <span>{isAm ? 'የተሳሳተው መንገድ (Size የበዛበት ምክንያት)' : 'The Broken Approach (Causes Size Limit Error)'}</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            {isAm 
              ? 'ጥያቄዎችን፣ ስዕሎችን እና ጽሑፎችን በሙሉ በ App.tsx ወይም በ src/ ፎልደር ውስጥ እንደ ቋሚ ዳታ (Static Array) ማስቀመጥ።'
              : 'Pasting huge arrays of questions and Base64 images directly into JavaScript/React files.'}
          </p>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-red-900/30 text-xs text-slate-400 font-mono space-y-1">
            <div className="text-red-400 font-semibold">// src/all_questions.ts (85 MB - ❌ ይከሽፋል)</div>
            <div>const questions = [ {'{'} id: 1, text: &quot;...&quot;, img: &quot;data:image/png;base64...&quot; {'}'}, ...5,000 more ];</div>
            <div className="text-amber-400 text-[11px] pt-1 font-sans">
              ⚠️ {isAm ? 'ውጤት፡ የኮዱ መጠን ከደመናው ገደብ (Cloud Limit) በላይ ሆኖ Publish ማረግ አይቻልም!' : 'Result: Deploy fails due to container / memory size caps.'}
            </div>
          </div>
        </div>

        {/* Right Way */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-5 relative">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{isAm ? 'ትክክለኛው መንገድ (The Scalable Solution)' : 'The Recommended Architecture'}</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            {isAm 
              ? 'አፕልኬሽኑን ባዶ የፈተና መፈተኛ አድርጎ ማስቀረት (<500 KB)፤ ጥያቄዎችን በ Cloud Database ወይም በ JSON URL ማስቀመጥ።'
              : 'Keep the app tiny and load only the selected exam over HTTP fetch or Firebase Firestore query.'}
          </p>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-900/30 text-xs text-slate-400 font-mono space-y-1">
            <div className="text-emerald-400 font-semibold">// App.tsx (250 KB ብቻ - ✅ በፍጥነት Publish ያረጋል)</div>
            <div>const exam = await fetch(&quot;https://.../exams/grade12_math.json&quot;);</div>
            <div className="text-emerald-400 text-[11px] pt-1 font-sans">
              ✨ {isAm ? 'ውጤት፡ አፑ በ 1 ሰከንድ ውስጥ Publish ያደርጋል፤ በሚሊዮን ጥያቄዎች ቢኖሩትም ችግር የለውም!' : 'Result: App deploys in seconds, supports millions of questions!'}
            </div>
          </div>
        </div>
      </div>

      {/* Why Size Exceeded Breakdown */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span>{isAm ? WHY_SIZE_EXCEEDED.titleAm : WHY_SIZE_EXCEEDED.titleEn}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WHY_SIZE_EXCEEDED.reasons.map((r, i) => (
            <div key={i} className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-slate-200 text-sm mb-2">
                  {isAm ? r.causeAm : r.causeEn}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAm ? r.detailAm : r.detailEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-xs text-emerald-300">
          <strong>💡 {isAm ? 'ዋናው ማጠቃለያ፡ ' : 'Core Takeaway: '}</strong>
          {isAm ? WHY_SIZE_EXCEEDED.solutionsSummaryAm : WHY_SIZE_EXCEEDED.solutionsSummaryEn}
        </div>
      </div>

      {/* Solutions Selection Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isAm ? 'ጥያቄዎችን ለማስቀመጥ 4ቱ ምርጥ አማራጮች (ይምረጡ)' : '4 Best Places to Store Your Exam Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAm 
              ? 'እንደ ፍላጎትዎ እና እንደ ቴክኒካል ደረጃዎ አንዱን ይምረጡ፤ ዝርዝር አሰራሩ እና ዝግጁ ኮድ ከስር ተቀምጧል።' 
              : 'Choose the option that fits your skill level and tech stack. Copy the ready-made code below.'}
          </p>
        </div>

        {/* Option Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {STORAGE_SOLUTIONS.map((sol) => {
            const isSelected = sol.id === selectedSolutionId;
            return (
              <button
                key={sol.id}
                onClick={() => setSelectedSolutionId(sol.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      {getIcon(sol.iconName)}
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {isAm ? sol.difficultyAm : sol.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1">
                    {isAm ? sol.nameAm : sol.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {isAm ? sol.recommendedForAm : sol.recommendedFor}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
                  {isAm ? sol.costAm : sol.cost}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Solution Detail Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  {getIcon(selectedSolution.iconName)}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {isAm ? selectedSolution.nameAm : selectedSolution.name}
                </h3>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                {isAm ? selectedSolution.recommendedForAm : selectedSolution.recommendedFor}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                💰 {isAm ? selectedSolution.costAm : selectedSolution.cost}
              </span>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300">
                ⚙️ {isAm ? `ደረጃ: ${selectedSolution.difficultyAm}` : `Level: ${selectedSolution.difficulty}`}
              </span>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAm ? 'ጥቅሞቹ (Advantages)' : 'Pros'}</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {(isAm ? selectedSolution.prosAm : selectedSolution.pros).map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{isAm ? 'ሊታወቁ የሚገባቸው ነገሮች (Things to consider)' : 'Limitations'}</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {(isAm ? selectedSolution.consAm : selectedSolution.cons).map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">
              📋 {isAm ? 'አሰራሩ ደረጃ በደረጃ (Step-by-Step Setup):' : 'Step-by-Step Instructions:'}
            </h4>
            <div className="space-y-2">
              {(isAm ? selectedSolution.stepsAm : selectedSolution.steps).map((step, i) => (
                <div key={i} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs text-slate-200">
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippet with Copy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 font-mono">
                {isAm ? 'የኮድ ምሳሌ (Ready to use code):' : 'Code Example:'}
              </span>
              <button
                onClick={() => handleCopy(selectedSolution.codeSnippet)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAm ? 'ተቀድቷል!' : 'Copied!') : (isAm ? 'ኮድ ቅዳ' : 'Copy Code')}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
              <code>{selectedSolution.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
