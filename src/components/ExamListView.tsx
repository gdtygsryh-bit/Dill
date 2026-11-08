import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight,
  Globe,
  Trash2,
  Award,
  DownloadCloud,
  CheckCircle2,
  WifiOff
} from 'lucide-react';
import { Exam } from '../types/exam';
import { isExamDownloaded, downloadExamForOffline } from '../utils/storage';

interface ExamListViewProps {
  exams: Exam[];
  lang: 'am' | 'en';
  isSimulatedOffline?: boolean;
  onStartExam: (exam: Exam, mode: 'exam' | 'practice') => void;
  onDeleteCustomExam?: (examId: string) => void;
  onNavigateToGuide: () => void;
  onNavigateToOffline: () => void;
}

export const ExamListView: React.FC<ExamListViewProps> = ({
  exams,
  lang,
  isSimulatedOffline,
  onStartExam,
  onDeleteCustomExam,
  onNavigateToGuide,
  onNavigateToOffline
}) => {
  const isAm = lang === 'am';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredExams = exams.filter(exam => {
    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    const titleMatch = (exam.title + ' ' + (exam.titleAm || '') + ' ' + exam.subject)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && titleMatch;
  });

  const categories = [
    { id: 'all', labelEn: 'All Exams', labelAm: 'ሁሉም ፈተናዎች' },
    { id: 'matric', labelEn: 'Grade 12 Matric', labelAm: '12ኛ ክፍል ማትሪክ' },
    { id: 'exit', labelEn: 'Exit Exam / NGAT', labelAm: 'የዩኒቨርሲቲ መውጫ ፈተና' },
    { id: 'driving', labelEn: 'Driving License', labelAm: 'መንጃ ፍቃድ' },
    { id: 'custom', labelEn: 'Custom / Remote', labelAm: 'የተጠቃሚ / የርቀት' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 100% Free Offline Solution Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isAm ? 'ለእርስዎ ምርጡ መፍትሔ፡ 100% ነፃ እና Offline ፈተናዎች!' : 'Recommended: 100% Free & Offline Solution'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                0$ Zero Cost
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              {isAm 
                ? 'ተማሪዎች ፈተናውን አንዴ ካወረዱ በኋላ ያለ ምንም ኢንተርኔት (Offline) የሚፈተኑበትን አሰራር ይመልከቱ።' 
                : 'Host on GitHub Gist for 0$, download once, and practice 100% offline without mobile data.'}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToOffline}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shrink-0 shadow-md shadow-emerald-600/30"
        >
          <span>{isAm ? 'የኦፍላይን ማዕከልን ክፈት' : 'Open Offline Hub'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Categories Pill Buttons */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
                }`}
              >
                {isAm ? cat.labelAm : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAm ? 'ፈተና ፈልግ...' : 'Search exams...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-md group relative overflow-hidden"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {isAm ? exam.categoryLabelAm || exam.category : exam.categoryLabelEn || exam.category}
                </span>

                <div className="flex items-center gap-2">
                  {exam.source === 'remote' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1 font-mono">
                      <Globe className="w-3 h-3" />
                      Remote
                    </span>
                  )}
                  {exam.source === 'custom' && onDeleteCustomExam && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomExam(exam.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title={isAm ? 'ሰርዝ' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
                {isAm ? exam.titleAm || exam.title : exam.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {isAm ? exam.descriptionAm || exam.description : exam.description}
              </p>

              {/* Meta information */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{exam.totalTimeMinutes} {isAm ? 'ደቂቃ' : 'Mins'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>{exam.questions.length} {isAm ? 'ጥያቄዎች' : 'Questions'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{exam.passPercentage}% {isAm ? 'የማለፊያ' : 'Pass Mark'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">📅 {exam.year}</span>
                </div>
              </div>

              {/* 1-Click Offline Status / Download Row */}
              <div className="flex items-center justify-between pb-3 mb-2 text-xs">
                {isExamDownloaded(exam.id) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isAm ? 'በስልክ ላይ ተቀምጧል (Offline)' : 'Cached Offline'}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      downloadExamForOffline(exam);
                      // trigger re-render
                      setSelectedCategory(c => c);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-emerald-300 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
                  >
                    <DownloadCloud className="w-3 h-3 text-indigo-400" />
                    <span>{isAm ? 'ለ Offline አውርድ' : 'Save for Offline'}</span>
                  </button>
                )}

                {isSimulatedOffline && !isExamDownloaded(exam.id) && (
                  <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    <span>{isAm ? 'አልወረደም' : 'Not cached'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: Practice vs Exam Mode */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onStartExam(exam, 'practice')}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                title={isAm ? 'ፈጣን ማብራሪያ እያዩ መለማመጃ' : 'Practice with instant explanations'}
              >
                <span>{isAm ? 'መለማመጃ' : 'Practice'}</span>
              </button>

              <button
                onClick={() => onStartExam(exam, 'exam')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
                title={isAm ? 'በሰዓት መፈተኛ' : 'Timed exam simulation'}
              >
                <span>{isAm ? 'ፈተና ጀምር' : 'Exam Mode'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">
            {isAm ? 'ምንም ፈተና አልተገኘም' : 'No exams found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isAm ? 'የፍለጋ ቃሉን ይቀይሩ ወይም በአዘጋጅ ገጽ ላይ አዲስ ፈተና ይጨምሩ' : 'Try adjusting your search or add a new exam.'}
          </p>
        </div>
      )}
    </div>
  );
};
