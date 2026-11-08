import React, { useState } from 'react';
import { 
  Scissors, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  FolderArchive
} from 'lucide-react';
import { calculateObjectSize, splitQuestionBank } from '../utils/storage';

interface QuestionSplitterViewProps {
  lang: 'am' | 'en';
  onLoadAsExam: (questions: any[], title: string) => void;
}

export const QuestionSplitterView: React.FC<QuestionSplitterViewProps> = ({
  lang,
  onLoadAsExam
}) => {
  const isAm = lang === 'am';
  const [jsonInput, setJsonInput] = useState<string>('');
  const [chunkSize, setChunkSize] = useState<number>(25);
  const [splitResult, setSplitResult] = useState<Record<string, any[]> | null>(null);
  const [selectedChunkKey, setSelectedChunkKey] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string>('');

  // Sample heavy demo data
  const handleLoadDemoHeavyData = () => {
    const mockList = [];
    const subjects = ['Mathematics', 'Physics', 'English', 'Biology', 'Chemistry'];
    for (let i = 1; i <= 60; i++) {
      const subj = subjects[i % subjects.length];
      mockList.push({
        id: `q_${i}`,
        questionText: `Sample question #${i} for Ethiopian Matric & Exit Exam evaluation in ${subj}?`,
        subject: subj,
        options: [
          { id: 'A', text: `Option A for question #${i}` },
          { id: 'B', text: `Option B for question #${i}` },
          { id: 'C', text: `Option C for question #${i}` },
          { id: 'D', text: `Option D for question #${i}` }
        ],
        correctAnswer: ['A', 'B', 'C', 'D'][i % 4],
        explanation: `Detailed explanation for question #${i} in ${subj}. Correct formula applied.`,
        year: '2016'
      });
    }
    const jsonStr = JSON.stringify(mockList, null, 2);
    setJsonInput(jsonStr);
    setErrorMsg('');
    processSplit(jsonStr, chunkSize);
  };

  const processSplit = (rawJson: string, size: number) => {
    try {
      if (!rawJson.trim()) {
        setErrorMsg(isAm ? 'እባክዎ መጀመሪያ የጥያቄዎችዎን JSON ጽሑፍ ያስገቡ' : 'Please paste your JSON text first.');
        setSplitResult(null);
        return;
      }
      const parsed = JSON.parse(rawJson);
      let list: any[] = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        list = parsed.questions;
      } else {
        throw new Error('JSON array not found');
      }

      if (list.length === 0) {
        throw new Error('No questions found in array');
      }

      const chunks = splitQuestionBank(list, size);
      setSplitResult(chunks);
      const firstKey = Object.keys(chunks)[0] || '';
      setSelectedChunkKey(firstKey);
      setErrorMsg('');
    } catch (e: any) {
      setErrorMsg(isAm 
        ? 'የተሳሳተ የ JSON ቅርጽ ነው። እባክዎ ትክክለኛ JSON መሆኑን ያረጋግጡ (Syntax error)' 
        : 'Invalid JSON format. Please ensure valid JSON array syntax: ' + e.message);
      setSplitResult(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      processSplit(content, chunkSize);
    };
    reader.readAsText(file);
  };

  const handleCopyChunk = (key: string, data: any[]) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleDownloadChunk = (key: string, data: any[]) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_${key}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRawSize = jsonInput ? calculateObjectSize(jsonInput) : { bytes: 0, formatted: '0 B' };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-2">
              <Scissors className="w-3.5 h-3.5" />
              <span>{isAm ? 'የፈተና ፋይል መክፈያ እና ማቅለያ' : 'Exam Bank Chunk Splitter'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAm ? 'ትልቁን የጥያቄ ፋይል ወደ ትናንሽ ፋይሎች ከፋፍል' : 'Split Heavy Exam Data into Modular JSON Chunks'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isAm 
                ? 'በአንድ ላይ የነበረውን ትልቅ ጥያቄ ወደ ተለያዩ ትምህርቶች ወይም ምዕራፎች በመክፈል በ GitHub Gist ወይም Cloud Storage ላይ እንዲያስተናግዱ ይረዳዎታል።'
                : 'Turn your massive all-in-one exam file into lightweight, modular JSON files ready to host anywhere.'}
            </p>
          </div>

          <button
            onClick={handleLoadDemoHeavyData}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAm ? 'የሙከራ ዳታ ጫን (Demo Data)' : 'Load Demo 60-Q Bank'}</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <label className="font-semibold text-slate-300">
              {isAm ? 'የጥያቄዎችን JSON እዚህ ይለጥፉ ወይም ፋይል ይምረጡ፡' : 'Paste Questions JSON or Upload File:'}
            </label>
            <div className="flex items-center gap-3">
              {jsonInput && (
                <span className="text-emerald-400 font-mono">
                  {isAm ? `የፋይሉ መጠን: ${totalRawSize.formatted}` : `Input Size: ${totalRawSize.formatted}`}
                </span>
              )}
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isAm ? 'JSON ፋይል ስቀል' : 'Upload File'}</span>
                <input type="file" accept=".json,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              processSplit(e.target.value, chunkSize);
            }}
            placeholder='[ { "questionText": "...", "options": [...], "correctAnswer": "A" }, ... ]'
            className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
          />

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>{isAm ? 'የመክፈያ መጠን (Chunk Size):' : 'Split by Chunk Size:'}</span>
              <select
                value={chunkSize}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setChunkSize(val);
                  if (jsonInput) processSplit(jsonInput, val);
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={10}>10 {isAm ? 'ጥያቄዎች' : 'Questions'}</option>
                <option value={25}>25 {isAm ? 'ጥያቄዎች' : 'Questions'}</option>
                <option value={50}>50 {isAm ? 'ጥያቄዎች' : 'Questions'}</option>
                <option value={100}>100 {isAm ? 'ጥያቄዎች' : 'Questions'}</option>
              </select>
            </div>

            <button
              onClick={() => processSplit(jsonInput, chunkSize)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{isAm ? 'አሁን ከፋፍል (Split Now)' : 'Split Chunks'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Output Results */}
      {splitResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isAm 
                  ? `የተከፈሉ ፋይሎች (${Object.keys(splitResult).length} ፋይሎች ተገኝተዋል)` 
                  : `Split Chunks (${Object.keys(splitResult).length} files ready)`}
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              ✓ {isAm ? 'ለ GitHub / Cloud Storage ዝግጁ ነው' : 'Ready for Remote Hosting'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Chunks */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                {isAm ? 'ፋይሎችን ይምረጡ' : 'Select Chunk File'}
              </span>
              {Object.entries(splitResult).map(([key, list]) => {
                const isSelected = selectedChunkKey === key;
                const sizeInfo = calculateObjectSize(list);
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedChunkKey(key)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileJson className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-semibold text-xs capitalize">{key}.json</div>
                        <div className="text-[11px] text-slate-400">
                          {list.length} {isAm ? 'ጥያቄዎች' : 'questions'} • {sizeInfo.formatted}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadChunk(key, list);
                        }}
                        title={isAm ? 'አውርድ' : 'Download'}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chunk Preview & Code */}
            <div className="lg:col-span-2 bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-white capitalize">
                      {selectedChunkKey}.json
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({splitResult[selectedChunkKey]?.length || 0} {isAm ? 'ጥያቄዎች' : 'questions'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyChunk(selectedChunkKey, splitResult[selectedChunkKey] || [])}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
                    >
                      {copiedKey === selectedChunkKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === selectedChunkKey ? (isAm ? 'ተቀድቷል!' : 'Copied!') : (isAm ? 'ቅዳ' : 'Copy')}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadChunk(selectedChunkKey, splitResult[selectedChunkKey] || [])}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAm ? 'አውርድ (.json)' : 'Download'}</span>
                    </button>

                    <button
                      onClick={() => onLoadAsExam(splitResult[selectedChunkKey], `Exam: ${selectedChunkKey}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs text-white transition-colors"
                    >
                      <span>{isAm ? 'አሁን ፈተነኝ' : 'Test This Chunk'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <pre className="text-slate-300 font-mono text-[11px] max-h-72 overflow-y-auto overflow-x-auto p-2 bg-slate-900 rounded-lg">
                  {JSON.stringify(splitResult[selectedChunkKey]?.slice(0, 3) || [], null, 2)}
                  {splitResult[selectedChunkKey]?.length > 3 && (
                    <div className="text-slate-500 pt-2 italic">
                      ... {isAm ? `እና ተጨማሪ ${splitResult[selectedChunkKey].length - 3} ጥያቄዎች...` : `and ${splitResult[selectedChunkKey].length - 3} more questions...`}
                    </div>
                  )}
                </pre>
              </div>

              <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                <span className="font-semibold text-amber-300">📌 {isAm ? 'ቀጣይ እርምጃ፡' : 'Next Step:'} </span>
                {isAm 
                  ? 'እነዚህን የወረዱ .json ፋይሎች በ GitHub Gist (gist.github.com) ወይም በ Firebase Storage ላይ ይጫኑ። ከዚያ በዋናው አፕ ላይ ሊንኩን በመጥራት ተማሪዎች እንዲፈተኑ ያድርጉ!'
                  : 'Upload these individual JSON files to GitHub Gist, Cloudflare R2, or Firebase Storage. Load them dynamically by URL!'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
