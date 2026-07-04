'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { AppView, Question, Attempt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  GraduationCap, BookOpen, BarChart3, Award, Check, X, Clock, ChevronLeft, ChevronRight,
  Info, Copy, CheckCircle2, HelpCircle, Share2, ChevronDown, ChevronUp, BookMarked,
  ClipboardList, Sparkles, Flame, Search, Home, ArrowLeft, Target, Trophy, Zap,
  Shield, Users, PlayCircle, Lock, Unlock, Eye, Star, TrendingUp, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

function getAppLink() {
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

const SHAREABLE_APP_TEXT = `📚 Nathan's Physics MCQ — Complete Class 12 Physics Practice App

🎓 Master all 14 NCERT Class 12 Physics chapters with:
   ✅ Chapter-wise MCQ tests with instant scoring
   ✅ Detailed answer review with explanations
   ✅ Progress tracking & performance analytics
   ✅ Special 50-question Challenge Test
   ✅ Dual certificate system (Chapter Completion + Special Challenge)
   ✅ Admin panel for teachers to manage content & track students

📋 Covers: Electric Charges, Electrostatics, Current Electricity, Magnetism, EMI, AC, EM Waves, Ray & Wave Optics, Dual Nature, Atoms, Nuclei, Semiconductors, and more!

🔐 Register as student, take tests, earn certificates. Teachers can manage questions, view analytics, and generate school reports.

📱 Works on mobile & desktop. Dark mode supported.`;

function getShareableText() {
  const link = getAppLink();
  return SHAREABLE_APP_TEXT + (link ? `\n\n🔗 App Link: ${link}` : '');
}
function getShareOneLiner() {
  const link = getAppLink();
  return `Nathan's Physics MCQ: Master all 14 NCERT Class 12 Physics chapters with chapter-wise tests, analytics, and certificates!` + (link ? ` ${link}` : '');
}

const CHAPTER_NAMES = [
  'Electric Charges & Fields','Electrostatic Potential & Capacitance','Current Electricity',
  'Moving Charges & Magnetism','Magnetism & Matter','Electromagnetic Induction',
  'Alternating Current','Electromagnetic Waves','Ray Optics','Wave Optics',
  'Dual Nature of Radiation & Matter','Atoms','Nuclei','Semiconductor Electronics'
];

const FEATURE_CARDS = [
  { icon: <BookOpen className="h-6 w-6" />, title: 'Chapter Tests', desc: '14 chapter-wise MCQ tests covering the entire NCERT syllabus' },
  { icon: <BarChart3 className="h-6 w-6" />, title: 'Analytics', desc: 'Detailed progress tracking with chapter-wise performance breakdown' },
  { icon: <Flame className="h-6 w-6" />, title: 'Special Challenge', desc: '50-question mixed test from all chapters for advanced practice' },
  { icon: <Award className="h-6 w-6" />, title: 'Dual Certificates', desc: 'Earn chapter completion & special challenge certificates' },
  { icon: <Eye className="h-6 w-6" />, title: 'Answer Review', desc: 'Review every answer with detailed explanations after each test' },
  { icon: <Shield className="h-6 w-6" />, title: 'Admin Panel', desc: 'Teachers manage questions, students, analytics & certificates' },
];

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="gap-1.5">
      {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : (label || 'Copy')}
    </Button>
  );
}

