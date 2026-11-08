import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle,
  AlertCircle,
  Database
} from 'lucide-react';
import { Exam, ExamResult } from '../types/exam';

interface ExamResultViewProps {
  exam: Exam;
  result: ExamResult;
  lang: 'am' | 'en';
  onRetake: () => void;
  onBackToExams: () => void;
  onNavigateToGuide: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  exam,
  result,
  lang,
  onRetake,
  onBackToExams,
  onNavigateToGuide
}) => {
  const isAm = lang === 'am';
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct'>('all');

  useEffect(() => {
    if (result.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [result.passed]);

  const formatTimeSpent = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} ${isAm ? 'ደቂቃ' : 'min'} ${secs} ${isAm ? 'ሰከንድ' : 'sec'}`;
  };

  const filteredQuestions = exam.questions.filter((q) => {
    const userChoice = result.userAnswers[q.id];
    const isCorrect = userChoice === q.correctAnswer;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'wrong') return !isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Score Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-white">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {isAm ? exam.titleAm || exam.title : exam.title}
          </h2>

          <div className="my-4">
            <div className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
              {result.scorePercentage}%
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  result.passed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {result.passed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAm ? 'አልፈዋል (PASSED)' : 'PASSED'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>{isAm ? 'አላለፉም (DID NOT PASS)' : 'NEEDS PRACTICE'}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            {isAm 
              ? `የማለፊያ ነጥብ፡ ${exam.passPercentage}% | የፈጀው ሰዓት፡ ${formatTimeSpent(result.timeSpentSeconds)}`
              : `Passing mark: ${exam.passPercentage}% | Time spent: ${formatTimeSpent(result.timeSpentSeconds)}`}
          </p>

          {/* Metric Stats */}
          <div className="grid grid-cols-4 gap-2 text-center bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">{isAm ? 'ጠቅላላ' : 'Total'}</div>
              <div className="text-sm font-bold text-white mt-0.5">{result.totalQuestions}</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-400 uppercase">{isAm ? 'ትክክል' : 'Correct'}</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{result.correctCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-red-400 uppercase">{isAm ? 'የተሳሳተ' : 'Wrong'}</div>
              <div className="text-sm font-bold text-red-400 mt-0.5">{result.wrongCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">{isAm ? 'ያልተመለሰ' : 'Empty'}</div>
              <div className="text-sm font-bold text-slate-400 mt-0.5">{result.unansweredCount}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-600/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAm ? 'እንደገና ተፈተን' : 'Retake Exam'}</span>
            </button>

            <button
              onClick={onBackToExams}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isAm ? 'ወደ ፈተናዎች ዝርዝር' : 'Back to Exams'}</span>
            </button>

            <button
              onClick={onNavigateToGuide}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isAm ? 'የማከማቻ መፍትሔ' : 'Storage Solution'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question Breakdown and Explanations */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {isAm ? 'የጥያቄዎች እና የማብራሪያዎች ግምገማ' : 'Detailed Question Review'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAm ? 'እያንዳንዱን ጥያቄ ከነሙሉ ማብራሪያው ያንብቡ' : 'Inspect each question, correct answer, and explanation.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAm ? 'ሁሉም' : 'All'} ({result.totalQuestions})
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterMode === 'wrong' ? 'bg-red-500/20 text-red-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAm ? 'የተሳሳቱ' : 'Wrong'} ({result.wrongCount + result.unansweredCount})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterMode === 'correct' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAm ? 'ትክክለኛ' : 'Correct'} ({result.correctCount})
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const userChoice = result.userAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswer;
            const isUnanswered = !userChoice;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-slate-950/60 border-emerald-900/30'
                    : 'bg-slate-950/60 border-red-900/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-sm font-semibold text-white leading-snug">
                    <span className="text-slate-400 mr-2">#{idx + 1}.</span>
                    {q.questionText}
                  </div>

                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAm ? 'ትክክል' : 'Correct'}
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {isAm ? 'ያልተመለሰ' : 'Skipped'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        {isAm ? 'ስህተት' : 'Wrong'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Options list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                  {q.options.map((opt) => {
                    const isUserPick = userChoice === opt.id;
                    const isActualAnswer = opt.id === q.correctAnswer;

                    let optBg = 'bg-slate-900 border-slate-800 text-slate-300';

                    if (isActualAnswer) {
                      optBg = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200 font-semibold';
                    } else if (isUserPick && !isCorrect) {
                      optBg = 'bg-red-950/30 border-red-500/60 text-red-200';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optBg}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{opt.id}.</span>
                          <span>{opt.text}</span>
                        </div>

                        {isActualAnswer && (
                          <span className="text-[10px] text-emerald-400 font-bold ml-2">
                            ✓ {isAm ? 'ትክክለኛ' : 'Answer'}
                          </span>
                        )}
                        {isUserPick && !isCorrect && (
                          <span className="text-[10px] text-red-400 font-bold ml-2">
                            ✗ {isAm ? 'እርስዎ የመረጡት' : 'Your pick'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-400">
                    💡 {isAm ? 'ማብራሪያ፡ ' : 'Explanation: '}
                  </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
