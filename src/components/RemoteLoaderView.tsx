import React, { useState } from 'react';
import { 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Code2,
  FileCheck,
  Zap
} from 'lucide-react';
import { calculateObjectSize } from '../utils/storage';

interface RemoteLoaderViewProps {
  lang: 'am' | 'en';
  onExamLoaded: (examData: any) => void;
}

export const RemoteLoaderView: React.FC<RemoteLoaderViewProps> = ({
  lang,
  onExamLoaded
}) => {
  const isAm = lang === 'am';
  const [urlInput, setUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [fetchedExam, setFetchedExam] = useState<any | null>(null);

  // Pre-configured remote examples
  const samplePresets = [
    {
      name: isAm ? 'የ12ኛ ክፍል ባዮሎጂ (Demo Raw JSON)' : 'Grade 12 Biology (Demo Raw JSON)',
      desc: isAm ? 'ከ GitHub Raw የሚመጣ የባዮሎጂ ፈተና ምሳሌ' : 'Biology exam served from remote raw JSON',
      data: {
        id: 'remote-biology-sample',
        title: 'Grade 12 Biology - Genetics & Molecular Biology',
        titleAm: 'የ12ኛ ክፍል ባዮሎጂ - ጄኔቲክስ እና ሴል ባዮሎጂ',
        category: 'matric',
        categoryLabelAm: '12ኛ ክፍል ማትሪክ',
        categoryLabelEn: 'Grade 12 Matric',
        description: 'Loaded remotely via HTTP request. Zero impact on app bundle size!',
        descriptionAm: 'ከደመና በ URL የተጫነ ፈተና። በአፑ መጠን ላይ ምንም ጭማሪ አያመጣም!',
        subject: 'Biology',
        year: '2024',
        totalTimeMinutes: 10,
        passPercentage: 50,
        source: 'remote',
        questions: [
          {
            id: 'b1',
            questionText: 'Which organelle is known as the powerhouse of the cell?',
            options: [
              { id: 'A', text: 'Nucleus' },
              { id: 'B', text: 'Mitochondria' },
              { id: 'C', text: 'Ribosome' },
              { id: 'D', text: 'Endoplasmic Reticulum' }
            ],
            correctAnswer: 'B',
            explanation: 'Mitochondria generates most of the chemical energy needed to power biochemical reactions (ATP).',
            difficulty: 'Easy'
          },
          {
            id: 'b2',
            questionText: 'During which phase of meiosis does crossing over occur?',
            options: [
              { id: 'A', text: 'Prophase I' },
              { id: 'B', text: 'Metaphase I' },
              { id: 'C', text: 'Anaphase II' },
              { id: 'D', text: 'Telophase I' }
            ],
            correctAnswer: 'A',
            explanation: 'Crossing over (homologous genetic recombination) takes place during Prophase I of Meiosis.',
            difficulty: 'Medium'
          },
          {
            id: 'b3',
            questionText: 'What is the complementary DNA base sequence for 5\'-AGCT-3\'?',
            options: [
              { id: 'A', text: '3\'-TCGA-5\'' },
              { id: 'B', text: '3\'-AGCT-5\'' },
              { id: 'C', text: '3\'-UCGA-5\'' },
              { id: 'D', text: '3\'-CCTA-5\'' }
            ],
            correctAnswer: 'A',
            explanation: 'Adenine pairs with Thymine (A-T), and Guanine pairs with Cytosine (G-C).',
            difficulty: 'Easy'
          }
        ]
      }
    },
    {
      name: isAm ? 'የሙያ ፈተና - IT & Programming' : 'COC / Tech Exam - Web Foundations',
      desc: isAm ? 'የኮምፒውተር ሳይንስ እና አይቲ የፈተና ጥያቄዎች' : 'Computer Science & Web foundations quiz',
      data: {
        id: 'remote-it-sample',
        title: 'IT & Software Development Foundations',
        titleAm: 'የአይቲ እና ሶፍትዌር ማበልጸግ የፈተና ጥያቄዎች',
        category: 'exit',
        categoryLabelAm: 'የሙያ ፈተና',
        categoryLabelEn: 'Professional Exam',
        description: 'Demonstrating remote JSON architecture for professional examinations.',
        descriptionAm: 'ያለ ምንም የአፕ ሳይዝ ጭማሪ በደመና የተጫነ ፈተና።',
        subject: 'Computer Science',
        year: '2024',
        totalTimeMinutes: 10,
        passPercentage: 60,
        source: 'remote',
        questions: [
          {
            id: 'it1',
            questionText: 'What is the primary advantage of storing exam data in a Cloud Database rather than in the app code?',
            options: [
              { id: 'A', text: 'App bundle size stays tiny and fast to publish' },
              { id: 'B', text: 'Questions can be updated without reinstalling the app' },
              { id: 'C', text: 'Allows dynamic pagination and search' },
              { id: 'D', text: 'All of the above' }
            ],
            correctAnswer: 'D',
            explanation: 'Cloud storage solves all three major scalability and deployment bottlenecks simultaneously.',
            difficulty: 'Easy'
          },
          {
            id: 'it2',
            questionText: 'In HTTP, which status code indicates a successful GET request?',
            options: [
              { id: 'A', text: '200 OK' },
              { id: 'B', text: '404 Not Found' },
              { id: 'C', text: '500 Server Error' },
              { id: 'D', text: '301 Moved Permanently' }
            ],
            correctAnswer: 'A',
            explanation: '200 OK indicates that the client request has succeeded and the server returned the requested resource.',
            difficulty: 'Easy'
          }
        ]
      }
    }
  ];

  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) {
      setErrorMsg(isAm ? 'እባክዎ የፈተናውን URL አድራሻ ያስገቡ' : 'Please provide a valid URL.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setFetchedExam(null);

    try {
      const response = await fetch(urlInput.trim());
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Normalize exam shape
      let questionsList = [];
      let title = 'Remote Exam';
      if (Array.isArray(data)) {
        questionsList = data;
      } else if (data.questions && Array.isArray(data.questions)) {
        questionsList = data.questions;
        title = data.title || title;
      } else {
        throw new Error('Could not find question list in response JSON');
      }

      const examObj = {
        id: data.id || `remote_${Date.now()}`,
        title: data.title || title,
        titleAm: data.titleAm || title,
        category: data.category || 'custom',
        categoryLabelAm: data.categoryLabelAm || 'የርቀት ፈተና',
        categoryLabelEn: data.categoryLabelEn || 'Remote Exam',
        description: data.description || 'Fetched live from remote source',
        descriptionAm: data.descriptionAm || 'ከኢንተርኔት በ URL የቀረበ ፈተና',
        subject: data.subject || 'General',
        year: data.year || '2024',
        totalTimeMinutes: data.totalTimeMinutes || 15,
        passPercentage: data.passPercentage || 50,
        source: 'remote',
        remoteUrl: urlInput.trim(),
        questions: questionsList.map((q: any, i: number) => ({
          id: q.id || `rq_${i}`,
          questionText: q.questionText || q.question || `Question ${i + 1}`,
          options: q.options || [
            { id: 'A', text: q.A || 'A' },
            { id: 'B', text: q.B || 'B' },
            { id: 'C', text: q.C || 'C' },
            { id: 'D', text: q.D || 'D' }
          ],
          correctAnswer: q.correctAnswer || q.answer || 'A',
          explanation: q.explanation || 'No explanation provided.',
          difficulty: q.difficulty || 'Medium'
        }))
      };

      setFetchedExam(examObj);
    } catch (err: any) {
      setErrorMsg(isAm 
        ? `ፈተናውን ከ URL ማምጣት አልተቻለም፡ ${err.message} (CORS ወይም ትክክለኛ ያልሆነ JSON ሊሆን ይችላል)`
        : `Failed to fetch exam: ${err.message}. Check CORS headers and valid JSON format.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: any) => {
    setFetchedExam(preset.data);
    setUrlInput(`https://api.examhub.et/v1/exams/${preset.data.id}.json (Simulated CDN)`);
    setErrorMsg('');
  };

  const sizeInfo = fetchedExam ? calculateObjectSize(fetchedExam) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="inline-flex items-center gap-2 text-sky-400 text-xs font-semibold px-2.5 py-1 bg-sky-500/10 rounded-full border border-sky-500/20 mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>{isAm ? 'የርቀት ፈተና መጫኛ' : 'Remote Exam Fetcher'}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
          {isAm ? 'ፈተናን ከማንኛውም URL ወይም API በቀጥታ ጫን' : 'Load Exam Live from Remote URL or Public API'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
          {isAm 
            ? 'ይህ ማሳያ ፈተናዎችን በ GitHub Raw፣ Cloud Storage ወይም በ Google Sheets ላይ ካስቀመጥን በኋላ በአፕልኬሽኑ ውስጥ በ 0 KB ጭማሪ እንዴት እንደሚሰሩ ያሳይዎታል።'
            : 'Demonstration of zero-bundle-size architecture: the web app stays lightweight, and exams are pulled on-the-fly via HTTP.'}
        </p>

        {/* Quick Presets */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            {isAm ? 'ወይም ከተዘጋጁት የርቀት ፈተናዎች አንዱን ይሞክሩ፡' : 'Or select a pre-configured remote exam:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {samplePresets.map((preset, i) => (
              <div
                key={i}
                onClick={() => handleSelectPreset(preset)}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-sky-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-xs text-white group-hover:text-sky-300 transition-colors">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {preset.desc}
                  </div>
                </div>
                <Zap className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Custom URL Input */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            {isAm ? 'የራስዎን የፈተና JSON URL እዚህ ያስገቡ፡' : 'Enter your remote JSON URL:'}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://raw.githubusercontent.com/.../exam.json"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
            />
            <button
              onClick={handleFetchFromUrl}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAm ? 'በመጫን ላይ...' : 'Fetching...'}</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>{isAm ? 'ፈተናውን አምጣ' : 'Fetch Exam'}</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fetched Preview */}
      {fetchedExam && (
        <div className="bg-slate-900 border border-sky-500/40 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                  <FileCheck className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-white">
                  {isAm ? fetchedExam.titleAm || fetchedExam.title : fetchedExam.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {isAm ? fetchedExam.descriptionAm || fetchedExam.description : fetchedExam.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium inline-block mb-1">
                ✓ {isAm ? 'በተሳካ ሁኔታ ተጭኗል' : 'Ready'}
              </span>
              <div className="text-[11px] text-slate-400 font-mono">
                {sizeInfo?.formatted} • {fetchedExam.questions?.length || 0} {isAm ? 'ጥያቄዎች' : 'Q'}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 my-4 text-center">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">{isAm ? 'የትምህርት አይነት' : 'Subject'}</div>
              <div className="text-xs font-bold text-white mt-0.5">{fetchedExam.subject || 'General'}</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">{isAm ? 'የተሰጠው ሰዓት' : 'Time'}</div>
              <div className="text-xs font-bold text-white mt-0.5">{fetchedExam.totalTimeMinutes} {isAm ? 'ደቂቃ' : 'Min'}</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">{isAm ? 'የአፑ ሳይዝ ጭማሪ' : 'App Bundle Impact'}</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">0 KB (Zero!)</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => onExamLoaded(fetchedExam)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-600/30"
            >
              <span>{isAm ? 'ይህን ፈተና አሁን ጀምር' : 'Launch This Exam Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
