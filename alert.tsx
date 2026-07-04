import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppView, Student, Admin, Chapter, Question, Attempt, Certificate,
  SpecialAttempt, SpecialCertificate, Settings, ChapterProgress,
  TestState, SpecialTestState, UserRole,
} from './types';
import { sampleChapters, sampleQuestions, defaultSettings, defaultAdmin } from './data';

const generateId = (): string => {
  try { return crypto.randomUUID(); } catch { return Date.now().toString(36) + Math.random().toString(36).substring(2); }
};
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
interface ShuffleResult { shuffledOptions: string[]; newCorrectOption: number; }
function shuffleOptions(options: string[], correctOption: number): ShuffleResult {
  const indices = options.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  return { shuffledOptions: shuffled.map(i => options[i]), newCorrectOption: shuffled.indexOf(correctOption) };
}

interface AppStore {
  currentView: AppView; previousView: AppView | null; setCurrentView: (v: AppView) => void; goBack: () => void;
  navigateTo: (v: AppView, d?: Record<string, string | null>) => void; viewData: Record<string, string | null>;
  currentUser: Student | null; userRole: UserRole | null; students: Student[]; admins: Admin[];
  studentLogin: (email: string, password: string) => boolean;
  studentRegister: (name: string, email: string, password: string, school: string, rollNumber?: string) => boolean;
  adminLogin: (email: string, password: string) => boolean; logout: () => void;
  chapters: Chapter[]; questions: Question[]; attempts: Attempt[]; certificates: Certificate[];
  specialAttempts: SpecialAttempt[]; specialCertificates: SpecialCertificate[]; settings: Settings;
  initAppData: () => void;
  currentTest: TestState | null; currentSpecialTest: SpecialTestState | null; _specialShuffleMappings: Record<string, ShuffleResult>;
  startTest: (chapterId: string) => void; answerQuestion: (qId: string, opt: number | null) => void;
  goToQuestion: (i: number) => void; nextQuestion: () => void; prevQuestion: () => void;
  submitTest: () => Attempt | null; resumeTest: () => boolean; clearCurrentTest: () => void; getTimerSeconds: () => number;
  startSpecialTest: () => void; answerSpecialQuestion: (qId: string, opt: number | null) => void;
  goToSpecialQuestion: (i: number) => void; nextSpecialQuestion: () => void; prevSpecialQuestion: () => void;
  submitSpecialTest: () => SpecialAttempt | null; clearSpecialTest: () => void; getSpecialTimerSeconds: () => number;
  getStudentSpecialAttempts: () => SpecialAttempt[]; canGenerateSpecialCertificate: () => boolean;
  generateSpecialCertificate: (remark?: string) => SpecialCertificate | null;
  getSpecialAnalytics: () => { totalAttempts: number; passCount: number; avgScore: number; highestScore: number; chapterAverages: { chapterId: string; chapterName: string; avgCorrect: number; totalQuestions: number }[] };
  getChapterProgress: (chId: string) => ChapterProgress; getAllProgress: () => ChapterProgress[];
  canGenerateCertificate: () => boolean; getOverallCompletion: () => number;
  generateCertificate: (remark?: string) => Certificate | null; verifyCertificate: (certId: string) => Certificate | null;
  addChapter: (ch: Omit<Chapter, 'id'>) => void; updateChapter: (id: string, d: Partial<Chapter>) => void; deleteChapter: (id: string) => void;
  addQuestion: (q: Omit<Question, 'id'>) => void; updateQuestion: (id: string, d: Partial<Question>) => void;
  deleteQuestion: (id: string) => void; bulkAddQuestions: (qs: Omit<Question, 'id'>[]) => void;
  updateSettings: (s: Partial<Settings>) => void; reopenTest: (sId: string, chId: string) => void;
  getAnalytics: () => { totalStudents: number; completedStudents: number; totalSchools: number; chapterPassRates: { chapterId: string; chapterName: string; passRate: number; avgScore: number; totalAttempts: number }[]; mostDifficultChapters: { chapterId: string; chapterName: string; avgScore: number }[]; recentAttempts: Attempt[] };
  getSchools: () => string[];
  getSchoolAnalytics: (sn: string) => { schoolName: string; totalStudents: number; completedStudents: number; avgScorePerChapter: { chapterId: string; chapterName: string; avgScore: number; attempts: number; passRate: number }[]; specialTestStats: { attempts: number; passed: number; avgScore: number } };
  getStudentDetail: (sId: string) => { student: Student | null; chapterProgress: ChapterProgress[]; specialAttempts: SpecialAttempt[]; hasCertificate: boolean; hasSpecialCertificate: boolean; totalAttemptsCount: number; avgScore: number };
  exportSchoolReports: (sn?: string) => string; exportStudentReports: () => string; addStudentRemark: (sId: string, remark: string) => void;
  selectedChapterId: string | null; setSelectedChapterId: (id: string | null) => void;
  selectedAttemptId: string | null; setSelectedAttemptId: (id: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentView: 'landing' as AppView, previousView: null,
      setCurrentView: (v) => set((s) => ({ previousView: s.currentView, currentView: v })),
      goBack: () => set((s) => ({ currentView: s.previousView || 'landing' })),
      navigateTo: (v, d) => set({ previousView: get().currentView, currentView: v, viewData: d || {} }),
      viewData: {},
      currentUser: null, userRole: null, students: [], admins: [],
      studentLogin: (email, password) => {
        const s = get().students.find(s => s.email === email && s.password === password);
        if (!s) return false;
        set({ currentUser: s, userRole: 'student' as UserRole, currentView: 'student-dashboard' as AppView });
        return true;
      },
      studentRegister: (name, email, password, school, rollNumber) => {
        if (get().students.find(s => s.email === email)) return false;
        const student: Student = { id: generateId(), name, email, password, class: 'XII', school, rollNumber, createdAt: new Date().toISOString() };
        set((s) => ({ students: [...s.students, student], currentUser: student, userRole: 'student' as UserRole, currentView: 'student-dashboard' as AppView }));
        return true;
      },
      adminLogin: (email, password) => {
        const a = get().admins.find(a => a.email === email && a.password === password);
        if (!a) return false;
        set({ currentUser: null, userRole: 'admin' as UserRole, currentView: 'admin-dashboard' as AppView });
        return true;
      },
      logout: () => set({ currentUser: null, userRole: null, currentView: 'landing' as AppView, currentTest: null, currentSpecialTest: null }),
      chapters: [], questions: [], attempts: [], certificates: [],
      specialAttempts: [], specialCertificates: [], settings: defaultSettings,
      initAppData: () => {
        const s = get();
        if (s.chapters.length === 0) {
          set({ chapters: sampleChapters, questions: sampleQuestions, admins: [defaultAdmin], settings: defaultSettings });
        }
      },
      currentTest: null, currentSpecialTest: null, _specialShuffleMappings: {},
      startTest: (chapterId) => {
        const { questions, settings, chapters } = get();
        const ch = chapters.find(c => c.id === chapterId);
        if (!ch) return;
        const pool = questions.filter(q => q.chapterId === chapterId && q.active);
        const count = Math.min(settings.questionsPerChapter, pool.length);
        const shuffled = shuffleArray(pool);
        const selected = shuffled.slice(0, count);
        set({ currentTest: { chapterId, questions: selected, answers: {}, startTime: Date.now(), currentIndex: 0, submitted: false }, currentView: 'test' as AppView });
      },
      answerQuestion: (qId, opt) => set((s) => { if (s.currentTest) s.currentTest = { ...s.currentTest, answers: { ...s.currentTest.answers, [qId]: opt } }; }),
      goToQuestion: (i) => set((s) => { if (s.currentTest) s.currentTest = { ...s.currentTest, currentIndex: i }; }),
      nextQuestion: () => set((s) => { if (s.currentTest && s.currentTest.currentIndex < s.currentTest.questions.length - 1) s.currentTest.currentIndex++; }),
      prevQuestion: () => set((s) => { if (s.currentTest && s.currentTest.currentIndex > 0) s.currentTest.currentIndex--; }),
      submitTest: () => {
        const { currentTest, currentUser, settings } = get();
        if (!currentTest || !currentUser || currentTest.submitted) return null;
        const answered = Object.values(currentTest.answers).filter(a => a !== null);
        const correct = currentTest.questions.reduce((c, q) => { const a = currentTest.answers[q.id]; return a === q.correctOption ? c + 1 : c; }, 0);
        const score = correct;
        const pct = Math.round((correct / currentTest.questions.length) * 100);
        const attempt: Attempt = {
          id: generateId(), studentId: currentUser.id, chapterId: currentTest.chapterId,
          answers: currentTest.answers, score, totalQuestions: currentTest.questions.length,
          correctCount: correct, wrongCount: answered.length - correct,
          unansweredCount: currentTest.questions.length - answered.length,
          percentage: pct, passed: pct >= settings.passPercentage,
          timeTaken: Math.floor((Date.now() - currentTest.startTime) / 1000),
          date: new Date().toISOString(), questionIds: currentTest.questions.map(q => q.id),
        };
        set((s) => ({ attempts: [...s.attempts, attempt], currentTest: null, currentView: 'result' as AppView, selectedAttemptId: attempt.id }));
        return attempt;
      },
      resumeTest: () => { if (get().currentTest && !get().currentTest.submitted) { set({ currentView: 'test' as AppView }); return true; } return false; },
      clearCurrentTest: () => set({ currentTest: null }),
      getTimerSeconds: () => {
        const { currentTest, settings } = get();
        if (!currentTest) return 0;
        if (!settings.timerEnabled) return 99999;
        const elapsed = Math.floor((Date.now() - currentTest.startTime) / 1000);
        return Math.max(0, settings.timerMinutes * 60 - elapsed);
      },
      startSpecialTest: () => {
        const { questions, chapters } = get();
        const perChapter = Math.ceil(50 / chapters.filter(c => c.active).length);
        const selected: Question[] = [];
        const mappings: Record<string, ShuffleResult> = {};
        for (const ch of chapters) {
          if (!ch.active) continue;
          const pool = questions.filter(q => q.chapterId === ch.id && q.active);
          const shuffled = shuffleArray(pool);
          for (const q of shuffled.slice(0, perChapter)) {
            const sr = shuffleOptions(q.options, q.correctOption);
            mappings[q.id] = sr;
            selected.push({ ...q, options: sr.shuffledOptions, correctOption: sr.newCorrectOption });
          }
        }
        const final = shuffleArray(selected).slice(0, 50);
        set({ currentSpecialTest: { questions: final, answers: {}, startTime: Date.now(), currentIndex: 0, submitted: false, timeLimitSeconds: 3600 }, _specialShuffleMappings: mappings, currentView: 'special-test' as AppView });
      },
      answerSpecialQuestion: (qId, opt) => set((s) => { if (s.currentSpecialTest) s.currentSpecialTest = { ...s.currentSpecialTest, answers: { ...s.currentSpecialTest.answers, [qId]: opt } }; }),
      goToSpecialQuestion: (i) => set((s) => { if (s.currentSpecialTest) s.currentSpecialTest = { ...s.currentSpecialTest, currentIndex: i }; }),
      nextSpecialQuestion: () => set((s) => { if (s.currentSpecialTest && s.currentSpecialTest.currentIndex < s.currentSpecialTest.questions.length - 1) s.currentSpecialTest.currentIndex++; }),
      prevSpecialQuestion: () => set((s) => { if (s.currentSpecialTest && s.currentSpecialTest.currentIndex > 0) s.currentSpecialTest.currentIndex--; }),
      submitSpecialTest: () => {
        const { currentSpecialTest, currentUser, chapters, _specialShuffleMappings } = get();
        if (!currentSpecialTest || !currentUser || currentSpecialTest.submitted) return null;
        const answered = Object.values(currentSpecialTest.answers).filter(a => a !== null);
        const correct = currentSpecialTest.questions.reduce((c, q) => { const a = currentSpecialTest.answers[q.id]; return a === q.correctOption ? c + 1 : c; }, 0);
        const pct = Math.round((correct / currentSpecialTest.questions.length) * 100);
        const breakdown: { chapterId: string; chapterName: string; total: number; correct: number }[] = [];
        for (const ch of chapters) {
          const chQs = currentSpecialTest.questions.filter(q => q.chapterId === ch.id);
          if (chQs.length === 0) continue;
          const chCorrect = chQs.reduce((c, q) => { const a = currentSpecialTest.answers[q.id]; return a === q.correctOption ? c + 1 : c; }, 0);
          breakdown.push({ chapterId: ch.id, chapterName: ch.name, total: chQs.length, correct: chCorrect });
        }
        const attempt: SpecialAttempt = {
          id: generateId(), studentId: currentUser.id, answers: currentSpecialTest.answers,
          score: correct, totalQuestions: currentSpecialTest.questions.length,
          correctCount: correct, wrongCount: answered.length - correct,
          unansweredCount: currentSpecialTest.questions.length - answered.length,
          percentage: pct, passed: pct >= 75,
          timeTaken: Math.floor((Date.now() - currentSpecialTest.startTime) / 1000),
          date: new Date().toISOString(), questionIds: currentSpecialTest.questions.map(q => q.id), chapterBreakdown: breakdown,
        };
        set((s) => ({ specialAttempts: [...s.specialAttempts, attempt], currentSpecialTest: null, _specialShuffleMappings: {}, currentView: 'special-test-result' as AppView }));
        return attempt;
      },
      clearSpecialTest: () => set({ currentSpecialTest: null, _specialShuffleMappings: {} }),
      getSpecialTimerSeconds: () => {
        const { currentSpecialTest } = get();
        if (!currentSpecialTest) return 0;
        return Math.max(0, currentSpecialTest.timeLimitSeconds - Math.floor((Date.now() - currentSpecialTest.startTime) / 1000));
      },
      getStudentSpecialAttempts: () => { const { specialAttempts, currentUser } = get(); return currentUser ? specialAttempts.filter(a => a.studentId === currentUser.id) : []; },
      canGenerateSpecialCertificate: () => { const attempts = get().getStudentSpecialAttempts(); return attempts.some(a => a.passed) && !get().specialCertificates.find(c => c.studentId === get().currentUser?.id); },
      generateSpecialCertificate: (remark) => {
        const { currentUser, getStudentSpecialAttempts, specialCertificates } = get();
        if (!currentUser) return null;
        const best = getStudentSpecialAttempts().filter(a => a.passed).sort((a, b) => b.percentage - a.percentage)[0];
        if (!best) return null;
        const cert: SpecialCertificate = { id: generateId(), certificateId: 'SPE-' + generateId().substring(0, 8).toUpperCase(), studentId: currentUser.id, studentName: currentUser.name, schoolName: currentUser.school, date: new Date().toISOString(), score: best.score, totalQuestions: best.totalQuestions, percentage: best.percentage, teacherRemark: remark };
        set({ specialCertificates: [...specialCertificates, cert], currentView: 'special-certificate' as AppView });
        return cert;
      },
      getSpecialAnalytics: () => {
        const { specialAttempts } = get();
        if (specialAttempts.length === 0) return { totalAttempts: 0, passCount: 0, avgScore: 0, highestScore: 0, chapterAverages: [] };
        return { totalAttempts: specialAttempts.length, passCount: specialAttempts.filter(a => a.passed).length, avgScore: Math.round(specialAttempts.reduce((s, a) => s + a.percentage, 0) / specialAttempts.length), highestScore: Math.max(...specialAttempts.map(a => a.percentage)), chapterAverages: [] };
      },
      getChapterProgress: (chId) => {
        const { attempts, currentUser, questions, settings } = get();
        if (!currentUser) return { chapterId: chId, status: 'not_started' as const, attempts: 0, highestScore: 0, latestScore: 0, latestPercentage: 0, passed: false, weakTopics: [] };
        const chAttempts = attempts.filter(a => a.studentId === currentUser.id && a.chapterId === chId);
        if (chAttempts.length === 0) return { chapterId: chId, status: 'not_started', attempts: 0, highestScore: 0, latestScore: 0, latestPercentage: 0, passed: false, weakTopics: [] };
        const latest = chAttempts[chAttempts.length - 1];
        const best = chAttempts.reduce((b, a) => a.percentage > b.percentage ? a : b, chAttempts[0]);
        const passed = best.percentage >= settings.passPercentage;
        const wrongTopics: string[] = [];
        const chQs = questions.filter(q => q.chapterId === chId);
        if (chAttempts.length > 0) {
          const last = chAttempts[chAttempts.length - 1];
          for (const q of chQs) {
            const a = last.answers[q.id];
            if (a !== null && a !== q.correctOption) wrongTopics.push(q.topic);
          }
        }
        return { chapterId: chId, status: passed ? 'passed' : chAttempts.length > 0 && !passed ? 'in_progress' : 'not_started', attempts: chAttempts.length, highestScore: best.percentage, latestScore: latest.percentage, latestPercentage: latest.percentage, passed, lastAttemptDate: latest.date, timeTaken: latest.timeTaken, weakTopics: [...new Set(wrongTopics)] };
      },
      getAllProgress: () => { const { chapters } = get(); return chapters.filter(c => c.active).map(c => get().getChapterProgress(c.id)); },
      canGenerateCertificate: () => { const { chapters, currentUser, certificates } = get(); if (!currentUser) return false; const active = chapters.filter(c => c.active); const allPassed = active.every(c => get().getChapterProgress(c.id).passed); return allPassed && !certificates.find(c => c.studentId === currentUser.id); },
      getOverallCompletion: () => { const { chapters } = get(); const active = chapters.filter(c => c.active); if (active.length === 0) return 0; return Math.round((active.filter(c => get().getChapterProgress(c.id).passed).length / active.length) * 100); },
      generateCertificate: (remark) => {
        const { currentUser, certificates } = get();
        if (!currentUser || !get().canGenerateCertificate()) return null;
        const cert: Certificate = { id: generateId(), certificateId: 'CERT-' + generateId().substring(0, 8).toUpperCase(), studentId: currentUser.id, studentName: currentUser.name, schoolName: currentUser.school, date: new Date().toISOString(), teacherRemark: remark };
        set({ certificates: [...certificates, cert], currentView: 'certificate' as AppView });
        return cert;
      },
      verifyCertificate: (certId) => { const { certificates, specialCertificates } = get(); return certificates.find(c => c.certificateId === certId) || specialCertificates.find(c => c.certificateId === certId) || null; },
      addChapter: (ch) => set((s) => ({ chapters: [...s.chapters, { ...ch, id: generateId() }] })),
      updateChapter: (id, d) => set((s) => ({ chapters: s.chapters.map(c => c.id === id ? { ...c, ...d } : c) })),
      deleteChapter: (id) => set((s) => ({ chapters: s.chapters.filter(c => c.id !== id) })),
      addQuestion: (q) => set((s) => ({ questions: [...s.questions, { ...q, id: generateId() }] })),
      updateQuestion: (id, d) => set((s) => ({ questions: s.questions.map(q => q.id === id ? { ...q, ...d } : q) })),
      deleteQuestion: (id) => set((s) => ({ questions: s.questions.filter(q => q.id !== id) })),
      bulkAddQuestions: (qs) => set((s) => ({ questions: [...s.questions, ...qs.map(q => ({ ...q, id: generateId() }))] })),
      updateSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),
      reopenTest: (sId, chId) => { const { attempts } = get(); const idx = attempts.findIndex(a => a.studentId === sId && a.chapterId === chId); if (idx >= 0) set({ attempts: attempts.filter((_, i) => i !== idx) }); },
      getAnalytics: () => {
        const { students, chapters, attempts } = get();
        const active = chapters.filter(c => c.active);
        const studentIds = [...new Set(attempts.map(a => a.studentId))];
        const completed = studentIds.filter(sid => active.every(c => attempts.some(a => a.studentId === sid && a.chapterId === c.id && a.passed)));
        const schools = [...new Set(students.map(s => s.school))];
        const passRates = active.map(ch => {
          const chAttempts = attempts.filter(a => a.chapterId === ch.id);
          const passed = chAttempts.filter(a => a.passed).length;
          return { chapterId: ch.id, chapterName: ch.name, passRate: chAttempts.length > 0 ? Math.round((passed / chAttempts.length) * 100) : 0, avgScore: chAttempts.length > 0 ? Math.round(chAttempts.reduce((s, a) => s + a.percentage, 0) / chAttempts.length) : 0, totalAttempts: chAttempts.length };
        });
        const difficult = [...passRates].sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);
        const recent = [...attempts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
        return { totalStudents: students.length, completedStudents: completed.length, totalSchools: schools.length, chapterPassRates: passRates, mostDifficultChapters: difficult, recentAttempts: recent };
      },
      getSchools: () => [...new Set(get().students.map(s => s.school))],
      getSchoolAnalytics: (sn) => {
        const { students, attempts, chapters, specialAttempts } = get();
        const schoolStudents = students.filter(s => s.school === sn);
        const completed = schoolStudents.filter(st => chapters.filter(c => c.active).every(c => attempts.some(a => a.studentId === st.id && a.chapterId === c.id && a.passed)));
        const avgPerCh = chapters.filter(c => c.active).map(ch => {
          const chA = attempts.filter(a => a.studentId !== undefined && schoolStudents.some(s => s.id === a.studentId) && a.chapterId === ch.id);
          return { chapterId: ch.id, chapterName: ch.name, avgScore: chA.length > 0 ? Math.round(chA.reduce((s, a) => s + a.percentage, 0) / chA.length) : 0, attempts: chA.length, passRate: chA.length > 0 ? Math.round((chA.filter(a => a.passed).length / chA.length) * 100) : 0 };
        });
        const schoolSpecial = specialAttempts.filter(a => schoolStudents.some(s => s.id === a.studentId));
        return { schoolName: sn, totalStudents: schoolStudents.length, completedStudents: completed.length, avgScorePerChapter: avgPerCh, specialTestStats: { attempts: schoolSpecial.length, passed: schoolSpecial.filter(a => a.passed).length, avgScore: schoolSpecial.length > 0 ? Math.round(schoolSpecial.reduce((s, a) => s + a.percentage, 0) / schoolSpecial.length) : 0 } };
      },
      getStudentDetail: (sId) => {
        const { students, chapters, specialAttempts, certificates, specialCertificates, attempts } = get();
        const student = students.find(s => s.id === sId) || null;
        if (!student) return { student: null, chapterProgress: [], specialAttempts: [], hasCertificate: false, hasSpecialCertificate: false, totalAttemptsCount: 0, avgScore: 0 };
        const studentAttempts = attempts.filter(a => a.studentId === sId);
        const chProgress = chapters.filter(c => c.active).map(c => get().getChapterProgress(c.id));
        const sa = specialAttempts.filter(a => a.studentId === sId);
        return { student, chapterProgress: chProgress, specialAttempts: sa, hasCertificate: certificates.some(c => c.studentId === sId), hasSpecialCertificate: specialCertificates.some(c => c.studentId === sId), totalAttemptsCount: studentAttempts.length, avgScore: studentAttempts.length > 0 ? Math.round(studentAttempts.reduce((s, a) => s + a.percentage, 0) / studentAttempts.length) : 0 };
      },
      exportSchoolReports: (sn) => {
        const analytics = sn ? get().getSchoolAnalytics(sn) : null;
        if (!analytics) { const all = get().getSchools(); return all.map(s => get().exportSchoolReports(s)).join('\n\n'); }
        let report = `School: ${analytics.schoolName}\nStudents: ${analytics.totalStudents}\nCompleted: ${analytics.completedStudents}\n\nChapter Performance:\n`;
        analytics.avgScorePerChapter.forEach(c => { report += `${c.chapterName}: Avg ${c.avgScore}%, Pass Rate ${c.passRate}%, Attempts: ${c.attempts}\n`; });
        report += `\nSpecial Test: ${analytics.specialTestStats.attempts} attempts, ${analytics.specialTestStats.passed} passed, Avg Score: ${analytics.specialTestStats.avgScore}%\n`;
        return report;
      },
      exportStudentReports: () => { const { students } = get(); return students.map(s => `Name: ${s.name}, School: ${s.school}, Email: ${s.email}`).join('\n'); },
      addStudentRemark: () => {},
      selectedChapterId: null, setSelectedChapterId: (id) => set({ selectedChapterId: id }),
      selectedAttemptId: null, setSelectedAttemptId: (id) => set({ selectedAttemptId: id }),
    }),
    { name: 'nathans-physics-mcq', partialize: (s) => ({ students: s.students, admins: s.admins, chapters: s.chapters, questions: s.questions, attempts: s.attempts, certificates: s.certificates, specialAttempts: s.specialAttempts, specialCertificates: s.specialCertificates, settings: s.settings, currentUser: s.currentUser, userRole: s.userRole, currentView: s.currentView }) }
  )
);