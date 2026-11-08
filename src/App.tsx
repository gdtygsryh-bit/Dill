/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StorageGuideView } from './components/StorageGuideView';
import { OfflineGuideAndManager } from './components/OfflineGuideAndManager';
import { CrossAccountConnectorView } from './components/CrossAccountConnectorView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ExamListView } from './components/ExamListView';
import { ExamSessionView } from './components/ExamSessionView';
import { ExamResultView } from './components/ExamResultView';
import { QuestionSplitterView } from './components/QuestionSplitterView';
import { RemoteLoaderView } from './components/RemoteLoaderView';
import { CustomExamCreator } from './components/CustomExamCreator';
import { ExamHistoryView } from './components/ExamHistoryView';
import { 
  getAllExams, 
  saveCustomExam, 
  deleteCustomExam, 
  getExamResults, 
  saveExamResult 
} from './utils/storage';
import { Exam, ExamResult } from './types/exam';

export default function App() {
  const [lang, setLang] = useState<'am' | 'en'>('am');
  const [currentTab, setCurrentTab] = useState<'connect' | 'offline' | 'guide' | 'exams' | 'splitter' | 'remote' | 'create' | 'history'>('connect');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  
  // Active Test Session State
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examMode, setExamMode] = useState<'exam' | 'practice'>('practice');
  const [activeResult, setActiveResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    setExams(getAllExams());
    setResults(getExamResults());
  }, []);

  const handleStartExam = (exam: Exam, mode: 'exam' | 'practice') => {
    setActiveExam(exam);
    setExamMode(mode);
    setActiveResult(null);
  };

  const handleCompleteExam = (result: ExamResult) => {
    saveExamResult(result);
    setResults(getExamResults());
    setActiveResult(result);
  };

  const handleSaveCustomExam = (exam: Exam) => {
    saveCustomExam(exam);
    setExams(getAllExams());
  };

  const handleDeleteCustomExam = (examId: string) => {
    deleteCustomExam(examId);
    setExams(getAllExams());
  };

  const handleLoadQuestionsAsExam = (questions: any[], title: string) => {
    const tempExam: Exam = {
      id: `chunk_${Date.now()}`,
      title,
      titleAm: title,
      category: 'custom',
      categoryLabelAm: 'የተከፋፈለ ፈተና',
      categoryLabelEn: 'Chunk Quiz',
      description: 'Tested from file chunk splitter',
      descriptionAm: 'ከፋይል መክፈያው የተዘጋጀ ፈተና',
      subject: 'Custom',
      year: '2024',
      totalTimeMinutes: Math.max(5, Math.ceil(questions.length * 1.5)),
      passPercentage: 50,
      source: 'custom',
      questions: questions.map((q, i) => ({
        id: q.id || `cq_${i}`,
        questionText: q.questionText || q.question || `Question ${i + 1}`,
        options: q.options || [
          { id: 'A', text: q.A || 'A' },
          { id: 'B', text: q.B || 'B' },
          { id: 'C', text: q.C || 'C' },
          { id: 'D', text: q.D || 'D' }
        ],
        correctAnswer: q.correctAnswer || q.answer || 'A',
        explanation: q.explanation || 'No explanation',
        difficulty: q.difficulty || 'Medium'
      }))
    };
    handleStartExam(tempExam, 'practice');
  };

  const handleRemoteExamLoaded = (remoteExam: Exam) => {
    handleSaveCustomExam(remoteExam);
    handleStartExam(remoteExam, 'exam');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('examhub_results');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveExam(null);
          setActiveResult(null);
          setCurrentTab(tab);
        }}
        lang={lang}
        setLang={setLang}
        resultsCount={results.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* If taking an active test */}
        {activeExam && !activeResult && (
          <ExamSessionView
            exam={activeExam}
            mode={examMode}
            lang={lang}
            onComplete={handleCompleteExam}
            onExit={() => setActiveExam(null)}
          />
        )}

        {/* If viewing test result */}
        {activeExam && activeResult && (
          <ExamResultView
            exam={activeExam}
            result={activeResult}
            lang={lang}
            onRetake={() => handleStartExam(activeExam, examMode)}
            onBackToExams={() => {
              setActiveExam(null);
              setActiveResult(null);
              setCurrentTab('exams');
            }}
            onNavigateToGuide={() => {
              setActiveExam(null);
              setActiveResult(null);
              setCurrentTab('guide');
            }}
          />
        )}

        {/* If in Normal Tabs */}
        {!activeExam && (
          <>
            {currentTab === 'connect' && (
              <CrossAccountConnectorView
                lang={lang}
                onExamConnected={(exam) => {
                  handleSaveCustomExam(exam);
                }}
                onNavigateToOffline={() => setCurrentTab('offline')}
              />
            )}

            {currentTab === 'offline' && (
              <OfflineGuideAndManager
                exams={exams}
                lang={lang}
                isSimulatedOffline={isSimulatedOffline}
                setIsSimulatedOffline={setIsSimulatedOffline}
                onStartExam={handleStartExam}
              />
            )}

            {currentTab === 'guide' && (
              <StorageGuideView
                lang={lang}
                onNavigateToSplitter={() => setCurrentTab('splitter')}
                onNavigateToRemote={() => setCurrentTab('remote')}
                onNavigateToExams={() => setCurrentTab('exams')}
              />
            )}

            {currentTab === 'exams' && (
              <ExamListView
                exams={exams}
                lang={lang}
                isSimulatedOffline={isSimulatedOffline}
                onStartExam={handleStartExam}
                onDeleteCustomExam={handleDeleteCustomExam}
                onNavigateToGuide={() => setCurrentTab('guide')}
                onNavigateToOffline={() => setCurrentTab('offline')}
              />
            )}

            {currentTab === 'splitter' && (
              <QuestionSplitterView
                lang={lang}
                onLoadAsExam={handleLoadQuestionsAsExam}
              />
            )}

            {currentTab === 'remote' && (
              <RemoteLoaderView
                lang={lang}
                onExamLoaded={handleRemoteExamLoaded}
              />
            )}

            {currentTab === 'create' && (
              <CustomExamCreator
                lang={lang}
                onSaveExam={handleSaveCustomExam}
                onLaunchExam={(exam) => handleStartExam(exam, 'exam')}
              />
            )}

            {currentTab === 'history' && (
              <ExamHistoryView
                results={results}
                exams={exams}
                lang={lang}
                onClearHistory={handleClearHistory}
                onRetakeExam={(exam) => handleStartExam(exam, 'exam')}
                onNavigateToExams={() => setCurrentTab('exams')}
              />
            )}
          </>
        )}
      </main>

      {/* Offline Status Toast */}
      <OfflineIndicator isSimulatedOffline={isSimulatedOffline} />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ExamPortal &bull; {lang === 'am' ? 'የፈተና መተግበሪያ እና ደመና ማከማቻ መፍትሔ' : 'Exam Application & Cloud Storage Architecture'}
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Firebase Firestore</span>
            <span>&bull;</span>
            <span>GitHub Raw / Gist</span>
            <span>&bull;</span>
            <span>Google Cloud Storage</span>
            <span>&bull;</span>
            <span>Google Sheets</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
