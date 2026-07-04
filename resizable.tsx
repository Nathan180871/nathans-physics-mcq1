'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { DashboardHelpCard } from './StudentScreens';
import type { Chapter, Question, Difficulty } from '@/lib/types';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import {
  LayoutDashboard, BookOpen, FileQuestion, Users, Building2, BarChart3,
  Award, Settings as SettingsIcon, Plus, Pencil, Trash2, Eye, Search,
  ArrowLeft, Check, X, Shield, Download, TrendingUp, AlertCircle,
  Clock, ChevronLeft, Lock, Unlock, UserPlus, Filter,
} from 'lucide-react';

// ─── AdminLoginPage ────────────────────────────────────────────────

export function AdminLoginPage() {
  const { adminLogin, setCurrentView } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = adminLogin(email, password);
    if (!ok) setError('Invalid email or password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
            <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription>Sign in to the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@nathans.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('landing')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// ─── AdminDashboardPage ────────────────────────────────────────────

export function AdminDashboardPage() {
  const { students, attempts, chapters, settings, setCurrentView, getAnalytics } = useAppStore();
  const analytics = useMemo(() => getAnalytics(), [students, attempts, chapters, settings, getAnalytics]);

  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts)
    : 0;
  const passRate = totalAttempts > 0
    ? Math.round((attempts.filter(a => a.passed).length / totalAttempts) * 100)
    : 0;

  const quickActions = [
    { icon: <BookOpen className="h-5 w-5" />, label: 'Manage Chapters', view: 'admin-chapters' as const, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' },
    { icon: <FileQuestion className="h-5 w-5" />, label: 'Manage Questions', view: 'admin-questions' as const, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300' },
    { icon: <Users className="h-5 w-5" />, label: 'View Students', view: 'admin-students' as const, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', view: 'admin-analytics' as const, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900 dark:text-pink-300' },
    { icon: <SettingsIcon className="h-5 w-5" />, label: 'Settings', view: 'admin-settings' as const, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300' },
  ];

  const getStudentName = (studentId: string) => {
    const s = students.find(st => st.id === studentId);
    return s ? s.name : 'Unknown';
  };

  const getChapterName = (chapterId: string) => {
    const c = chapters.find(ch => ch.id === chapterId);
    return c ? c.name : 'Unknown';
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  // Simple bar chart for chapter pass rates
  const maxRate = Math.max(...analytics.chapterPassRates.map(c => c.passRate), 1);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your MCQ platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900 p-2.5">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{analytics.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2.5">
                <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold">{totalAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 dark:bg-amber-900 p-2.5">
                <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{avgScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-pink-100 dark:bg-pink-900 p-2.5">
                <Check className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">{passRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.view}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-accent"
                onClick={() => setCurrentView(action.view)}
              >
                <div className={cn('rounded-lg p-2', action.color)}>
                  {action.icon}
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DashboardHelpCard */}
      <DashboardHelpCard />

      {/* Recent Activity + Chapter Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Last 10 quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentAttempts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No attempts yet</p>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {analytics.recentAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {getStudentName(attempt.studentId)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {getChapterName(attempt.chapterId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(attempt.date)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={attempt.passed ? 'default' : 'destructive'} className={cn(
                          attempt.passed ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                        )}>
                          {attempt.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Chapter Pass Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chapter Pass Rates</CardTitle>
            <CardDescription>Pass rate across all chapters</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.chapterPassRates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {analytics.chapterPassRates.map((ch) => (
                    <div key={ch.chapterId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium truncate max-w-[70%]">{ch.chapterName}</span>
                        <span className="text-muted-foreground">{ch.passRate}%</span>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            ch.passRate >= 70 ? 'bg-emerald-500' :
                            ch.passRate >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          )}
                          style={{ width: `${(ch.passRate / maxRate) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── ChapterManagerPage ────────────────────────────────────────────

export function ChapterManagerPage() {
  const { chapters, addChapter, updateChapter, deleteChapter } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(null);

  // Add form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTopics, setNewTopics] = useState('');

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTopics, setEditTopics] = useState('');
  const [editActive, setEditActive] = useState(true);

  const sortedChapters = useMemo(
    () => [...chapters].sort((a, b) => a.order - b.order),
    [chapters]
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    addChapter({
      name: newName.trim(),
      description: newDesc.trim(),
      topics: newTopics.split(',').map(t => t.trim()).filter(Boolean),
      order: chapters.length + 1,
      active: true,
    });
    setNewName('');
    setNewDesc('');
    setNewTopics('');
    setAddOpen(false);
  };

  const openEdit = (ch: Chapter) => {
    setEditingChapter(ch);
    setEditName(ch.name);
    setEditDesc(ch.description);
    setEditTopics(ch.topics.join(', '));
    setEditActive(ch.active);
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editingChapter || !editName.trim()) return;
    updateChapter(editingChapter.id, {
      name: editName.trim(),
      description: editDesc.trim(),
      topics: editTopics.split(',').map(t => t.trim()).filter(Boolean),
      active: editActive,
    });
    setEditOpen(false);
    setEditingChapter(null);
  };

  const openDelete = (ch: Chapter) => {
    setDeletingChapter(ch);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!deletingChapter) return;
    deleteChapter(deletingChapter.id);
    setDeleteOpen(false);
    setDeletingChapter(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chapter Manager</h1>
          <p className="text-muted-foreground">{chapters.length} chapters configured</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" /> Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
              <DialogDescription>Create a new chapter for the quiz.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Chapter Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Electric Charges & Fields" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Brief description of the chapter" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Topics (comma separated)</Label>
                <Input value={newTopics} onChange={(e) => setNewTopics(e.target.value)} placeholder="Topic 1, Topic 2, Topic 3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAdd}>Add Chapter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sortedChapters.map((ch, idx) => (
          <Card key={ch.id} className={cn(!ch.active && 'opacity-60')}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">{ch.name}</h3>
                      <Badge variant={ch.active ? 'default' : 'secondary'} className={cn(
                        ch.active ? 'bg-emerald-600 hover:bg-emerald-700 text-xs' : 'text-xs'
                      )}>
                        {ch.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ch.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ch.topics.map((topic, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(ch)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDelete(ch)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>Update chapter details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chapter Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Topics (comma separated)</Label>
              <Input value={editTopics} onChange={(e) => setEditTopics(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Active</Label>
              <Switch id="edit-active" checked={editActive} onCheckedChange={setEditActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chapter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingChapter?.name}&quot;? This will also remove all associated questions. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── QuestionManagerPage ───────────────────────────────────────────

export function QuestionManagerPage() {
  const { chapters, questions, addQuestion, updateQuestion, deleteQuestion, bulkAddQuestions, selectedChapterId, setSelectedChapterId } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Add form state
  const [qChapterId, setQChapterId] = useState('');
  const [qText, setQText] = useState('');
  const [qOption1, setQOption1] = useState('');
  const [qOption2, setQOption2] = useState('');
  const [qOption3, setQOption3] = useState('');
  const [qOption4, setQOption4] = useState('');
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState<Difficulty>('Medium');
  const [qTopic, setQTopic] = useState('');

  const activeChapters = useMemo(() => chapters.filter(c => c.active).sort((a, b) => a.order - b.order), [chapters]);

  const filteredQuestions = useMemo(() => {
    let qs = questions;
    if (selectedChapterId) {
      qs = qs.filter(q => q.chapterId === selectedChapterId);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      qs = qs.filter(q =>
        q.questionText.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query)
      );
    }
    return qs;
  }, [questions, selectedChapterId, searchQuery]);

  const resetAddForm = () => {
    setQChapterId(selectedChapterId || (activeChapters.length > 0 ? activeChapters[0].id : ''));
    setQText('');
    setQOption1('');
    setQOption2('');
    setQOption3('');
    setQOption4('');
    setQCorrect(0);
    setQExplanation('');
    setQDifficulty('Medium');
    setQTopic('');
  };

  const handleAdd = () => {
    if (!qText.trim() || !qOption1.trim() || !qOption2.trim() || !qOption3.trim() || !qOption4.trim() || !qChapterId) return;
    addQuestion({
      chapterId: qChapterId,
      questionText: qText.trim(),
      options: [qOption1.trim(), qOption2.trim(), qOption3.trim(), qOption4.trim()],
      correctOption: qCorrect,
      explanation: qExplanation.trim(),
      difficulty: qDifficulty,
      topic: qTopic.trim(),
      active: true,
    });
    setAddOpen(false);
    resetAddForm();
  };

  const openEdit = (q: Question) => {
    setEditingQuestion(q);
    setQChapterId(q.chapterId);
    setQText(q.questionText);
    setQOption1(q.options[0]);
    setQOption2(q.options[1]);
    setQOption3(q.options[2]);
    setQOption4(q.options[3]);
    setQCorrect(q.correctOption);
    setQExplanation(q.explanation);
    setQDifficulty(q.difficulty);
    setQTopic(q.topic);
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editingQuestion || !qText.trim()) return;
    updateQuestion(editingQuestion.id, {
      chapterId: qChapterId,
      questionText: qText.trim(),
      options: [qOption1.trim(), qOption2.trim(), qOption3.trim(), qOption4.trim()],
      correctOption: qCorrect,
      explanation: qExplanation.trim(),
      difficulty: qDifficulty,
      topic: qTopic.trim(),
    });
    setEditOpen(false);
    setEditingQuestion(null);
  };

  const openDelete = (q: Question) => {
    setDeletingQuestion(q);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!deletingQuestion) return;
    deleteQuestion(deletingQuestion.id);
    setDeleteOpen(false);
    setDeletingQuestion(null);
  };

  const handleBulkAdd = () => {
    setBulkError('');
    setBulkSuccess('');
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array');
      const qs = parsed.map((item: Record<string, unknown>, idx: number) => {
        if (!item.chapterId || !item.questionText || !Array.isArray(item.options) || typeof item.correctOption !== 'number') {
          throw new Error(`Item ${idx + 1} is missing required fields (chapterId, questionText, options, correctOption)`);
        }
        return {
          chapterId: item.chapterId as string,
          questionText: item.questionText as string,
          options: item.options as string[],
          correctOption: item.correctOption as number,
          explanation: (item.explanation as string) || '',
          difficulty: (item.difficulty as Difficulty) || 'Medium',
          topic: (item.topic as string) || '',
          active: true,
        };
      });
      bulkAddQuestions(qs);
      setBulkSuccess(`Successfully added ${qs.length} questions.`);
      setBulkJson('');
      setBulkOpen(false);
    } catch (e) {
      setBulkError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  const getChapterName = (chapterId: string) => {
    const ch = chapters.find(c => c.id === chapterId);
    return ch ? ch.name : 'Unknown';
  };

  const difficultyColor = (d: Difficulty) => {
    if (d === 'Easy') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
    if (d === 'Medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Question Manager</h1>
          <p className="text-muted-foreground">{filteredQuestions.length} questions {selectedChapterId ? 'in selected chapter' : 'total'}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" /> Bulk Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Bulk Add Questions</DialogTitle>
                <DialogDescription>Paste a JSON array of question objects.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Each object needs: chapterId, questionText, options (array of 4 strings), correctOption (0-3). Optional: explanation, difficulty, topic.
                </p>
                <Textarea
                  value={bulkJson}
                  onChange={(e) => setBulkJson(e.target.value)}
                  placeholder='[{"chapterId":"ch1","questionText":"...","options":["A","B","C","D"],"correctOption":0}]'
                  rows={10}
                  className="font-mono text-xs"
                />
                {bulkError && <Alert variant="destructive"><AlertDescription>{bulkError}</AlertDescription></Alert>}
                {bulkSuccess && <Alert><AlertDescription className="text-emerald-600">{bulkSuccess}</AlertDescription></Alert>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleBulkAdd}>Add Questions</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (open) resetAddForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-1" /> Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogDescription>Create a new MCQ question.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Chapter</Label>
                  <Select value={qChapterId} onValueChange={setQChapterId}>
                    <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                    <SelectContent>
                      {activeChapters.map(ch => (
                        <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea value={qText} onChange={(e) => setQText(e.target.value)} rows={3} placeholder="Enter the question..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Option A</Label>
                    <Input value={qOption1} onChange={(e) => setQOption1(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Option B</Label>
                    <Input value={qOption2} onChange={(e) => setQOption2(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Option C</Label>
                    <Input value={qOption3} onChange={(e) => setQOption3(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Option D</Label>
                    <Input value={qOption4} onChange={(e) => setQOption4(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Correct Option</Label>
                    <Select value={String(qCorrect)} onValueChange={(v) => setQCorrect(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Option A</SelectItem>
                        <SelectItem value="1">Option B</SelectItem>
                        <SelectItem value="2">Option C</SelectItem>
                        <SelectItem value="3">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={qDifficulty} onValueChange={(v) => setQDifficulty(v as Difficulty)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input value={qTopic} onChange={(e) => setQTopic(e.target.value)} placeholder="e.g. Coulomb's Law" />
                </div>
                <div className="space-y-2">
                  <Label>Explanation</Label>
                  <Textarea value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} rows={2} placeholder="Why is this the correct answer?" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAdd}>Add Question</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedChapterId || 'all'} onValueChange={(v) => setSelectedChapterId(v === 'all' ? null : v)}>
          <SelectTrigger className="w-full sm:w-64">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Chapters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            {activeChapters.map(ch => (
              <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Questions Table */}
      <Card>
        <CardContent className="p-0">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileQuestion className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No questions found</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="hidden md:table-cell">Chapter</TableHead>
                    <TableHead className="hidden sm:table-cell">Difficulty</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((q, idx) => (
                    <TableRow key={q.id}>
                      <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium line-clamp-2 max-w-xs">{q.questionText}</p>
                        {q.topic && <p className="text-xs text-muted-foreground mt-0.5">{q.topic}</p>}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {getChapterName(q.chapterId)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className={cn('text-xs', difficultyColor(q.difficulty))}>
                          {q.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openEdit(q)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => openDelete(q)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Update the question details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chapter</Label>
              <Select value={qChapterId} onValueChange={setQChapterId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {activeChapters.map(ch => (
                    <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea value={qText} onChange={(e) => setQText(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Option A</Label>
                <Input value={qOption1} onChange={(e) => setQOption1(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Option B</Label>
                <Input value={qOption2} onChange={(e) => setQOption2(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Option C</Label>
                <Input value={qOption3} onChange={(e) => setQOption3(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Option D</Label>
                <Input value={qOption4} onChange={(e) => setQOption4(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Correct Option</Label>
                <Select value={String(qCorrect)} onValueChange={(v) => setQCorrect(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Option A</SelectItem>
                    <SelectItem value="1">Option B</SelectItem>
                    <SelectItem value="2">Option C</SelectItem>
                    <SelectItem value="3">Option D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={qDifficulty} onValueChange={(v) => setQDifficulty(v as Difficulty)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input value={qTopic} onChange={(e) => setQTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Explanation</Label>
              <Textarea value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingQuestion && (
            <div className="p-3 rounded-lg border bg-muted/50">
              <p className="text-sm font-medium line-clamp-2">{deletingQuestion.questionText}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── StudentManagerPage ────────────────────────────────────────────

export function StudentManagerPage() {
  const { students, chapters, attempts, navigateTo, setCurrentView, reopenTest } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [reopenStudentId, setReopenStudentId] = useState('');
  const [reopenChapterId, setReopenChapterId] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      s => s.name.toLowerCase().includes(q) || s.school.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const activeChapters = useMemo(() => chapters.filter(c => c.active).sort((a, b) => a.order - b.order), [chapters]);

  const getStudentAttemptsForChapter = (studentId: string, chapterId: string) => {
    return attempts.filter(a => a.studentId === studentId && a.chapterId === chapterId);
  };

  const hasAttemptForChapter = (studentId: string, chapterId: string) => {
    return attempts.some(a => a.studentId === studentId && a.chapterId === chapterId);
  };

  const openReopenDialog = (studentId: string, chapterId: string) => {
    setReopenStudentId(studentId);
    setReopenChapterId(chapterId);
    setReopenDialogOpen(true);
  };

  const handleReopen = () => {
    reopenTest(reopenStudentId, reopenChapterId);
    setReopenDialogOpen(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Manager</h1>
        <p className="text-muted-foreground">{students.length} registered students</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, school, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No students found</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">School</TableHead>
                    <TableHead className="hidden lg:table-cell">Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          {student.rollNumber && (
                            <p className="text-xs text-muted-foreground">Roll: {student.rollNumber}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{student.school}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {formatDate(student.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => navigateTo('admin-student-detail', { studentId: student.id })}
                          >
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              const ch = activeChapters[0];
                              if (ch) openReopenDialog(student.id, ch.id);
                            }}
                            title="Reopen test"
                          >
                            <Unlock className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Reopen Test Dialog */}
      <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reopen Test</DialogTitle>
            <DialogDescription>Select a chapter to reopen the test for this student. This will delete their last attempt for the selected chapter.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">This will remove the student&apos;s latest attempt so they can retake the test.</p>
            <div className="space-y-2">
              <Label>Chapter</Label>
              <Select value={reopenChapterId} onValueChange={setReopenChapterId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {activeChapters.map(ch => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.name}
                      {hasAttemptForChapter(reopenStudentId, ch.id) ? ' (has attempt)' : ' (no attempt)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReopenDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReopen}>Reopen Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── StudentDetailPage ─────────────────────────────────────────────

export function StudentDetailPage() {
  const { viewData, setCurrentView, chapters, reopenTest } = useAppStore();
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [reopenChapterId, setReopenChapterId] = useState('');

  const studentId = viewData?.studentId || null;
  const { getStudentDetail } = useAppStore();
  const detail = useMemo(() => studentId ? getStudentDetail(studentId) : null, [studentId, getStudentDetail, chapters]);

  if (!detail || !detail.student) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Button variant="ghost" onClick={() => setCurrentView('admin-students')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Students
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>Student not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { student, chapterProgress, specialAttempts, hasCertificate, hasSpecialCertificate, totalAttemptsCount, avgScore } = detail;

  const activeChapters = chapters.filter(c => c.active).sort((a, b) => a.order - b.order);

  const statusColor = (status: string) => {
    if (status === 'passed') return 'text-emerald-600';
    if (status === 'in_progress') return 'text-amber-600';
    if (status === 'failed') return 'text-red-600';
    return 'text-muted-foreground';
  };

  const statusIcon = (status: string) => {
    if (status === 'passed') return <Check className="h-3.5 w-3.5" />;
    if (status === 'in_progress') return <Clock className="h-3.5 w-3.5" />;
    if (status === 'failed') return <X className="h-3.5 w-3.5" />;
    return <span className="h-2 w-2 rounded-full bg-muted-foreground inline-block" />;
  };

  const handleReopen = () => {
    reopenTest(student.id, reopenChapterId);
    setReopenDialogOpen(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" onClick={() => setCurrentView('admin-students')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Students
      </Button>

      {/* Student Info */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{student.name}</h2>
                <p className="text-sm text-muted-foreground">{student.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{student.school}</Badge>
                  {student.rollNumber && <Badge variant="outline">Roll: {student.rollNumber}</Badge>}
                  <Badge variant="outline">Class {student.class}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {hasCertificate && <Badge className="bg-emerald-600 hover:bg-emerald-700"><Award className="h-3 w-3 mr-1" />Certificate</Badge>}
              {hasSpecialCertificate && <Badge className="bg-amber-600 hover:bg-amber-700"><Award className="h-3 w-3 mr-1" />Special Cert</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalAttemptsCount}</p>
            <p className="text-xs text-muted-foreground">Total Attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{avgScore}%</p>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{chapterProgress.filter(p => p.status === 'passed').length}/{chapterProgress.length}</p>
            <p className="text-xs text-muted-foreground">Chapters Passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{specialAttempts.length}</p>
            <p className="text-xs text-muted-foreground">Special Tests</p>
          </CardContent>
        </Card>
      </div>

      {/* Chapter-wise Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Chapter Progress</CardTitle>
              <CardDescription>Performance across all chapters</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setReopenDialogOpen(true)}>
              <Unlock className="h-3.5 w-3.5 mr-1" /> Reopen Test
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chapterProgress.map((progress) => {
              const ch = activeChapters.find(c => c.id === progress.chapterId);
              return (
                <div key={progress.chapterId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn('shrink-0', statusColor(progress.status))}>
                        {statusIcon(progress.status)}
                      </span>
                      <span className="text-sm font-medium truncate">{ch?.name || 'Unknown Chapter'}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {progress.attempts > 0 ? `${progress.attempts} attempt${progress.attempts > 1 ? 's' : ''}` : 'No attempt'}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          progress.status === 'passed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                          progress.status === 'in_progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                          'bg-muted'
                        )}
                      >
                        {progress.status === 'passed' ? `${progress.latestPercentage}%` :
                         progress.status === 'in_progress' ? `${progress.latestPercentage}%` :
                         'Not Started'}
                      </Badge>
                    </div>
                  </div>
                  {progress.attempts > 0 && (
                    <div className="flex items-center gap-3">
                      <Progress
                        value={progress.latestPercentage}
                        className="h-2"
                      />
                      <span className="text-xs text-muted-foreground w-10 text-right">Best: {progress.highestScore}%</span>
                    </div>
                  )}
                  {progress.weakTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {progress.weakTopics.slice(0, 3).map((t, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] text-red-500 border-red-200 dark:border-red-800">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Separator />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Special Test Attempts */}
      {specialAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Special Test Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {specialAttempts.map((sa) => (
                <div key={sa.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">Score: {sa.percentage}%</p>
                    <p className="text-xs text-muted-foreground">
                      {sa.correctCount}/{sa.totalQuestions} correct &middot; {formatDate(sa.date)}
                    </p>
                  </div>
                  <Badge variant={sa.passed ? 'default' : 'destructive'} className={cn(sa.passed ? 'bg-emerald-600 hover:bg-emerald-700' : '')}>
                    {sa.passed ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reopen Test Dialog */}
      <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reopen Test for {student.name}</DialogTitle>
            <DialogDescription>Select a chapter. The student&apos;s latest attempt will be deleted.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Chapter</Label>
            <Select value={reopenChapterId} onValueChange={setReopenChapterId}>
              <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
              <SelectContent>
                {activeChapters.map(ch => (
                  <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReopenDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReopen} disabled={!reopenChapterId}>Reopen Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── SchoolReportPage ──────────────────────────────────────────────

export function SchoolReportPage() {
  const { getSchools, getSchoolAnalytics, chapters, setCurrentView } = useAppStore();
  const [selectedSchool, setSelectedSchool] = useState('');

  const schools = useMemo(() => getSchools(), [getSchools]);

  const schoolAnalytics = useMemo(() => {
    if (!selectedSchool) return null;
    return getSchoolAnalytics(selectedSchool);
  }, [selectedSchool, getSchoolAnalytics, chapters]);

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
  };

  const maxAvgScore = useMemo(() => {
    if (!schoolAnalytics) return 1;
    return Math.max(...schoolAnalytics.avgScorePerChapter.map(c => c.avgScore), 1);
  }, [schoolAnalytics]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">School Report</h1>
        <p className="text-muted-foreground">School-wise analytics and performance</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedSchool} onValueChange={handleSchoolChange}>
          <SelectTrigger className="w-full sm:w-80">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select a school" />
          </SelectTrigger>
          <SelectContent>
            {schools.map(school => (
              <SelectItem key={school} value={school}>{school}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {schools.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No schools registered yet</p>
          </CardContent>
        </Card>
      )}

      {!schoolAnalytics && schools.length > 0 && !selectedSchool && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map(school => {
            const analytics = getSchoolAnalytics(school);
            return (
              <Card
                key={school}
                className="cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                onClick={() => setSelectedSchool(school)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900 p-2">
                      <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{school}</h3>
                      <p className="text-xs text-muted-foreground">{analytics.totalStudents} students</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold">{analytics.totalStudents}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-emerald-600">{analytics.completedStudents}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {schoolAnalytics && (
        <>
          {/* School Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{schoolAnalytics.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{schoolAnalytics.completedStudents}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{schoolAnalytics.specialTestStats.attempts}</p>
                <p className="text-xs text-muted-foreground">Special Tests</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{schoolAnalytics.specialTestStats.passed}</p>
                <p className="text-xs text-muted-foreground">Special Passed</p>
              </CardContent>
            </Card>
          </div>

          {/* Chapter-wise Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chapter-wise Performance</CardTitle>
              <CardDescription>{schoolAnalytics.schoolName}</CardDescription>
            </CardHeader>
            <CardContent>
              {schoolAnalytics.avgScorePerChapter.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No chapter data available</p>
              ) : (
                <ScrollArea className="max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Chapter</TableHead>
                        <TableHead className="text-center">Attempts</TableHead>
                        <TableHead className="text-center">Avg Score</TableHead>
                        <TableHead className="text-center">Pass Rate</TableHead>
                        <TableHead className="w-32">Visualization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schoolAnalytics.avgScorePerChapter.map((ch) => (
                        <TableRow key={ch.chapterId}>
                          <TableCell className="text-sm font-medium">{ch.chapterName}</TableCell>
                          <TableCell className="text-center text-sm">{ch.attempts}</TableCell>
                          <TableCell className="text-center text-sm">{ch.avgScore}%</TableCell>
                          <TableCell className="text-center text-sm">{ch.passRate}%</TableCell>
                          <TableCell>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  ch.avgScore >= 70 ? 'bg-emerald-500' :
                                  ch.avgScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                )}
                                style={{ width: `${(ch.avgScore / maxAvgScore) * 100}%` }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Special Test Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Special Test Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{schoolAnalytics.specialTestStats.attempts}</p>
                  <p className="text-xs text-muted-foreground">Total Attempts</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">{schoolAnalytics.specialTestStats.passed}</p>
                  <p className="text-xs text-muted-foreground">Passed</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{schoolAnalytics.specialTestStats.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={() => setSelectedSchool('')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to All Schools
          </Button>
        </>
      )}
    </div>
  );
}

// ─── AnalyticsPage ─────────────────────────────────────────────────

export function AnalyticsPage() {
  const { getAnalytics, chapters, students, attempts } = useAppStore();
  const analytics = useMemo(() => getAnalytics(), [getAnalytics, chapters, students, attempts]);

  const maxPassRate = Math.max(...analytics.chapterPassRates.map(c => c.passRate), 1);

  const getStudentName = (studentId: string) => {
    const s = students.find(st => st.id === studentId);
    return s ? s.name : 'Unknown';
  };

  const getChapterName = (chapterId: string) => {
    const c = chapters.find(ch => ch.id === chapterId);
    return c ? c.name : 'Unknown';
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Overall platform performance metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900 p-2.5">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{analytics.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2.5">
                <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed All</p>
                <p className="text-2xl font-bold">{analytics.completedStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-2.5">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Schools</p>
                <p className="text-2xl font-bold">{analytics.totalSchools}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapter Pass Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chapter-wise Pass Rates</CardTitle>
          <CardDescription>Pass rate percentage for each chapter</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.chapterPassRates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.chapterPassRates.map((ch) => (
                <div key={ch.chapterId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-[60%]">{ch.chapterName}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{ch.totalAttempts} attempts</span>
                      <span className={cn(
                        'font-semibold',
                        ch.passRate >= 70 ? 'text-emerald-600' :
                        ch.passRate >= 40 ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {ch.passRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all flex items-center justify-end pr-2',
                        ch.passRate >= 70 ? 'bg-emerald-500' :
                        ch.passRate >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${Math.max((ch.passRate / maxPassRate) * 100, 8)}%` }}
                    >
                      {ch.passRate > 15 && (
                        <span className="text-[10px] font-bold text-white">{ch.passRate}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Most Difficult Chapters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Most Difficult Chapters
            </CardTitle>
            <CardDescription>Chapters with lowest average scores</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.mostDifficultChapters.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.mostDifficultChapters.map((ch, idx) => (
                  <div key={ch.chapterId} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                        idx === 0 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        idx === 1 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      )}>
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium">{ch.chapterName}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">{ch.avgScore}%</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Attempts</CardTitle>
            <CardDescription>Latest quiz submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentAttempts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No attempts yet</p>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-2">
                  {analytics.recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-2.5 rounded-lg border">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{getStudentName(attempt.studentId)}</p>
                        <p className="text-xs text-muted-foreground truncate">{getChapterName(attempt.chapterId)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(attempt.date)}</p>
                      </div>
                      <Badge
                        variant={attempt.passed ? 'default' : 'destructive'}
                        className={cn('shrink-0 ml-2', attempt.passed ? 'bg-emerald-600 hover:bg-emerald-700' : '')}
                      >
                        {attempt.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── SettingsPage ──────────────────────────────────────────────────

export function SettingsPage() {
  const { settings, updateSettings, setCurrentView } = useAppStore();

  const [passPercentage, setPassPercentage] = useState(settings.passPercentage);
  const [questionsPerChapter, setQuestionsPerChapter] = useState(settings.questionsPerChapter);
  const [timerEnabled, setTimerEnabled] = useState(settings.timerEnabled);
  const [timerMinutes, setTimerMinutes] = useState(settings.timerMinutes);
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [certificateTitle, setCertificateTitle] = useState(settings.certificateTitle);
  const [certificateStatement, setCertificateStatement] = useState(settings.certificateStatement);
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(settings.leaderboardEnabled);
  const [allowRetest, setAllowRetest] = useState(settings.allowRetest);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      passPercentage,
      questionsPerChapter,
      timerEnabled,
      timerMinutes,
      schoolName,
      certificateTitle,
      certificateStatement,
      leaderboardEnabled,
      allowRetest,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your MCQ platform</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Test Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Configuration</CardTitle>
            <CardDescription>Configure test behavior and scoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="pass-percentage">Pass Percentage</Label>
              <Input
                id="pass-percentage"
                type="number"
                min={0}
                max={100}
                value={passPercentage}
                onChange={(e) => setPassPercentage(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Minimum score required to pass (0-100%)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="questions-per-chapter">Questions Per Chapter</Label>
              <Input
                id="questions-per-chapter"
                type="number"
                min={1}
                max={50}
                value={questionsPerChapter}
                onChange={(e) => setQuestionsPerChapter(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Number of questions in each chapter test</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="timer-enabled">Timer Enabled</Label>
                <p className="text-xs text-muted-foreground">Enable countdown timer for tests</p>
              </div>
              <Switch
                id="timer-enabled"
                checked={timerEnabled}
                onCheckedChange={setTimerEnabled}
              />
            </div>
            {timerEnabled && (
              <div className="space-y-2">
                <Label htmlFor="timer-minutes">Timer Duration (minutes)</Label>
                <Input
                  id="timer-minutes"
                  type="number"
                  min={1}
                  max={180}
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Number(e.target.value))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* School & Certificate Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">School & Certificate</CardTitle>
            <CardDescription>Configure school info and certificate details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="school-name">School Name</Label>
              <Input
                id="school-name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter school name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-title">Certificate Title</Label>
              <Input
                id="cert-title"
                value={certificateTitle}
                onChange={(e) => setCertificateTitle(e.target.value)}
                placeholder="e.g. Certificate of Achievement"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-statement">Certificate Statement</Label>
              <Textarea
                id="cert-statement"
                value={certificateStatement}
                onChange={(e) => setCertificateStatement(e.target.value)}
                rows={3}
                placeholder="This is to certify that..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
            <CardDescription>Enable or disable platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="leaderboard-enabled">Leaderboard</Label>
                <p className="text-xs text-muted-foreground">Show student leaderboard</p>
              </div>
              <Switch
                id="leaderboard-enabled"
                checked={leaderboardEnabled}
                onCheckedChange={setLeaderboardEnabled}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-retest">Allow Retest</Label>
                <p className="text-xs text-muted-foreground">Allow students to retake tests</p>
              </div>
              <Switch
                id="allow-retest"
                checked={allowRetest}
                onCheckedChange={setAllowRetest}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <SettingsIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Review your settings and save when ready
              </p>
              <Button
                className={cn(
                  'bg-emerald-600 hover:bg-emerald-700 px-8',
                  saved && 'bg-emerald-700'
                )}
                onClick={handleSave}
              >
                {saved ? (
                  <><Check className="h-4 w-4 mr-1" /> Saved!</>
                ) : (
                  <><SettingsIcon className="h-4 w-4 mr-1" /> Save Settings</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── CertificateManagerPage ────────────────────────────────────────

export function CertificateManagerPage() {
  const { certificates, specialCertificates, students } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'all' | 'regular' | 'special'>('all');

  const allCerts = useMemo(() => {
    const regular = certificates.map(c => ({
      id: c.id,
      certificateId: c.certificateId,
      studentName: c.studentName,
      schoolName: c.schoolName,
      date: c.date,
      type: 'Regular' as const,
      studentId: c.studentId,
      percentage: null as number | null,
    }));
    const special = specialCertificates.map(c => ({
      id: c.id,
      certificateId: c.certificateId,
      studentName: c.studentName,
      schoolName: c.schoolName,
      date: c.date,
      type: 'Special' as const,
      studentId: c.studentId,
      percentage: c.percentage,
    }));
    return [...regular, ...special].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [certificates, specialCertificates]);

  const filteredCerts = useMemo(() => {
    let certs = allCerts;
    if (tab === 'regular') certs = certs.filter(c => c.type === 'Regular');
    if (tab === 'special') certs = certs.filter(c => c.type === 'Special');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      certs = certs.filter(
        c => c.certificateId.toLowerCase().includes(q) || c.studentName.toLowerCase().includes(q)
      );
    }
    return certs;
  }, [allCerts, tab, searchQuery]);

  const regularCount = certificates.length;
  const specialCount = specialCertificates.length;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Certificate Manager</h1>
        <p className="text-muted-foreground">{allCerts.length} certificates generated</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{allCerts.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{regularCount}</p>
            <p className="text-xs text-muted-foreground">Regular</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{specialCount}</p>
            <p className="text-xs text-muted-foreground">Special</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'all' | 'regular' | 'special')}>
          <TabsList>
            <TabsTrigger value="all">All ({allCerts.length})</TabsTrigger>
            <TabsTrigger value="regular">Regular ({regularCount})</TabsTrigger>
            <TabsTrigger value="special">Special ({specialCount})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by certificate ID or student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardContent className="p-0">
          {filteredCerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No certificates found</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="hidden md:table-cell">School</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCerts.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {cert.certificateId}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{cert.studentName}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {cert.schoolName}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {formatDate(cert.date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs',
                            cert.type === 'Special'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                          )}
                        >
                          {cert.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}