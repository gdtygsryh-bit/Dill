import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  AlertTriangle,
  Send,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { Exam, Question, ExamResult } from '../types/exam';

interface ExamSessionViewProps {
  exam: Exam;
  mode: 'exam' | 'practice';
  lang: 'am' | 'en';
  onComplete: (result: ExamResult) => void;
  onExit: () => void;
}

export const ExamSessionView: React.FC<ExamSessionViewProps> = ({
  exam,
  mode,
  lang,
  onComplete,
  onExit
}) => {
  const isAm = lang === 'am';
  const totalQuestions = exam.questions.length;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(exam.totalTimeMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentQ = exam.questions[currentIndex] || exam.questions[0];

  // Timer countdown
  useEffect(() => {
    if (mode !== 'exam') return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Text to speech narration
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${currentQ.questionText}. Option A: ${currentQ.options[0]?.text}. Option B: ${currentQ.options[1]?.text}. Option C: ${currentQ.options[2]?.text}. Option D: ${currentQ.options[3]?.text}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    exam.questions.forEach((q) => {
      const userChoice = answers[q.id];
      if (!userChoice) {
        unansweredCount++;
      } else if (userChoice === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= exam.passPercentage;
    const timeSpentSeconds = (exam.totalTimeMinutes * 60) - timeLeftSeconds;

    const result: ExamResult = {
      examId: exam.id,
      examTitle: exam.title,
      totalQuestions,
      correctCount,
      wrongCount,
      unansweredCount,
      scorePercentage,
      timeSpentSeconds: Math.max(timeSpentSeconds, 10),
      passed,
      userAnswers: answers,
      completedAt: new Date().toISOString()
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    onComplete(result);
  };

  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeftSeconds < 120 && mode === 'exam';

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      {/* Top Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isAm ? 'ውጣ' : 'Exit Exam'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {mode === 'practice' ? (isAm ? 'የመለማመጃ ሁነታ' : 'Practice Mode') : (isAm ? 'የፈተና ሁነታ' : 'Exam Mode')}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {isAm ? exam.titleAm || exam.title : exam.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAm ? `ጥያቄ ${currentIndex + 1} ከ ${totalQuestions}` : `Question ${currentIndex + 1} of ${totalQuestions}`}
            </p>
          </div>
        </div>

        {/* Timer & Submit Action */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {mode === 'exam' && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
                isTimeCritical
                  ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>
          )}

          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAm ? 'ፈተናውን ጨርስ' : 'Submit Exam'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md relative">
            {/* Top Toolbar: Audio Read & Flag */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  #{currentIndex + 1}
                </span>
                {currentQ.difficulty && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400">
                    {currentQ.difficulty}
                  </span>
                )}
                {currentQ.topic && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-900/50">
                    {currentQ.topic}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Narrator */}
                <button
                  onClick={handleToggleSpeak}
                  className={`p-2 rounded-xl border transition-colors ${
                    isSpeaking
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title={isAm ? 'ጥያቄውን በድምጽ አንብብልኝ' : 'Read question aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Flag Question */}
                <button
                  onClick={toggleFlag}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                    flagged[currentQ.id]
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged[currentQ.id] ? (isAm ? 'ተመርጧል' : 'Flagged') : (isAm ? 'ለይተህ አስቀምጥ' : 'Flag')}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-white mb-6 leading-relaxed">
              {currentQ.questionText}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id] === option.id;
                const isCorrect = option.id === currentQ.correctAnswer;
                const showInstantFeedback = mode === 'practice' && isSelected;

                let borderStyle = 'border-slate-800 hover:border-slate-700 hover:bg-slate-850';
                let bgStyle = 'bg-slate-950';
                let badgeStyle = 'bg-slate-800 text-slate-300';

                if (isSelected) {
                  if (mode === 'practice') {
                    if (isCorrect) {
                      borderStyle = 'border-emerald-500 bg-emerald-950/20';
                      badgeStyle = 'bg-emerald-500 text-white';
                    } else {
                      borderStyle = 'border-red-500 bg-red-950/20';
                      badgeStyle = 'bg-red-500 text-white';
                    }
                  } else {
                    borderStyle = 'border-emerald-500/80 bg-emerald-950/20';
                    badgeStyle = 'bg-emerald-500 text-white';
                  }
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectAnswer(option.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${borderStyle} ${bgStyle}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-all ${badgeStyle}`}
                    >
                      {option.id}
                    </div>
                    <div className="text-sm text-slate-200 pt-0.5 leading-snug flex-1">
                      {option.text}
                    </div>
                    {mode === 'practice' && isSelected && (
                      <div className="shrink-0 pt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Practice Mode Explanation Box */}
            {mode === 'practice' && answers[currentQ.id] && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>
                    {isAm ? `ትክክለኛው መልስ፡ ምርጫ ${currentQ.correctAnswer}` : `Correct Answer: Option ${currentQ.correctAnswer}`}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  <strong>{isAm ? 'ማብራሪያ፡ ' : 'Explanation: '}</strong>
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isAm ? 'ያለፈው' : 'Previous'}</span>
              </button>

              <div className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {totalQuestions}
              </div>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                >
                  <span>{isAm ? 'ቀጣዩ' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-md shadow-emerald-600/30"
                >
                  <span>{isAm ? 'ጨርስ' : 'Submit'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Grid Drawer */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              {isAm ? 'የጥያቄዎች ሰሌዳ (Navigator)' : 'Question Palette'}
            </h4>

            {/* Status Legend */}
            <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>{isAm ? 'የተመለሰ' : 'Answered'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>{isAm ? 'የተለየ' : 'Flagged'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span>{isAm ? 'ያልተመለሰ' : 'Empty'}</span>
              </div>
            </div>

            {/* Grid of numbers */}
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];

                let cellStyle = 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800';

                if (isAnswered) {
                  cellStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold';
                }
                if (isFlagged) {
                  cellStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold';
                }
                if (isCurrent) {
                  cellStyle += ' ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-all ${cellStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Answered Counter */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>{isAm ? 'የተመለሱ ጥያቄዎች፡' : 'Answered:'}</span>
              <span className="font-bold text-emerald-400">
                {answeredCount} / {totalQuestions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {isAm ? 'ፈተናውን መጨረስ ይፈልጋሉ?' : 'Ready to Submit Exam?'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {answeredCount < totalQuestions ? (
                  isAm ? (
                    `እስካሁን ያልመለሷቸው ${totalQuestions - answeredCount} ጥያቄዎች አሉ። ፈተናውን አሁኑኑ መጨረስ ይፈልጋሉ?`
                  ) : (
                    `You have ${totalQuestions - answeredCount} unanswered questions left. Do you want to submit now?`
                  )
                ) : (
                  isAm ? 'ሁሉንም ጥያቄዎች መልሰዋል። ውጤትዎን ለማየት አረጋግጥ የሚለውን ይጫኑ።' : 'All questions answered! Click confirm to view your score.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {isAm ? 'ተመለስ' : 'Go Back'}
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitExam();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-md shadow-emerald-600/30"
              >
                {isAm ? 'አረጋግጥና ጨርስ' : 'Confirm & Finish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
