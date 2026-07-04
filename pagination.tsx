export type UserRole = 'student' | 'admin';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ChapterStatus = 'not_started' | 'in_progress' | 'passed' | 'failed';

export interface Student {
  id: string; name: string; email: string; password: string;
  class: string; school: string; rollNumber?: string; createdAt: string;
}
export interface Admin {
  id: string; name: string; email: string; password: string; createdAt: string;
}
export interface Chapter {
  id: string; name: string; description: string; topics: string[]; order: number; active: boolean;
}
export interface Question {
  id: string; chapterId: string; questionText: string; options: string[];
  correctOption: number; explanation: string; difficulty: Difficulty; topic: string; active: boolean;
}
export interface Attempt {
  id: string; studentId: string; chapterId: string; answers: Record<string, number | null>;
  score: number; totalQuestions: number; correctCount: number; wrongCount: number;
  unansweredCount: number; percentage: number; passed: boolean; timeTaken: number;
  date: string; questionIds: string[];
}
export interface Certificate {
  id: string; certificateId: string; studentId: string; studentName: string;
  schoolName: string; date: string; teacherRemark?: string;
}
export interface SpecialAttempt {
  id: string; studentId: string; answers: Record<string, number | null>;
  score: number; totalQuestions: number; correctCount: number; wrongCount: number;
  unansweredCount: number; percentage: number; passed: boolean; timeTaken: number;
  date: string; questionIds: string[];
  chapterBreakdown: { chapterId: string; chapterName: string; total: number; correct: number }[];
}
export interface SpecialCertificate {
  id: string; certificateId: string; studentId: string; studentName: string;
  schoolName: string; date: string; score: number; totalQuestions: number;
  percentage: number; teacherRemark?: string;
}
export interface Settings {
  passPercentage: number; questionsPerChapter: number; timerEnabled: boolean;
  timerMinutes: number; schoolName: string; schoolLogo?: string;
  teacherSignature?: string; principalSignature?: string; certificateTitle: string;
  certificateStatement: string; leaderboardEnabled: boolean; allowRetest: boolean;
}
export interface ChapterProgress {
  chapterId: string; status: ChapterStatus; attempts: number; highestScore: number;
  latestScore: number; latestPercentage: number; passed: boolean;
  lastAttemptDate?: string; timeTaken?: number; weakTopics: string[];
}
export type AppView =
  | 'landing' | 'student-login' | 'student-register' | 'admin-login'
  | 'student-dashboard' | 'chapter-list' | 'chapter-intro'
  | 'test' | 'result' | 'review' | 'progress-report'
  | 'certificate' | 'certificate-verify'
  | 'special-test-intro' | 'special-test' | 'special-test-result' | 'special-certificate'
  | 'admin-dashboard' | 'admin-chapters' | 'admin-questions'
  | 'admin-students' | 'admin-student-detail' | 'admin-school-report'
  | 'admin-analytics' | 'admin-settings' | 'admin-certificates'
  | 'help-info';
export interface TestState {
  chapterId: string; questions: Question[]; answers: Record<string, number | null>;
  startTime: number; currentIndex: number; submitted: boolean;
}
export interface SpecialTestState {
  questions: Question[]; answers: Record<string, number | null>; startTime: number;
  currentIndex: number; submitted: boolean; timeLimitSeconds: number;
}