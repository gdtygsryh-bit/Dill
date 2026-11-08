import React from 'react';
import { 
  BookOpen, 
  Database, 
  Scissors, 
  Globe, 
  PlusCircle, 
  History,
  Languages,
  Link2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'connect' | 'guide' | 'offline' | 'exams' | 'splitter' | 'remote' | 'create' | 'history';
  setCurrentTab: (tab: 'connect' | 'guide' | 'offline' | 'exams' | 'splitter' | 'remote' | 'create' | 'history') => void;
  lang: 'am' | 'en';
  setLang: (lang: 'am' | 'en') => void;
  resultsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  resultsCount
}) => {
  const isAm = lang === 'am';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('offline')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">ExamPortal</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  {isAm ? 'የፈተና ማዕከል' : 'Pro'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAm ? 'የፈተና መተግበሪያ እና ዳታ ማከማቻ መፍትሔ' : 'Exam Engine & Cloud Storage Hub'}
              </p>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setCurrentTab('connect')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'connect'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Link2 className="w-4 h-4 text-sky-400" />
              <span>{isAm ? 'ከሌላ Email አገናኝ' : 'Connect Other Email'}</span>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] rounded-full bg-sky-400/20 text-sky-300 font-bold">
                {isAm ? 'ቀጥታ መመሪያ' : 'Guide'}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('offline')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'offline'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAm ? '100% ነጻ Offline' : '100% Free Offline'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('guide')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'guide'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>{isAm ? 'የማከማቻ መመሪያ' : 'Storage Guide'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('exams')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'exams'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isAm ? 'ፈተናዎች' : 'Take Exams'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('splitter')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'splitter'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>{isAm ? 'ጥያቄዎችን ከፋፍል (Split)' : 'File Splitter'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('remote')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'remote'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{isAm ? 'የርቀት ፈተና ጫን' : 'Load URL'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('create')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'create'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAm ? 'አዘጋጅ' : 'Create'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                currentTab === 'history'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{isAm ? 'ውጤቶች' : 'History'}</span>
              {resultsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {resultsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              title={isAm ? 'ወደ እንግሊዝኛ ቀይር' : 'Switch to Amharic'}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAm ? 'English' : 'አማርኛ'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-800 scrollbar-none">
          <button
            onClick={() => setCurrentTab('connect')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'connect' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-sky-400" />
            {isAm ? 'ከሌላ Email' : 'Connect'}
          </button>
          <button
            onClick={() => setCurrentTab('offline')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'offline' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {isAm ? '100% ነጻ Offline' : 'Free Offline'}
          </button>
          <button
            onClick={() => setCurrentTab('guide')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'guide' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            {isAm ? 'የት ይቀመጡ?' : 'Storage Guide'}
          </button>
          <button
            onClick={() => setCurrentTab('exams')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'exams' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {isAm ? 'ፈተናዎች' : 'Exams'}
          </button>
          <button
            onClick={() => setCurrentTab('splitter')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'splitter' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            {isAm ? 'ከፋፍል' : 'Splitter'}
          </button>
          <button
            onClick={() => setCurrentTab('remote')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'remote' ? 'bg-sky-600 text-white' : 'text-slate-400'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {isAm ? 'የርቀት ጫን' : 'Load URL'}
          </button>
          <button
            onClick={() => setCurrentTab('create')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'create' ? 'bg-teal-600 text-white' : 'text-slate-400'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {isAm ? 'አዘጋጅ' : 'Create'}
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'history' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            {isAm ? 'ውጤት' : 'History'}
          </button>
        </div>
      </div>
    </header>
  );
};
