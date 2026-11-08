import { Exam, ExamResult } from '../types/exam';
import { SAMPLE_EXAMS } from '../data/sampleExams';

const STORAGE_KEY_CUSTOM_EXAMS = 'examhub_custom_exams';
const STORAGE_KEY_RESULTS = 'examhub_results';

export function getAllExams(): Exam[] {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_EXAMS);
    const customExams: Exam[] = custom ? JSON.parse(custom) : [];
    return [...SAMPLE_EXAMS, ...customExams];
  } catch (e) {
    console.error('Failed to parse exams from localStorage:', e);
    return SAMPLE_EXAMS;
  }
}

export function saveCustomExam(exam: Exam): void {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_EXAMS);
    const currentList: Exam[] = custom ? JSON.parse(custom) : [];
    // If updating existing, replace it
    const index = currentList.findIndex(e => e.id === exam.id);
    if (index >= 0) {
      currentList[index] = exam;
    } else {
      currentList.unshift(exam);
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_EXAMS, JSON.stringify(currentList));
  } catch (e) {
    console.error('Error saving custom exam:', e);
  }
}

export function deleteCustomExam(examId: string): void {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_EXAMS);
    if (!custom) return;
    const currentList: Exam[] = JSON.parse(custom);
    const updated = currentList.filter(e => e.id !== examId);
    localStorage.setItem(STORAGE_KEY_CUSTOM_EXAMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting custom exam:', e);
  }
}

export function getExamResults(): ExamResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error getting results:', e);
    return [];
  }
}

export function saveExamResult(result: ExamResult): void {
  try {
    const list = getExamResults();
    list.unshift(result);
    // Keep last 50
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.error('Error saving result:', e);
  }
}

const STORAGE_KEY_OFFLINE_CACHE = 'examhub_offline_cache';

export function getDownloadedExamsMap(): Record<string, Exam> {
  try {
    const data = localStorage.getItem(STORAGE_KEY_OFFLINE_CACHE);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Error reading offline cache:', e);
    return {};
  }
}

export function isExamDownloaded(examId: string): boolean {
  const map = getDownloadedExamsMap();
  return !!map[examId];
}

export function downloadExamForOffline(exam: Exam): void {
  try {
    const map = getDownloadedExamsMap();
    map[exam.id] = {
      ...exam,
      source: 'built-in' // Ensure fully self-contained offline
    };
    localStorage.setItem(STORAGE_KEY_OFFLINE_CACHE, JSON.stringify(map));
  } catch (e) {
    console.error('Error caching exam offline:', e);
  }
}

export function removeExamFromOffline(examId: string): void {
  try {
    const map = getDownloadedExamsMap();
    delete map[examId];
    localStorage.setItem(STORAGE_KEY_OFFLINE_CACHE, JSON.stringify(map));
  } catch (e) {
    console.error('Error removing exam from offline cache:', e);
  }
}

export function getOfflineStorageSummary(): { count: number; formattedSize: string } {
  try {
    const data = localStorage.getItem(STORAGE_KEY_OFFLINE_CACHE) || '{}';
    const map = JSON.parse(data);
    const count = Object.keys(map).length;
    const size = calculateObjectSize(data);
    return { count, formattedSize: size.formatted };
  } catch (e) {
    return { count: 0, formattedSize: '0 B' };
  }
}

/**
 * Calculates raw size in KB or MB of an object
 */
export function calculateObjectSize(obj: any): { bytes: number; formatted: string } {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  const bytes = new Blob([str]).size;
  if (bytes < 1024) return { bytes, formatted: `${bytes} B` };
  if (bytes < 1024 * 1024) return { bytes, formatted: `${(bytes / 1024).toFixed(1)} KB` };
  return { bytes, formatted: `${(bytes / (1024 * 1024)).toFixed(2)} MB` };
}

/**
 * Splits a big question list into smaller modular exams by subject or chunk size
 */
export function splitQuestionBank(questions: any[], chunkSize: number = 50): Record<string, any[]> {
  const chunks: Record<string, any[]> = {};
  
  // Try to group by subject if present
  let hasSubjects = questions.some(q => q.subject || q.category);
  
  if (hasSubjects) {
    for (const q of questions) {
      const key = q.subject || q.category || 'general';
      if (!chunks[key]) chunks[key] = [];
      chunks[key].push(q);
    }
  } else {
    // Group into chunk sizes
    for (let i = 0; i < questions.length; i += chunkSize) {
      const chunkName = `part_${Math.floor(i / chunkSize) + 1}`;
      chunks[chunkName] = questions.slice(i, i + chunkSize);
    }
  }
  
  return chunks;
}
