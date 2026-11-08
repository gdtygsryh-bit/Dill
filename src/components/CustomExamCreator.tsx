import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Download, 
  Check, 
  Layers, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Exam, Question } from '../types/exam';

interface CustomExamCreatorProps {
  lang: 'am' | 'en';
  onSaveExam: (exam: Exam) => void;
  onLaunchExam: (exam: Exam) => void;
}

export const CustomExamCreator: React.FC<CustomExamCreatorProps> = ({
  lang,
  onSaveExam,
  onLaunchExam
}) => {
  const isAm = lang === 'am';

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [category, setCategory] = useState<'matric' | 'exit' | 'driving' | 'custom'>('custom');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passPercentage, setPassPercentage] = useState(50);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q_1',
      questionText: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ],
      correctAnswer: 'A',
      explanation: '',
      difficulty: 'Medium'
    }
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q_${Date.now()}_${questions.length + 1}`,
        questionText: '',
        options: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' }
        ],
        correctAnswer: 'A',
        explanation: '',
        difficulty: 'Medium'
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].questionText = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optId: string, text: string) => {
    const updated = [...questions];
    const opt = updated[qIdx].options.find(o => o.id === optId);
    if (opt) opt.text = text;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIdx: number, optId: string) => {
    const updated = [...questions];
    updated[qIdx].correctAnswer = optId;
    setQuestions(updated);
  };

  const handleExplanationChange = (qIdx: number, exp: string) => {
    const updated = [...questions];
    updated[qIdx].explanation = exp;
    setQuestions(updated);
  };

  const buildExamObject = (): Exam => {
    return {
      id: `custom_${Date.now()}`,
      title: title.trim() || (isAm ? 'አዲስ የተዘጋጀ ፈተና' : 'Custom Exam'),
      titleAm: title.trim() || 'አዲስ የተዘጋጀ ፈተና',
      category,
      categoryLabelAm: isAm ? 'የተጠቃሚ ፈተና' : 'Custom Quiz',
      categoryLabelEn: 'Custom Quiz',
      description: `Created via ExamPortal on ${new Date().toLocaleDateString()}`,
      descriptionAm: `በ ExamPortal የተዘጋጀ ፈተና`,
      subject,
      year: '2024',
      totalTimeMinutes: durationMinutes,
      passPercentage,
      source: 'custom',
      questions: questions.filter(q => q.questionText.trim().length > 0)
    };
  };

  const handleSave = () => {
    const examObj = buildExamObject();
    if (examObj.questions.length === 0) {
      alert(isAm ? 'እባክዎ ቢያንስ አንድ ጥያቄ ይጻፉ' : 'Please provide at least one complete question.');
      return;
    }
    onSaveExam(examObj);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJson = () => {
    const examObj = buildExamObject();
    const blob = new Blob([JSON.stringify(examObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.trim() ? title.toLowerCase().replace(/\s+/g, '_') : 'exam'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold px-2.5 py-1 bg-teal-500/10 rounded-full border border-teal-500/20 mb-2">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isAm ? 'ፈተና አዘጋጅ እና በ JSON ላክ' : 'Exam Builder & JSON Exporter'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAm ? 'አዲስ የፈተና ጥያቄዎችን ያዘጋጁ' : 'Create & Export Custom Exam'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isAm 
                ? 'ጥያቄዎችን እዚህ አዘጋጅተው እንደ ንጹህ .JSON ፋይል ያውርዱ። ከዚያ በ GitHub ወይም Firebase ላይ በመጫን የአፑን ሳይዝ ይቀንሱ!'
                : 'Build test questions here and export as an optimized JSON file ready for cloud hosting.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAm ? 'ወደ JSON ላክ' : 'Export JSON'}</span>
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors shadow-md shadow-teal-600/30"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? (isAm ? 'ተቀምጧል!' : 'Saved!') : (isAm ? 'አስቀምጥ' : 'Save Quiz')}</span>
            </button>
          </div>
        </div>

        {/* Exam Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {isAm ? 'የፈተናው ርዕስ (Title):' : 'Exam Title:'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAm ? 'ምሳሌ፡ የ12ኛ ክፍል ፊዚክስ 2016' : 'e.g., Grade 12 Physics Model Exam'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {isAm ? 'የትምህርት አይነት:' : 'Subject:'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Mathematics / English / COC"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {isAm ? 'የፈተና ሰዓት (ደቂቃ):' : 'Duration (Minutes):'}
            </label>
            <input
              type="number"
              min={1}
              max={180}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Questions Builder */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                {isAm ? `ጥያቄ ቁጥር ${qIdx + 1}` : `Question #${qIdx + 1}`}
              </span>
              {questions.length > 1 && (
                <button
                  onClick={() => handleRemoveQuestion(qIdx)}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title={isAm ? 'ጥያቄውን ሰርዝ' : 'Remove Question'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                {isAm ? 'የጥያቄው ጽሑፍ:' : 'Question text:'}
              </label>
              <textarea
                value={q.questionText}
                onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                rows={2}
                placeholder={isAm ? 'ጥያቄውን እዚህ ይጻፉ...' : 'Type your question here...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Options A, B, C, D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const isSelected = q.correctAnswer === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/60'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleCorrectAnswerChange(qIdx, opt.id)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={isAm ? 'ትክክለኛ መልስ ለማድረግ ይጫኑ' : 'Mark as correct answer'}
                    >
                      {opt.id}
                    </button>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(qIdx, opt.id, e.target.value)}
                      placeholder={`${isAm ? 'ምርጫ' : 'Option'} ${opt.id}`}
                      className="w-full bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-slate-600"
                    />
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {isAm ? 'ማብራሪያ (Explanation - ተማሪው ከተፈተነ በኋላ የሚያየው):' : 'Answer Explanation (Shown during review):'}
              </label>
              <input
                type="text"
                value={q.explanation}
                onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                placeholder={isAm ? 'መልሱ ለምን እንደተመረጠ አጭር ማብራሪያ ይጻፉ' : 'Explanation of why this answer is correct...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={handleAddQuestion}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span>{isAm ? '+ ሌላ ጥያቄ ጨምር' : '+ Add Another Question'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isAm ? 'ፈተናውን አስቀምጥ' : 'Save Quiz'}</span>
            </button>

            <button
              onClick={() => {
                const examObj = buildExamObject();
                if (examObj.questions.length > 0) {
                  onLaunchExam(examObj);
                } else {
                  alert(isAm ? 'ቢያንስ አንድ ጥያቄ ይጻፉ' : 'Please provide questions.');
                }
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <span>{isAm ? 'አሁን ጀምር' : 'Launch Test'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
