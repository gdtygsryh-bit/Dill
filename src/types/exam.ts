export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string; // 'A', 'B', 'C', 'D'
  explanation: string;
  subject?: string;
  year?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topic?: string;
}

export interface Exam {
  id: string;
  title: string;
  titleAm: string;
  category: 'matric' | 'exit' | 'driving' | 'general' | 'custom';
  categoryLabelAm: string;
  categoryLabelEn: string;
  description: string;
  descriptionAm: string;
  subject: string;
  year: string;
  totalTimeMinutes: number;
  passPercentage: number;
  questions: Question[];
  source?: 'built-in' | 'remote' | 'custom';
  remoteUrl?: string;
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  passed: boolean;
  userAnswers: Record<string, string>; // questionId -> selectedOptionId
  completedAt: string;
}

export interface StorageArchitecture {
  id: string;
  name: string;
  nameAm: string;
  recommendedFor: string;
  recommendedForAm: string;
  cost: string;
  costAm: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  difficultyAm: 'ቀላል' | 'መካከለኛ' | 'ከፍተኛ';
  pros: string[];
  prosAm: string[];
  cons: string[];
  consAm: string[];
  steps: string[];
  stepsAm: string[];
  codeSnippet: string;
  codeLang: string;
  iconName: string;
}