function LandingShareButton() {
  const [copied, setCopied] = useState(false);
  return (
    <Button variant="outline" className="gap-2" onClick={() => { navigator.clipboard.writeText(getShareOneLiner()); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <Share2 className="h-4 w-4" /> {copied ? 'Copied!' : 'Share This App'}
    </Button>
  );
}

/* ============ LANDING PAGE ============ */
export function LandingPage() {
  const { setCurrentView } = useAppStore();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center py-12 md:py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-6">
            <GraduationCap className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Nathan&apos;s Physics MCQ</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">Master Class 12 NCERT Physics — Chapter-wise MCQ Tests, Analytics &amp; Certificates</p>
          <p className="text-sm text-muted-foreground">14 Chapters &bull; Instant Results &bull; Detailed Explanations</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCurrentView('student-register' as AppView)}>
              <GraduationCap className="h-4 w-4" /> Register as Student
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => setCurrentView('admin-login' as AppView)}>
              <Shield className="h-4 w-4" /> Admin Login
            </Button>
          </div>
          <button className="text-sm text-muted-foreground hover:text-emerald-600 mt-4 underline" onClick={() => setCurrentView('certificate-verify' as AppView)}>Verify a Certificate</button>
        </div>

        {/* Help Info Section */}
        <div className="space-y-8 pb-8">
          {/* What is */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-emerald-600" /> What is Nathan&apos;s Physics MCQ?</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Nathan&apos;s Physics MCQ is a comprehensive practice platform designed for Class 12 students preparing for board exams and competitive tests. It covers all 14 chapters of NCERT Class 12 Physics with chapter-wise MCQ tests, detailed answer reviews, performance analytics, and a certificate system. Teachers can use the admin panel to manage questions, track student progress, and generate school-wide reports.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURE_CARDS.map((f, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2"><div className="text-emerald-600">{f.icon}</div><CardTitle className="text-base">{f.title}</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">{f.desc}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Use */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-emerald-600" /> How to Use (Students)</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {[
                  { step: 1, title: 'Register', desc: 'Sign up with your name, email, school, and create a password.' },
                  { step: 2, title: 'Choose a Chapter', desc: 'Browse all 14 NCERT chapters on your dashboard and pick one to start.' },
                  { step: 3, title: 'Take the Test', desc: 'Answer MCQs within the time limit (if enabled). Review and submit when ready.' },
                  { step: 4, title: 'Review Results', desc: 'See your score, correct/wrong breakdown, and read explanations for every question.' },
                  { step: 5, title: 'Earn Certificates', desc: 'Pass all chapters to earn a Completion Certificate. Ace the Special Challenge for a second one!' },
                ].map((s) => (
                  <li key={s.step} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">{s.step}</span>
                    <div><p className="font-medium">{s.title}</p><p className="text-sm text-muted-foreground">{s.desc}</p></div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* 14 Chapters */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BookMarked className="h-5 w-5 text-emerald-600" /> 14 Chapters Covered</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CHAPTER_NAMES.map((ch, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>{i + 1}. {ch}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Share */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
            <CardHeader><CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5 text-emerald-600" /> Share This App</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Share this app with your classmates and friends!</p>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-3 text-sm text-muted-foreground whitespace-pre-line border">{SHAREABLE_ONE_LINER}</div>
              <div className="flex gap-2">
                <CopyButton text={SHAREABLE_ONE_LINER} label="Copy One-Liner" />
                <CopyButton text={SHAREABLE_APP_TEXT} label="Copy Full Details" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom */}
        <div className="text-center py-6 text-sm text-muted-foreground border-t">
          <p>Made with care for Physics students</p>
          <p className="mt-1 text-xs">Nathan&apos;s Physics MCQ &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

/* ============ STUDENT LOGIN ============ */
export function StudentLoginPage() {
  const { studentLogin, setCurrentView } = useAppStore();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const handle = (e: React.FormEvent) => { e.preventDefault(); if (studentLogin(email, password)) setError(''); else setError('Invalid email or password'); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center"><GraduationCap className="h-10 w-10 text-emerald-600 mx-auto mb-2" /><CardTitle>Student Login</CardTitle><CardDescription>Sign in to continue your practice</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handle} className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@school.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div><Label htmlFor="pass">Password</Label><Input id="pass" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center"><p className="text-sm text-muted-foreground">Don&apos;t have an account? <button className="text-emerald-600 underline" onClick={() => setCurrentView('student-register' as AppView)}>Register</button></p></CardFooter>
      </Card>
    </div>
  );
}

/* ============ STUDENT REGISTER ============ */
export function StudentRegisterPage() {
  const { studentRegister, setCurrentView } = useAppStore();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [school, setSchool] = useState(''); const [roll, setRoll] = useState(''); const [error, setError] = useState('');
  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentRegister(name, email, password, school, roll || undefined)) setError('');
    else setError('Email already registered');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center"><GraduationCap className="h-10 w-10 text-emerald-600 mx-auto mb-2" /><CardTitle>Create Account</CardTitle><CardDescription>Register to start practicing Physics</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handle} className="space-y-3">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div><Label>Full Name</Label><Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required /></div>
            <div><Label>Email</Label><Input type="email" placeholder="you@school.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" placeholder="Min 4 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={4} /></div>
            <div><Label>School Name</Label><Input placeholder="Your school" value={school} onChange={e => setSchool(e.target.value)} required /></div>
            <div><Label>Roll Number (optional)</Label><Input placeholder="e.g. 12-A-01" value={roll} onChange={e => setRoll(e.target.value)} /></div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center"><p className="text-sm text-muted-foreground">Already registered? <button className="text-emerald-600 underline" onClick={() => setCurrentView('student-login' as AppView)}>Login</button></p></CardFooter>
      </Card>
    </div>
  );
}

/* ============ STUDENT DASHBOARD ============ */
export function StudentDashboard() {
  const { chapters, setCurrentView, setSelectedChapterId, getAllProgress, getOverallCompletion, canGenerateCertificate, settings, currentUser, getStudentSpecialAttempts, canGenerateSpecialCertificate } = useAppStore();
  const progress = getAllProgress();
  const completion = getOverallCompletion();
  const canCert = canGenerateCertificate();
  const activeChapters = chapters.filter(c => c.active).sort((a, b) => a.order - b.order);
  const attemptedAll = activeChapters.every(c => progress.find(p => p.chapterId === c.id)?.attempts > 0);
  const specialAttempts = getStudentSpecialAttempts();
  const canSpecialCert = canGenerateSpecialCertificate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}! 👋</h1>
        <p className="text-muted-foreground">Continue your Physics practice journey</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Overall Progress</span><span className="text-sm text-muted-foreground">{completion}%</span></div>
          <Progress value={completion} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">{activeChapters.filter(c => progress.find(p => p.chapterId === c.id)?.passed).length} of {activeChapters.length} chapters passed &bull; Pass criteria: {settings.passPercentage}%</p>
        </CardContent>
      </Card>

      {/* Chapter Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">📚 Chapters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeChapters.map((ch) => {
            const p = progress.find(pr => pr.chapterId === ch.id) || { status: 'not_started' as const, attempts: 0, highestScore: 0, passed: false };
            const statusColor = p.status === 'passed' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : p.status === 'in_progress' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-500 bg-gray-50 dark:bg-gray-800';
            const statusLabel = p.status === 'passed' ? '✅ Passed' : p.status === 'in_progress' ? '🔄 In Progress' : '📝 Not Started';
            return (
              <Card key={ch.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedChapterId(ch.id); setCurrentView('chapter-intro' as AppView); }}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm leading-tight flex-1 mr-2">{ch.name}</h3>
                    <Badge variant="secondary" className={cn('text-[10px] flex-shrink-0', statusColor)}>{statusLabel}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{ch.topics.length} topics</p>
                  {p.attempts > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span>Best: {p.highestScore}%</span><span>{p.attempts} attempt{p.attempts > 1 ? 's' : ''}</span></div>
                      <Progress value={p.highestScore} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Certificates Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {canCert && (
          <Card className="border-emerald-300 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 cursor-pointer" onClick={() => setCurrentView('certificate' as AppView)}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-emerald-600" />
              <div><p className="font-medium">🎓 Completion Certificate Ready!</p><p className="text-sm text-muted-foreground">You passed all chapters. Click to generate.</p></div>
            </CardContent>
          </Card>
        )}
        {attemptedAll && (
          <Card className="cursor-pointer hover:shadow-md" onClick={() => setCurrentView('special-test-intro' as AppView)}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-500" />
              <div><p className="font-medium">🔥 Special Challenge Test</p><p className="text-sm text-muted-foreground">50 mixed questions from all chapters</p></div>
            </CardContent>
          </Card>
        )}
        {canSpecialCert && (
          <Card className="border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 cursor-pointer" onClick={() => setCurrentView('special-certificate' as AppView)}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-600" />
              <div><p className="font-medium">🏆 Special Certificate Ready!</p><p className="text-sm text-muted-foreground">You passed the challenge. Click to generate.</p></div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dashboard Help Card */}
      <DashboardHelpCard />
    </div>
  );
}

/* ============ DASHBOARD HELP CARD ============ */
export function DashboardHelpCard() {
  const [expanded, setExpanded] = useState(false);
  const { setCurrentView } = useAppStore();
  return (
    <Card className="border-sky-200 dark:border-sky-800 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-sky-600" />
            <span className="font-medium text-sm">App Help & Info</span>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
        {expanded && (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {['Chapter Tests', 'Analytics', 'Special Test', 'Certificates', 'Answer Review', 'Admin Panel'].map(f => (
                <Badge key={f} variant="secondary" className="text-xs bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300">{f}</Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Quick Start:</strong></p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Pick a chapter from the grid above</li>
                <li>Answer the MCQs and submit</li>
                <li>Review your answers with explanations</li>
                <li>Pass all 14 chapters to earn your certificate!</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setCurrentView('help-info' as AppView)}>📖 Full Details</Button>
              <CopyButton text={SHAREABLE_APP_TEXT} label="📋 Copy to Share" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ============ CHAPTER INTRO ============ */
export function ChapterIntroPage() {
  const { selectedChapterId, chapters, setCurrentView, startTest, getChapterProgress, attempts, questions } = useAppStore();
  const chapter = chapters.find(c => c.id === selectedChapterId);
  const progress = getChapterProgress(selectedChapterId || '');
  const chAttempts = attempts.filter(a => a.chapterId === selectedChapterId);
  const qCount = questions.filter(q => q.chapterId === selectedChapterId).length;

  if (!chapter) return <div className="p-8 text-center">Chapter not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => setCurrentView('student-dashboard' as AppView)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</button>
      <div>
        <Badge variant="secondary" className="mb-2">Chapter {chapter.order}</Badge>
        <h1 className="text-2xl font-bold">{chapter.name}</h1>
        <p className="text-muted-foreground mt-1">{chapter.description}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Topics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {chapter.topics.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm"><Check className="h-3.5 w-3.5 text-emerald-500" />{t}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Your Progress</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold">{progress.attempts}</p><p className="text-xs text-muted-foreground">Attempts</p></div>
            <div><p className="text-2xl font-bold">{progress.highestScore}%</p><p className="text-xs text-muted-foreground">Best Score</p></div>
            <div><p className="text-2xl font-bold">{qCount}</p><p className="text-xs text-muted-foreground">Questions</p></div>
          </div>
          {progress.attempts > 0 && <Progress value={progress.highestScore} className="h-2" />}
          {progress.passed && <p className="text-sm text-emerald-600 font-medium">✅ Chapter passed!</p>}
        </CardContent>
      </Card>

      {chAttempts.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Previous Attempts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chAttempts.map((a, i) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">Attempt {i + 1}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={a.passed ? 'text-emerald-600' : 'text-red-500'}>{a.percentage}% {a.passed ? '✅' : '❌'}</span>
                    <span className="text-muted-foreground">{Math.floor(a.timeTaken / 60)}m {a.timeTaken % 60}s</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={() => startTest(chapter.id)}>
        <PlayCircle className="h-5 w-5" /> Start Test
      </Button>
    </div>
  );
}

/* ============ TEST PAGE ============ */
export function TestPage() {
  const { currentTest, answerQuestion, goToQuestion, nextQuestion, prevQuestion, submitTest, setCurrentView, getTimerSeconds, settings } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(99999);

  useEffect(() => {
    if (!currentTest || !settings.timerEnabled) return;
    const iv = setInterval(() => { setTimeLeft(getTimerSeconds()); if (getTimerSeconds() <= 0) submitTest(); }, 1000);
    return () => clearInterval(iv);
  }, [currentTest, settings.timerEnabled]);

  if (!currentTest) return <div className="p-8 text-center">No active test</div>;
  const q = currentTest.questions[currentTest.currentIndex];
  const selectedOpt = currentTest.answers[q.id];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentView('chapter-intro' as AppView)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Exit</button>
        {settings.timerEnabled && (
          <div className={cn('flex items-center gap-1 text-sm font-mono', timeLeft < 60 ? 'text-red-500' : 'text-muted-foreground')}>
            <Clock className="h-4 w-4" /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        )}
        <span className="text-sm text-muted-foreground">{currentTest.currentIndex + 1} / {currentTest.questions.length}</span>
      </div>

      <Progress value={((currentTest.currentIndex + 1) / currentTest.questions.length) * 100} className="h-1.5" />

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
            <Badge variant="secondary" className="text-xs">{q.topic}</Badge>
          </div>
          <p className="text-lg font-medium mb-6">{q.questionText}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => answerQuestion(q.id, i)}
                className={cn('w-full text-left p-3 rounded-lg border-2 transition-colors text-sm',
                  selectedOpt === i ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-muted hover:border-emerald-300 dark:hover:border-emerald-700'
                )}>
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <p className="text-xs font-medium mb-2 text-muted-foreground">Question Navigation</p>
          <div className="flex flex-wrap gap-1.5">
            {currentTest.questions.map((tq, i) => {
              const answered = currentTest.answers[tq.id] !== undefined && currentTest.answers[tq.id] !== null;
              const isCurrent = i === currentTest.currentIndex;
              return (
                <button key={tq.id} onClick={() => goToQuestion(i)}
                  className={cn('w-8 h-8 rounded text-xs font-medium transition-colors',
                    isCurrent ? 'bg-emerald-600 text-white' : answered ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground'
                  )}>{i + 1}</button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevQuestion} disabled={currentTest.currentIndex === 0}><ChevronLeft className="h-4 w-4" /> Previous</Button>
        <Button variant="destructive" onClick={() => submitTest()}>Submit Test</Button>
        <Button variant="outline" onClick={nextQuestion} disabled={currentTest.currentIndex === currentTest.questions.length - 1}>Next <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

/* ============ RESULT PAGE ============ */
export function ResultPage() {
  const { selectedAttemptId, attempts, setCurrentView, chapters, questions } = useAppStore();
  const attempt = attempts.find(a => a.id === selectedAttemptId);
  if (!attempt) return <div className="p-8 text-center">No result found</div>;
  const chapter = chapters.find(c => c.id === attempt.chapterId);
  const timeStr = `${Math.floor(attempt.timeTaken / 60)}m ${attempt.timeTaken % 60}s`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <div className={cn('inline-flex items-center justify-center w-20 h-20 rounded-full mb-4', attempt.passed ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-red-100 dark:bg-red-900/40')}>
          {attempt.passed ? <Trophy className="h-10 w-10 text-emerald-600" /> : <AlertCircle className="h-10 w-10 text-red-500" />}
        </div>
        <h1 className="text-2xl font-bold">{attempt.passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}</h1>
        <p className="text-muted-foreground">{chapter?.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card><CardContent className="pt-4 text-center"><p className="text-3xl font-bold">{attempt.percentage}%</p><p className="text-xs text-muted-foreground">Score</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-3xl font-bold">{attempt.correctCount}/{attempt.totalQuestions}</p><p className="text-xs text-muted-foreground">Correct</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-red-500">{attempt.wrongCount}</p><p className="text-xs text-muted-foreground">Wrong</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{timeStr}</p><p className="text-xs text-muted-foreground">Time Taken</p></CardContent></Card>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCurrentView('review' as AppView)}><Eye className="h-4 w-4 mr-2" />Review Answers</Button>
        <Button variant="outline" className="flex-1" onClick={() => setCurrentView('student-dashboard' as AppView)}>Dashboard</Button>
      </div>
    </div>
  );
}

/* ============ REVIEW PAGE ============ */
export function ReviewPage() {
  const { selectedAttemptId, attempts, questions, setCurrentView } = useAppStore();
  const attempt = attempts.find(a => a.id === selectedAttemptId);
  if (!attempt) return <div className="p-8 text-center">No attempt found</div>;
  const attemptQuestions = questions.filter(q => attempt.questionIds.includes(q.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Answer Review</h1>
        <Button variant="outline" size="sm" onClick={() => setCurrentView('student-dashboard' as AppView)}>Back</Button>
      </div>
      {attemptQuestions.map((q, i) => {
        const userAnswer = attempt.answers[q.id];
        const isCorrect = userAnswer === q.correctOption;
        const isUnanswered = userAnswer === null || userAnswer === undefined;
        return (
          <Card key={q.id} className={cn('border-l-4', isUnanswered ? 'border-l-gray-400' : isCorrect ? 'border-l-emerald-500' : 'border-l-red-500')}>
            <CardContent className="pt-4 pb-4">
              <p className="font-medium text-sm mb-2">Q{i + 1}. {q.questionText}</p>
              <div className="space-y-1 text-sm">
                {q.options.map((opt, oi) => (
                  <div key={oi} className={cn('p-1.5 rounded', oi === q.correctOption ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium' : oi === userAnswer && !isCorrect ? 'bg-red-50 dark:bg-red-900/20 text-red-600 line-through' : 'text-muted-foreground')}>
                    {String.fromCharCode(65 + oi)}. {opt} {oi === q.correctOption && ' ✓'} {oi === userAnswer && !isCorrect && ' (your answer)'}
                  </div>
                ))}
              </div>
              {isUnanswered && <p className="text-xs text-gray-500 mt-1">Not answered</p>}
              <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">💡 {q.explanation}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ============ PROGRESS REPORT ============ */
export function ProgressReportPage() {
  const { chapters, getChapterProgress, getOverallCompletion } = useAppStore();
  const progress = getAllProgress(chapters);
  const completion = getOverallCompletion();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Progress Report</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2"><span className="font-medium">Overall Completion</span><span className="text-lg font-bold text-emerald-600">{completion}%</span></div>
          <Progress value={completion} className="h-3" />
        </CardContent>
      </Card>
      <div className="space-y-3">
        {chapters.filter(c => c.active).sort((a, b) => a.order - b.order).map(ch => {
          const p = progress.find(pr => pr.chapterId === ch.id) || { attempts: 0, highestScore: 0, passed: false, status: 'not_started' as const };
          return (
            <Card key={ch.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{ch.name}</span>
                    {p.passed ? <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px]">Passed</Badge> : p.attempts > 0 ? <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px]">In Progress</Badge> : null}
                  </div>
                  <span className="text-sm font-medium">{p.highestScore}%</span>
                </div>
                <Progress value={p.highestScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{p.attempts} attempt{p.attempts !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
function getAllProgress(chapters: any[]) {
  const { getChapterProgress } = useAppStore.getState();
  return chapters.filter(c => c.active).map(c => getChapterProgress(c.id));
}

/* ============ CERTIFICATE PAGE ============ */
export function CertificatePage() {
  const { canGenerateCertificate, generateCertificate, certificates, currentUser, setCurrentView } = useAppStore();
  const [remark, setRemark] = useState('');
  const cert = certificates.find(c => c.studentId === currentUser?.id);

  if (cert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="border-4 border-double border-emerald-600 p-8 bg-white dark:bg-gray-900 rounded-lg">
          <div className="text-center space-y-4">
            <GraduationCap className="h-12 w-12 text-emerald-600 mx-auto" />
            <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Certificate of Completion</h1>
            <p className="text-muted-foreground">This is to certify that</p>
            <p className="text-3xl font-bold">{cert.studentName}</p>
            <p className="text-muted-foreground">from <strong>{cert.schoolName}</strong></p>
            <p className="text-muted-foreground">has successfully completed all 14 chapters of</p>
            <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Nathan&apos;s Physics MCQ</p>
            <p className="text-muted-foreground">Class 12 NCERT Physics</p>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div><p>Date: {new Date(cert.date).toLocaleDateString()}</p></div>
              <div className="text-right"><p>ID: {cert.certificateId}</p></div>
            </div>
            {cert.teacherRemark && <p className="text-sm italic text-muted-foreground">&quot;{cert.teacherRemark}&quot;</p>}
          </div>
        </div>
        <div className="mt-4 text-center"><Button variant="outline" onClick={() => setCurrentView('student-dashboard' as AppView)}>Back to Dashboard</Button></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <Card>
        <CardHeader className="text-center"><Award className="h-10 w-10 text-emerald-600 mx-auto mb-2" /><CardTitle>Generate Certificate</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {canGenerateCertificate() ? (
            <>
              <p className="text-sm text-muted-foreground text-center">You&apos;ve passed all chapters! Add an optional remark and generate your certificate.</p>
              <div><Label>Teacher Remark (optional)</Label><Textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="Outstanding performance!" rows={2} /></div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => generateCertificate(remark || undefined)}>🎓 Generate Certificate</Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center">Complete and pass all 14 chapter tests to unlock your certificate.</p>
          )}
        </CardContent>
        <CardFooter className="justify-center"><Button variant="outline" size="sm" onClick={() => setCurrentView('student-dashboard' as AppView)}>Back to Dashboard</Button></CardFooter>
      </Card>
    </div>
  );
}

/* ============ CERTIFICATE VERIFY ============ */
export function CertificateVerifyPage() {
  const { verifyCertificate, setCurrentView } = useAppStore();
  const [certId, setCertId] = useState(''); const [result, setResult] = useState<any>(null); const [error, setError] = useState('');
  const handleVerify = () => { const r = verifyCertificate(certId.trim()); if (r) { setResult(r); setError(''); } else { setResult(null); setError('Certificate not found'); } };
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <button onClick={() => setCurrentView('landing' as AppView)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"><ArrowLeft className="h-4 w-4" /> Back</button>
      <Card>
        <CardHeader className="text-center"><Search className="h-8 w-8 text-emerald-600 mx-auto mb-2" /><CardTitle>Verify Certificate</CardTitle><CardDescription>Enter a certificate ID to verify its authenticity</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="CERT-XXXX or SPE-XXXX" value={certId} onChange={e => setCertId(e.target.value)} />
            <Button onClick={handleVerify} className="bg-emerald-600 hover:bg-emerald-700">Verify</Button>
          </div>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {result && (
            <div className="border rounded-lg p-4 space-y-2">
              <p className="font-medium text-emerald-600">✅ Valid Certificate</p>
              <p className="text-sm"><strong>Name:</strong> {result.studentName}</p>
              <p className="text-sm"><strong>School:</strong> {result.schoolName}</p>
              <p className="text-sm"><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
              <p className="text-sm"><strong>ID:</strong> {result.certificateId}</p>
              {'percentage' in result && <p className="text-sm"><strong>Score:</strong> {result.percentage}%</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ============ SPECIAL TEST INTRO ============ */
export function SpecialTestIntroPage() {
  const { setCurrentView, startSpecialTest, getStudentSpecialAttempts } = useAppStore();
  const attempts = getStudentSpecialAttempts();
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => setCurrentView('student-dashboard' as AppView)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back</button>
      <div className="text-center">
        <Flame className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">🔥 Special Challenge Test</h1>
        <p className="text-muted-foreground mt-2">50 questions from all 14 chapters — test your complete preparation!</p>
      </div>
      <Card>
        <CardContent className="pt-4 pb-4 space-y-2 text-sm text-muted-foreground">
          <p>• 50 MCQs covering all chapters</p>
          <p>• 60-minute time limit</p>
          <p>• Questions shuffled from all topics</p>
          <p>• Score 75% or above to earn the Special Certificate</p>
        </CardContent>
      </Card>
      {attempts.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Previous Attempts</CardTitle></CardHeader>
          <CardContent>
            {attempts.map((a, i) => (
              <div key={a.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
                <span>Attempt {i + 1}</span>
                <span className={a.passed ? 'text-emerald-600' : 'text-red-500'}>{a.percentage}% {a.passed ? '✅' : '❌'}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => startSpecialTest()}>
        <Zap className="h-5 w-5" /> Start Special Test
      </Button>
    </div>
  );
}

/* ============ SPECIAL TEST PAGE ============ */
export function SpecialTestPage() {
  const { currentSpecialTest, answerSpecialQuestion, goToSpecialQuestion, nextSpecialQuestion, prevSpecialQuestion, submitSpecialTest, setCurrentView, getSpecialTimerSeconds } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(99999);

  useEffect(() => {
    if (!currentSpecialTest) return;
    const iv = setInterval(() => { setTimeLeft(getSpecialTimerSeconds()); if (getSpecialTimerSeconds() <= 0) submitSpecialTest(); }, 1000);
    return () => clearInterval(iv);
  }, [currentSpecialTest]);

  if (!currentSpecialTest) return <div className="p-8 text-center">No active test</div>;
  const q = currentSpecialTest.questions[currentSpecialTest.currentIndex];
  const selectedOpt = currentSpecialTest.answers[q.id];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentView('special-test-intro' as AppView)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Exit</button>
        <div className={cn('flex items-center gap-1 text-sm font-mono', timeLeft < 60 ? 'text-red-500' : 'text-muted-foreground')}>
          <Clock className="h-4 w-4" /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <span className="text-sm text-muted-foreground">{currentSpecialTest.currentIndex + 1} / {currentSpecialTest.questions.length}</span>
      </div>
      <Progress value={((currentSpecialTest.currentIndex + 1) / currentSpecialTest.questions.length) * 100} className="h-1.5" />
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
            <Badge variant="secondary" className="text-xs">{q.topic}</Badge>
          </div>
          <p className="text-lg font-medium mb-6">{q.questionText}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => answerSpecialQuestion(q.id, i)}
                className={cn('w-full text-left p-3 rounded-lg border-2 transition-colors text-sm',
                  selectedOpt === i ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-muted hover:border-orange-300 dark:hover:border-orange-700'
                )}>
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {currentSpecialTest.questions.map((tq, i) => {
              const answered = currentSpecialTest.answers[tq.id] !== undefined && currentSpecialTest.answers[tq.id] !== null;
              const isCurrent = i === currentSpecialTest.currentIndex;
              return (
                <button key={tq.id} onClick={() => goToSpecialQuestion(i)}
                  className={cn('w-7 h-7 rounded text-[10px] font-medium',
                    isCurrent ? 'bg-orange-500 text-white' : answered ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700' : 'bg-muted text-muted-foreground'
                  )}>{i + 1}</button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevSpecialQuestion} disabled={currentSpecialTest.currentIndex === 0}><ChevronLeft /> Prev</Button>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => submitSpecialTest()}>Submit</Button>
        <Button variant="outline" onClick={nextSpecialQuestion} disabled={currentSpecialTest.currentIndex === currentSpecialTest.questions.length - 1}>Next <ChevronRight /></Button>
      </div>
    </div>
  );
}

/* ============ SPECIAL TEST RESULT ============ */
export function SpecialTestResultPage() {
  const { specialAttempts, currentUser, setCurrentView, canGenerateSpecialCertificate, chapters } = useAppStore();
  const myAttempts = specialAttempts.filter(a => a.studentId === currentUser?.id);
  const latest = myAttempts[myAttempts.length - 1];
  if (!latest) return <div className="p-8 text-center">No result found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <div className={cn('inline-flex items-center justify-center w-20 h-20 rounded-full mb-4', latest.passed ? 'bg-orange-100 dark:bg-orange-900/40' : 'bg-red-100 dark:bg-red-900/40')}>
          {latest.passed ? <Trophy className="h-10 w-10 text-orange-500" /> : <AlertCircle className="h-10 w-10 text-red-500" />}
        </div>
        <h1 className="text-2xl font-bold">{latest.passed ? '🔥 Challenge Conquered!' : 'Almost There!'}</h1>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 text-center"><p className="text-3xl font-bold">{latest.percentage}%</p><p className="text-xs text-muted-foreground">Score</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-3xl font-bold">{latest.correctCount}/{latest.totalQuestions}</p><p className="text-xs text-muted-foreground">Correct</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{Math.floor(latest.timeTaken / 60)}m</p><p className="text-xs text-muted-foreground">Time</p></CardContent></Card>
      </div>
      {latest.chapterBreakdown && (
        <Card>
          <CardHeader><CardTitle className="text-base">Chapter Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {latest.chapterBreakdown.map(cb => (
              <div key={cb.chapterId} className="flex items-center justify-between text-sm">
                <span className="flex-1 truncate mr-2">{cb.chapterName}</span>
                <div className="flex items-center gap-2"><span>{cb.correct}/{cb.total}</span>
                  <div className="w-20 h-1.5 bg-muted rounded-full"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${cb.total > 0 ? (cb.correct / cb.total) * 100 : 0}%` }} /></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <div className="flex gap-3">
        {canGenerateSpecialCertificate() && <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={() => setCurrentView('special-certificate' as AppView)}>🏆 Get Certificate</Button>}
        <Button variant="outline" className="flex-1" onClick={() => setCurrentView('student-dashboard' as AppView)}>Dashboard</Button>
      </div>
    </div>
  );
}

/* ============ SPECIAL CERTIFICATE ============ */
export function SpecialCertificatePage() {
  const { canGenerateSpecialCertificate, generateSpecialCertificate, specialCertificates, currentUser, setCurrentView } = useAppStore();
  const [remark, setRemark] = useState('');
  const cert = specialCertificates.find(c => c.studentId === currentUser?.id);

  if (cert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="border-4 border-double border-orange-500 p-8 bg-white dark:bg-gray-900 rounded-lg">
          <div className="text-center space-y-4">
            <Flame className="h-12 w-12 text-orange-500 mx-auto" />
            <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">Special Challenge Certificate</h1>
            <p className="text-muted-foreground">This is to certify that</p>
            <p className="text-3xl font-bold">{cert.studentName}</p>
            <p className="text-muted-foreground">from <strong>{cert.schoolName}</strong></p>
            <p className="text-muted-foreground">has successfully passed the Special Challenge Test scoring</p>
            <p className="text-2xl font-bold text-orange-600">{cert.percentage}% ({cert.score}/{cert.totalQuestions})</p>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <p>Date: {new Date(cert.date).toLocaleDateString()}</p>
              <p className="text-right">ID: {cert.certificateId}</p>
            </div>
            {cert.teacherRemark && <p className="text-sm italic">&quot;{cert.teacherRemark}&quot;</p>}
          </div>
        </div>
        <div className="mt-4 text-center"><Button variant="outline" onClick={() => setCurrentView('student-dashboard' as AppView)}>Back to Dashboard</Button></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <Card>
        <CardHeader className="text-center"><Trophy className="h-10 w-10 text-orange-500 mx-auto mb-2" /><CardTitle>Generate Special Certificate</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {canGenerateSpecialCertificate() ? (
            <>
              <p className="text-sm text-muted-foreground text-center">You passed the Special Challenge! Add a remark to generate your certificate.</p>
              <div><Label>Remark (optional)</Label><Textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} /></div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => generateSpecialCertificate(remark || undefined)}>🏆 Generate Certificate</Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center">Score 75% or above on the Special Challenge Test to earn this certificate.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ============ HELP INFO PAGE ============ */
export function HelpInfoPage() {
  const { setCurrentView } = useAppStore();
  const [tab, setTab] = useState('overview');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><HelpCircle className="h-6 w-6 text-emerald-600" /> Help & Info</h1>
        <Button variant="outline" size="sm" onClick={() => setCurrentView('landing' as AppView)}>← Home</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>What is Nathan&apos;s Physics MCQ?</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">Nathan&apos;s Physics MCQ is a comprehensive practice platform designed for Class 12 students preparing for board exams and competitive tests. It covers all 14 chapters of NCERT Class 12 Physics with chapter-wise MCQ tests, detailed answer reviews with explanations, performance analytics, and a dual certificate system to reward achievement.</p>
              <p className="text-muted-foreground leading-relaxed">Teachers can use the admin panel to manage questions, track individual and school-wide student progress, generate reports, and configure test settings. The app works entirely in the browser with data stored locally, making it fast and accessible on any device.</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURE_CARDS.map((f, i) => (
              <Card key={i}><CardHeader className="pb-2"><div className="text-emerald-600">{f.icon}</div><CardTitle className="text-sm">{f.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">{f.desc}</p></CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="student" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>How to Use (Students)</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {[
                  { step: 1, title: 'Register', desc: 'Click "Register as Student" on the home page. Fill in your name, email, school name, and create a password. Your roll number is optional.' },
                  { step: 2, title: 'Explore Your Dashboard', desc: 'After login, you\'ll see all 14 chapters with their status. Chapters you haven\'t started show as "Not Started". Once you attempt a test, they show your best score and progress.' },
                  { step: 3, title: 'Take Chapter Tests', desc: 'Click any chapter to see its topics and your previous attempts. Click "Start Test" to begin. Answer the MCQs by selecting an option. Use the question navigation grid to jump between questions. Click "Submit Test" when done.' },
                  { step: 4, title: 'Review Your Answers', desc: 'After submitting, you\'ll see your score and a detailed review. Each question shows whether you got it right, the correct answer highlighted in green, wrong answers in red, and a full explanation.' },
                  { step: 5, title: 'Earn Certificates', desc: 'Pass all 14 chapter tests (meeting the pass percentage set by your teacher) to unlock the Completion Certificate. Then try the Special Challenge — a 50-question mixed test. Score 75%+ to earn the Special Certificate!' },
                ].map((s) => (
                  <li key={s.step} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 flex items-center justify-center font-bold">{s.step}</span>
                    <div><p className="font-medium">{s.title}</p><p className="text-sm text-muted-foreground mt-1">{s.desc}</p></div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tips</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use the Progress Report page to track your overall completion</li>
                <li>• Pay attention to weak topics shown after each test</li>
                <li>• The timer (if enabled) adds urgency — practice without it first if needed</li>
                <li>• You can reattempt chapters if the teacher allows retests</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Admin Guide</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Login with your admin credentials. The admin panel provides full control over the app.</p>
              <div className="space-y-3 text-sm">
                <div><p className="font-medium">📋 Chapters</p><p className="text-muted-foreground">Add, edit, or deactivate chapters. Each chapter has a name, description, topics list, and order number.</p></div>
                <div><p className="font-medium">❓ Questions</p><p className="text-muted-foreground">Manage the question bank. Add questions with multiple options, correct answer, explanation, difficulty level, and topic. Use bulk add for importing multiple questions via JSON.</p></div>
                <div><p className="font-medium">👥 Students</p><p className="text-muted-foreground">View all registered students, their progress, and scores. Click on a student for detailed chapter-wise performance. Reopen tests if needed.</p></div>
                <div><p className="font-medium">📊 Analytics</p><p className="text-muted-foreground">View overall statistics — pass rates per chapter, most difficult chapters, and recent activity. Generate school-wise reports.</p></div>
                <div><p className="font-medium">⚙️ Settings</p><p className="text-muted-foreground">Configure pass percentage, questions per chapter, timer settings, school name, and certificate text.</p></div>
                <div><p className="font-medium">🏆 Certificates</p><p className="text-muted-foreground">View all generated certificates (both regular and special) with student details and verification IDs.</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Share This App</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Share Nathan&apos;s Physics MCQ with classmates, friends, and teachers. Use the buttons below to copy the text.</p>
              <div>
                <p className="text-sm font-medium mb-1">Full Details:</p>
                <div className="bg-muted p-3 rounded-lg text-xs whitespace-pre-line max-h-60 overflow-y-auto">{getShareableText()}</div>
                <div className="mt-2"><CopyButton text={getShareableText()} label="Copy Full Text" /></div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">One-Liner:</p>
                <div className="bg-muted p-3 rounded-lg text-sm">{getShareOneLiner()}</div>
                <div className="mt-2"><CopyButton text={getShareOneLiner()} label="Copy One-Liner" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
