import React from 'react';
import { 
  History, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { ExamResult, Exam } from '../types/exam';

interface ExamHistoryViewProps {
  results: ExamResult[];
  exams: Exam[];
  lang: 'am' | 'en';
  onClearHistory: () => void;
  onRetakeExam: (exam: Exam) => void;
  onNavigateToExams: () => void;
}

export const ExamHistoryView: React.FC<ExamHistoryViewProps> = ({
  results,
  exams,
  lang,
  onClearHistory,
  onRetakeExam,
  onNavigateToExams
}) => {
  const isAm = lang === 'am';

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
            <History className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isAm ? 'የፈተና ውጤት ታሪክ' : 'Exam Results History'}
            </h2>
            <p className="text-xs text-slate-400">
              {isAm ? 'እስካሁን የተፈተኗቸው ፈተናዎች እና ያስመዘገቡት ውጤት' : 'Past attempts and score performance.'}
            </p>
          </div>
        </div>

        {results.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAm ? 'ታሪክ አጽዳ' : 'Clear History'}</span>
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            {isAm ? 'እስካሁን የተፈተኑት ፈተና የለም' : 'No exam history yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {isAm ? 'ከፈተናዎች ዝርዝር ውስጥ አንዱን መርጠው ይፈተኑ' : 'Take an exam from the list to see your scores here.'}
          </p>
          <button
            onClick={onNavigateToExams}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            <span>{isAm ? 'ወደ ፈተናዎች ሂድ' : 'Go to Exams'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((res, i) => {
            const correspondingExam = exams.find(e => e.id === res.examId);
            const dateStr = new Date(res.completedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        res.passed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {res.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{res.passed ? (isAm ? 'አልፈዋል' : 'Passed') : (isAm ? 'አላለፉም' : 'Failed')}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{dateStr}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {res.examTitle}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>
                      {isAm ? 'ውጤት፡ ' : 'Score: '}
                      <strong className="text-slate-200">{res.correctCount}/{res.totalQuestions}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {isAm ? 'የፈጀው ሰዓት፡ ' : 'Time: '}
                      <strong className="text-slate-200">{Math.floor(res.timeSpentSeconds / 60)}m {res.timeSpentSeconds % 60}s</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-black text-white font-mono">
                      {res.scorePercentage}%
                    </div>
                  </div>

                  {correspondingExam && (
                    <button
                      onClick={() => onRetakeExam(correspondingExam)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isAm ? 'ደግመህ ፈተን' : 'Retake'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
