import React, { useState } from 'react';
import { 
  Mail, 
  Link2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  FileSpreadsheet, 
  Code2, 
  Github, 
  Sparkles,
  DownloadCloud,
  FileJson,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { Exam } from '../types/exam';
import { downloadExamForOffline, calculateObjectSize } from '../utils/storage';

interface CrossAccountConnectorViewProps {
  lang: 'am' | 'en';
  onExamConnected: (exam: Exam) => void;
  onNavigateToOffline: () => void;
}

export const CrossAccountConnectorView: React.FC<CrossAccountConnectorViewProps> = ({
  lang,
  onExamConnected,
  onNavigateToOffline
}) => {
  const isAm = lang === 'am';

  const [activeMethod, setActiveMethod] = useState<'aistudio_github' | 'copy' | 'github' | 'sheets'>('aistudio_github');
  const [urlInput, setUrlInput] = useState<string>('');
  const [sheetIdInput, setSheetIdInput] = useState<string>('');
  const [pastedJsonInput, setPastedJsonInput] = useState<string>('');
  const [examTitleInput, setExamTitleInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successExam, setSuccessExam] = useState<Exam | null>(null);
  const [copiedText, setCopiedText] = useState<string>('');
  const [githubTestStatus, setGithubTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Method 1: Connect by Pasting JSON directly from other email project
  const handleConnectPastedJson = () => {
    setErrorMsg('');
    setSuccessExam(null);

    if (!pastedJsonInput.trim()) {
      setErrorMsg(isAm ? 'እባክዎ መጀመሪያ ከሌላው ኢሜይል የቀዱትን የጥያቄዎች ኮድ (JSON) እዚህ ይለጥፉ' : 'Please paste the JSON questions from your other account.');
      return;
    }

    try {
      const parsed = JSON.parse(pastedJsonInput.trim());
      let questionsList = [];
      let title = examTitleInput.trim() || (isAm ? 'ከሌላ Email የመጣ ፈተና' : 'Exam from Other Account');

      if (Array.isArray(parsed)) {
        questionsList = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        questionsList = parsed.questions;
        title = parsed.title || title;
      } else {
        throw new Error('የጥያቄዎች ዝርዝር (Array) ማግኘት አልተቻለም');
      }

      const formattedQuestions = questionsList.map((q: any, i: number) => ({
        id: q.id || `ext_${Date.now()}_${i}`,
        questionText: q.questionText || q.question || q.text || `Question ${i + 1}`,
        options: q.options || [
          { id: 'A', text: q.A || q.a || q.optionA || 'A' },
          { id: 'B', text: q.B || q.b || q.optionB || 'B' },
          { id: 'C', text: q.C || q.c || q.optionC || 'C' },
          { id: 'D', text: q.D || q.d || q.optionD || 'D' }
        ],
        correctAnswer: (q.correctAnswer || q.answer || q.correct || 'A').toString().trim().toUpperCase(),
        explanation: q.explanation || q.reason || 'ማብራሪያ አልተካተተም',
        difficulty: q.difficulty || 'Medium',
        subject: q.subject || 'General'
      }));

      const newExam: Exam = {
        id: `connected_${Date.now()}`,
        title,
        titleAm: title,
        category: 'custom',
        categoryLabelAm: 'ከሌላ Email የተገናኘ',
        categoryLabelEn: 'Cross-Email Exam',
        description: `Imported from another email account on ${new Date().toLocaleDateString()}`,
        descriptionAm: `ከሌላ ኢሜይል በቀጥታ ተገናኝቶ በስልክ ላይ የተጫነ ፈተና`,
        subject: 'General',
        year: '2024',
        totalTimeMinutes: Math.max(10, Math.ceil(formattedQuestions.length * 1.5)),
        passPercentage: 50,
        source: 'custom',
        questions: formattedQuestions
      };

      downloadExamForOffline(newExam);
      setSuccessExam(newExam);
      onExamConnected(newExam);
    } catch (e: any) {
      setErrorMsg(isAm 
        ? `የተሳሳተ JSON ቅርጽ ነው። እባክዎ በትክክል መቅዳትዎን ያረጋግጡ (${e.message})`
        : `Invalid JSON syntax: ${e.message}`);
    }
  };

  // Method 2: Connect from GitHub Raw URL
  const handleConnectUrl = async () => {
    setErrorMsg('');
    setSuccessExam(null);

    if (!urlInput.trim()) {
      setErrorMsg(isAm ? 'እባክዎ የ GitHub Raw URL አድራሻ ያስገቡ' : 'Please provide the GitHub Raw URL.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(urlInput.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();

      let questionsList = [];
      let title = examTitleInput.trim() || data.title || (isAm ? 'ከ GitHub Raw የተገናኘ ፈተና' : 'Exam from GitHub Raw');

      if (Array.isArray(data)) {
        questionsList = data;
      } else if (data.questions && Array.isArray(data.questions)) {
        questionsList = data.questions;
      } else {
        throw new Error('JSON format is unrecognized');
      }

      const formattedQuestions = questionsList.map((q: any, i: number) => ({
        id: q.id || `git_${i}`,
        questionText: q.questionText || q.question || `Question ${i + 1}`,
        options: q.options || [
          { id: 'A', text: q.A || 'A' },
          { id: 'B', text: q.B || 'B' },
          { id: 'C', text: q.C || 'C' },
          { id: 'D', text: q.D || 'D' }
        ],
        correctAnswer: (q.correctAnswer || q.answer || 'A').toString().trim().toUpperCase(),
        explanation: q.explanation || 'No explanation',
        difficulty: q.difficulty || 'Medium'
      }));

      const newExam: Exam = {
        id: `git_exam_${Date.now()}`,
        title,
        titleAm: title,
        category: 'custom',
        categoryLabelAm: 'ከ GitHub የተገናኘ',
        categoryLabelEn: 'GitHub Raw Exam',
        description: 'Hosted on GitHub Gist, synced to local device memory',
        descriptionAm: 'በ GitHub Gist ላይ ተቀምጦ ወደ ስልክ የወረደ ፈተና',
        subject: data.subject || 'General',
        year: data.year || '2024',
        totalTimeMinutes: data.totalTimeMinutes || 15,
        passPercentage: data.passPercentage || 50,
        source: 'remote',
        remoteUrl: urlInput.trim(),
        questions: formattedQuestions
      };

      downloadExamForOffline(newExam);
      setSuccessExam(newExam);
      onExamConnected(newExam);
    } catch (e: any) {
      setErrorMsg(isAm 
        ? `ፈተናውን ማምጣት አልተቻለም። ሊንኩ "Raw" መሆኑን እና Public መሆኑን ያረጋግጡ፡ ${e.message}`
        : `Failed to fetch: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo sample JSON to test copy-paste instantly
  const handleLoadSampleFromOtherEmail = () => {
    const demo = [
      {
        questionText: "Which layer of the atmosphere contains the ozone layer that protects Earth from harmful UV rays?",
        options: [
          { id: "A", text: "Troposphere" },
          { id: "B", text: "Stratosphere" },
          { id: "C", text: "Mesosphere" },
          { id: "D", text: "Thermosphere" }
        ],
        correctAnswer: "B",
        explanation: "The ozone layer is primarily found in the lower portion of the stratosphere (ከ 15 እስከ 35 ኪ.ሜ ከፍታ ላይ በስትራቶስፊየር ውስጥ ይገኛል)።"
      },
      {
        questionText: "In Ethiopian Commercial Law, which business organization requires a minimum of two persons and has limited liability?",
        options: [
          { id: "A", text: "Sole Proprietorship" },
          { id: "B", text: "Private Limited Company (PLC / ኃ.የተ.የግ.ማ)" },
          { id: "C", text: "General Partnership" },
          { id: "D", text: "Joint Venture" }
        ],
        correctAnswer: "B",
        explanation: "A Private Limited Company (PLC / ኃላፊነቱ የተወሰነ የግል ማህበር) can be formed by a minimum of 2 and maximum of 50 members with limited liability."
      }
    ];
    setPastedJsonInput(JSON.stringify(demo, null, 2));
    setExamTitleInput(isAm ? 'የ12ኛ ክፍል ናሙና ፈተና (ከሌላ Email)' : 'Sample Exam (From Other Email)');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Reassurance Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 border border-sky-500/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold mb-3">
            <Mail className="w-4 h-4 text-sky-400" />
            <span>{isAm ? 'በሌላ Email ለተሰራ ፈተና ቀጥተኛ ማገናኛ' : 'Connecting Questions from Another Email'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {isAm 
              ? 'ፈተናዎቹ በሌላ Email ላይ ቢሆኑም እንዴት በቀላሉ ማገናኘት ይቻላል?'
              : 'How to Connect Questions Created on a Different Email'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed mb-6">
            {isAm 
              ? 'በጣም ጥሩ ዜና አለልዎት፦ ኢሜይሉ የተለያየ ቢሆንም ምንም ችግር የለውም! ምክንያቱም ፈተናዎቹን በደመና (GitHub Gist) ወይም በቀላል Copy-Paste በማድረግ ወደዚህ አፕልኬሽን በ 1 ደቂቃ ውስጥ ማምጣትና በስልክዎ ላይ በኦፍላይን ማስቀመጥ ይችላሉ።'
              : 'Different emails are never an obstacle. You can migrate your questions via direct copy-paste, a public GitHub Gist link, or a shared Google Sheet in under 60 seconds.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveMethod('aistudio_github')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeMethod === 'aistudio_github'
                  ? 'bg-emerald-600/20 border-emerald-500 shadow-md ring-1 ring-emerald-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAm ? 'AI Studio እና GitHub ግንኙነት' : 'AI Studio & GitHub Sync'}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isAm ? 'ምን ማድረግ እንዳለብዎት ዝርዝር መመሪያ' : 'Step-by-step setup guide'}
              </div>
            </button>

            <button
              onClick={() => setActiveMethod('copy')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeMethod === 'copy'
                  ? 'bg-sky-600/20 border-sky-500 shadow-md ring-1 ring-sky-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>{isAm ? 'ዘዴ 1፡ በቀጥታ ኮፒ አድርጎ መለጠፍ' : 'Method 1: Direct Copy-Paste'}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isAm ? 'በጣም ፈጣኑ መንገድ (10 ሰከንድ)' : 'Fastest & zero-setup method'}
              </div>
            </button>

            <button
              onClick={() => setActiveMethod('github')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeMethod === 'github'
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isAm ? 'ዘዴ 2፡ በ GitHub Gist ሊንክ' : 'Method 2: GitHub Gist Link'}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isAm ? '100% ነጻ እና በማንኛውም ኢሜይል ይሰራል' : '100% Free with URL sync'}
              </div>
            </button>

            <button
              onClick={() => setActiveMethod('sheets')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeMethod === 'sheets'
                  ? 'bg-teal-600/20 border-teal-500 shadow-md ring-1 ring-teal-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                <span>{isAm ? 'ዘዴ 3፡ በ Google Sheets' : 'Method 3: Google Sheets Link'}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isAm ? 'ጥያቄዎቹ በ Sheet ላይ ከሆኑ' : 'Share link with read-access'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* AI STUDIO & GITHUB CONNECTION DETAILED GUIDE */}
      {activeMethod === 'aistudio_github' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-2">
              <Github className="w-3.5 h-3.5" />
              <span>{isAm ? 'AI Studio እና GitHub ቀጥተኛ ግንኙነት' : 'AI Studio & GitHub Direct Integration'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAm ? 'AI Studio እና GitHub እንዴት ነው የሚገናኙት? ምን ማረግ አለብኝ?' : 'How do Google AI Studio and GitHub connect?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {isAm 
                ? 'AI Studio እና GitHub በሁለት መንገድ ይገናኛሉ፦ አንደኛው የኮዱን ፋይል ወደ GitHub ለመላክ ሲሆን፤ ሁለተኛውና ለእርስዎ ዋናው መፍትሔ ደግሞ የፈተና ጥያቄዎችን በ GitHub Gist ላይ አስቀምጦ በ AI Studio አፕ ውስጥ ያለ ሳይዝ ጭማሪ በነጻ መጥራት ነው።'
                : 'Google AI Studio and GitHub interact in two primary ways: exporting code repositories, and hosting external question data to keep app bundle sizes lightweight.'}
            </p>
          </div>

          {/* Two Connection Methods Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Connection Way A: Code Export */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center text-xs">1</span>
                  <span>{isAm ? 'አፑን ከ AI Studio ወደ GitHub መላክ (Export)' : 'Export AI Studio App to GitHub'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {isAm 
                    ? 'የሰራችሁትን የአፕልኬሽን ኮድ በሙሉ GitHub ላይ በ Repository መልክ ለማስቀመጥ፦' 
                    : 'To push your entire AI Studio codebase into a personal GitHub repo:'}
                </p>
                <div className="space-y-2 text-xs text-slate-400 font-sans">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong>ደረጃ 1፦</strong> በ AI Studio ስክሪን ከላይ በቀኝ በኩል ያለውን <strong>Share</strong> ወይም <strong>GitHub Icon</strong> ይጫኑ።
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong>ደረጃ 2፦</strong> <strong>"Authorize Google AI Studio"</strong> የሚል ሲመጣ የ GitHub አካውንትዎን Login አድርገው ይፍቀዱለት።
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong>ደረጃ 3፦</strong> <strong>"Create Repository"</strong> ሲሉት ሙሉው ኮድ GitHub ላይ ይቀመጣል።
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Way B: Exam Questions Storage (Solves the Size Problem) */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
                  <span>{isAm ? 'ፈተናዎችን GitHub ላይ አስቀምጦ በ AI Studio መጥራት (የ Size መፍትሔ)' : 'Host Exam Bank on GitHub Gist'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {isAm 
                    ? 'አፑ "Size በዝቶ" እንዳያስቸግር ጥያቄዎቹን በ GitHub ላይ በነጻ አስቀምጦ በ AI Studio አፕ ውስጥ መጥራት፦' 
                    : 'The golden solution for the size limit: store the question JSON in GitHub Gist and fetch dynamically.'}
                </p>
                <div className="space-y-2 text-xs text-slate-300 font-sans">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                    <strong>ደረጃ 1፦</strong> ወደ <strong>gist.github.com</strong> ይሂዱ፤ ጥያቄዎችዎን ለጥፈው <strong>"Create Public Gist"</strong> ይበሉ።
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                    <strong>ደረጃ 2፦</strong> <strong>"Raw"</strong> የሚለውን ተጭነው የሊንኩን አድራሻ ይቅዱ።
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                    <strong>ደረጃ 3፦</strong> በ AI Studio ኮድ ውስጥ <code>fetch(rawUrl)</code> ሲያደርጉ አፑ ጥያቄውን ከ GitHub ያመጣዋል!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live GitHub Connection Tester */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-400" />
              <span>{isAm ? 'የ GitHub ግንኙነትን እዚህ በቀጥታ ይሞክሩ (Connection Tester)' : 'Test AI Studio to GitHub Link'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAm 
                ? 'የ GitHub Gist ወይም ማንኛውንም የ GitHub Raw JSON ሊንክ እዚህ ሳጥን ውስጥ አስገብተው "ግንኙነቱን ፈትሽ" የሚለውን ይጫኑ፦' 
                : 'Paste any GitHub Gist Raw URL to verify that AI Studio can fetch and download questions from it:'}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://gist.githubusercontent.com/.../raw/exam.json"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                onClick={handleConnectUrl}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shrink-0 shadow-md shadow-emerald-600/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAm ? 'በመፈተሽ ላይ...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAm ? 'ግንኙነቱን ፈትሽና አውርድ' : 'Verify & Fetch'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span>{isAm ? 'የሙከራ ሊንክ ይፈልጋሉ?' : 'Need a demo link?'}</span>
              <button
                onClick={() => {
                  setUrlInput('https://api.github.com/zen');
                  alert(isAm ? 'GitHub ከ AI Studio ጋር በ API መገናኘት ይችላል። ለፈተናዎች ግን gist.github.com ላይ የለጠፉትን የ Raw ሊንክ ይጠቀሙ።' : 'AI Studio can communicate with GitHub APIs.');
                }}
                className="text-emerald-400 underline hover:text-emerald-300 font-mono"
              >
                GitHub API Status Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* METHOD 1: Direct Copy-Paste from the other project */}
      {activeMethod === 'copy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Copy className="w-5 h-5 text-sky-400" />
                <span>{isAm ? 'ዘዴ 1፦ ከሌላው Email ኮዱን ኮፒ አድርገው እዚህ ይለጥፉ' : 'Method 1: Direct Copy from Other Email Project'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isAm 
                  ? 'በሌላኛው Email የነበረውን ፕሮጀክት ይክፈቱ፤ የጥያቄዎቹን JSON ኮፒ አድርገው እዚህ ሲለጥፉ አፑ ወዲያውኑ በስልክዎ ላይ በኦፍላይን ያስቀምጠዋል!'
                  : 'Open the old project, copy the questions array, and paste here to store permanently in local device memory.'}
              </p>
            </div>

            <button
              onClick={handleLoadSampleFromOtherEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAm ? 'የሙከራ ናሙና ለጥፍ' : 'Paste Sample Data'}</span>
            </button>
          </div>

          {/* Step Guide */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-sky-400">📋 {isAm ? 'እንዴት እንደሚቀዱ (Steps):' : 'How to copy:'}</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
              <li>{isAm ? 'በሌላኛው Email ላይ ወዳለው ፕሮጀክት ይግቡ።' : 'Open the project in your other Google account.'}</li>
              <li>{isAm ? 'የፈተና ጥያቄዎቹ ያሉበትን ፋይል (ወይም JSON) ይክፈቱና ኮዱን Copy (Ctrl+C) ያድርጉ።' : 'Copy the questions array or JSON content.'}</li>
              <li>{isAm ? 'እዚህ ሳጥን ውስጥ Paste (Ctrl+V) ያድርጉና "አገናኝና በስልክ አስቀምጥ" የሚለውን ይጫኑ።' : 'Paste here and click "Connect & Cache Offline".'}</li>
            </ol>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isAm ? 'የፈተናው ስም (Title):' : 'Exam Title:'}
              </label>
              <input
                type="text"
                value={examTitleInput}
                onChange={(e) => setExamTitleInput(e.target.value)}
                placeholder={isAm ? 'ምሳሌ፡ የ12ኛ ክፍል ማትሪክ - ፊዚክስ 2016' : 'e.g., Grade 12 Physics Final Exam'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isAm ? 'የጥያቄዎቹን JSON ኮድ እዚህ ይለጥፉ፡' : 'Paste the Questions JSON here:'}
              </label>
              <textarea
                value={pastedJsonInput}
                onChange={(e) => setPastedJsonInput(e.target.value)}
                rows={7}
                placeholder='[ { "questionText": "ጥያቄ...", "options": [...], "correctAnswer": "A", "explanation": "ማብራሪያ..." } ]'
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleConnectPastedJson}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md shadow-sky-600/30"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>{isAm ? 'አገናኝና በስልክ ላይ ለ Offline አስቀምጥ' : 'Connect & Cache for Offline'}</span>
            </button>
          </div>
        </div>
      )}

      {/* METHOD 2: GitHub Gist URL from ANY account */}
      {activeMethod === 'github' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-indigo-400" />
              <span>{isAm ? 'ዘዴ 2፦ በ GitHub Gist ሊንክ (በማንኛውም Email ይሰራል)' : 'Method 2: Connect via GitHub Gist URL'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isAm 
                ? 'GitHub ላይ በአዲሱም ሆነ በቀድሞው ኢሜይል መግባት ይችላሉ። የኢሜይል መመሳሰል አያስፈልገውም! Gist ላይ የጫኑትን ፈተና በ URL በቀጥታ ያገናኛል።'
                : 'GitHub Gist is email-agnostic. Host your JSON under any email account, and fetch the raw link from anywhere.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-indigo-400">💡 {isAm ? 'ቀላል አሰራር፡' : 'How it works:'}</span>
              <p>
                1. በ <strong>gist.github.com</strong> ላይ ፋይሉን ይለጥፉና <strong>"Create Public Gist"</strong> ይበሉ።<br />
                2. <strong>"Raw"</strong> የሚለውን ተጭነው የሊንኩን አድራሻ ይቅዱ (ምሳሌ፡ <code>https://gist.githubusercontent.com/.../raw/exam.json</code>)።<br />
                3. ያንን ሊንክ እዚህ ስር ይለጥፉ፤ አፑ በቅጽበት አገናኝቶ በስልክዎ ላይ በኦፍላይን ያስቀምጠዋል!
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isAm ? 'የ GitHub Raw JSON URL ሊንክ እዚህ ያስገቡ፡' : 'Enter GitHub Raw JSON URL:'}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://gist.githubusercontent.com/.../raw/exam.json"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  onClick={handleConnectUrl}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAm ? 'በማገናኘት ላይ...' : 'Connecting...'}</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      <span>{isAm ? 'አገናኝና አውርድ' : 'Sync & Save'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* METHOD 3: Google Sheets Share from Other Email */}
      {activeMethod === 'sheets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>{isAm ? 'ዘዴ 3፦ ጥያቄዎቹ በሌላው Email Google Drive / Sheets ውስጥ ከሆኑ' : 'Method 3: Shared Google Sheet from Other Email'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isAm 
                ? 'በሌላኛው Email የከፈቱትን Google Sheet ፋይል ለዚህኛው Email ወይም "Anyone with the link can view" አድርገው ማጋራት (Share) ይችላሉ።'
                : 'Share the Google Sheet from your other email with link sharing enabled, allowing any client to pull questions.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
              <span className="font-bold text-emerald-400">📌 {isAm ? 'የማጋሪያ ደረጃዎች (Sharing Steps):' : 'Sharing Steps:'}</span>
              <div className="space-y-1.5 pl-2">
                <div><strong>1.</strong> በሌላኛው Email ላይ ሆነው Google Sheetዎን ይክፈቱ።</div>
                <div><strong>2.</strong> ከላይ በቀኝ በኩል <strong>"Share"</strong> የሚለውን ይጫኑ።</div>
                <div><strong>3.</strong> <strong>"General access"</strong> የሚለውን <strong>"Anyone with the link can view" (ሊንኩ ያለው ማንኛውም ሰው ማየት ይችላል)</strong> ይምረጡ።</div>
                <div><strong>4.</strong> <strong>File &gt; Share &gt; "Publish to web"</strong> የሚለውን ተጭነው በ CSV መልክ ሊንኩን ይውሰዱ ወይም በቀጥታ አውርደው (Download as CSV) በዚህ አፕ ላይ ይጫኑት።</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-300">
              💡 {isAm 
                ? 'በተጨማሪም በ Google Sheets ላይ File > Download > Comma Separated Values (.csv) አድርገው አውርደው በ "File Splitter" ገጽ ላይ በቀጥታ መጫን ይችላሉ!'
                : 'Tip: You can also click File > Download > CSV (.csv) in Google Sheets and drop it into the Splitter tab!'}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successExam && (
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAm ? 'ፈተናው በተሳካ ሁኔታ ተገናኝቶ በስልክዎ ላይ ተቀምጧል!' : 'Exam Connected & Cached Successfully!'}
              </h3>
              <p className="text-xs text-emerald-300 mt-0.5">
                {isAm 
                  ? `"${successExam.title}" (${successExam.questions.length} ጥያቄዎች) አሁን ያለ ምንም ኢንተርኔት (Offline) ለመፈተን ዝግጁ ነው።`
                  : `"${successExam.title}" (${successExam.questions.length} questions) is now ready for offline practice.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToOffline}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/30"
            >
              <span>{isAm ? 'ወደ ኦፍላይን ፈተና ማዕከል ሂድ' : 'Go to Offline Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
