'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, BookOpen, BarChart3, Award, Settings as SettingsIcon, Users, FileQuestion, LogOut, Menu, GraduationCap, Shield, LayoutDashboard, Search, Flame, Building2, HelpCircle } from 'lucide-react';
import { LandingPage, StudentLoginPage, StudentRegisterPage, StudentDashboard, ChapterIntroPage, TestPage, ResultPage, ReviewPage, ProgressReportPage, CertificatePage, CertificateVerifyPage, SpecialTestIntroPage, SpecialTestPage, SpecialTestResultPage, SpecialCertificatePage, DashboardHelpCard, HelpInfoPage } from './StudentScreens';
import { AdminLoginPage, AdminDashboardPage, ChapterManagerPage, QuestionManagerPage, StudentManagerPage, StudentDetailPage, SchoolReportPage, AnalyticsPage, SettingsPage, CertificateManagerPage } from './AdminScreens';
import type { AppView } from '@/lib/types';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function ViewRouter() {
  const currentView = useAppStore(s => s.currentView);
  const sv: Record<string, React.ReactNode> = { 'student-login': <StudentLoginPage />, 'student-register': <StudentRegisterPage />, 'student-dashboard': <StudentDashboard />, 'chapter-intro': <ChapterIntroPage />, 'test': <TestPage />, 'result': <ResultPage />, 'review': <ReviewPage />, 'progress-report': <ProgressReportPage />, 'certificate': <CertificatePage />, 'special-test-intro': <SpecialTestIntroPage />, 'special-test': <SpecialTestPage />, 'special-test-result': <SpecialTestResultPage />, 'special-certificate': <SpecialCertificatePage /> };
  const av: Record<string, React.ReactNode> = { 'admin-login': <AdminLoginPage />, 'admin-dashboard': <AdminDashboardPage />, 'admin-chapters': <ChapterManagerPage />, 'admin-questions': <QuestionManagerPage />, 'admin-students': <StudentManagerPage />, 'admin-student-detail': <StudentDetailPage />, 'admin-school-report': <SchoolReportPage />, 'admin-analytics': <AnalyticsPage />, 'admin-settings': <SettingsPage />, 'admin-certificates': <CertificateManagerPage /> };
  const hv: Record<string, React.ReactNode> = { 'landing': <LandingPage />, 'certificate-verify': <CertificateVerifyPage />, 'help-info': <HelpInfoPage /> };
  if (hv[currentView]) return hv[currentView]; if (sv[currentView]) return sv[currentView]; if (av[currentView]) return av[currentView]; return <LandingPage />;
}

function StudentSidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { setCurrentView, logout, currentUser, getOverallCompletion, canGenerateCertificate } = useAppStore();
  const completion = getOverallCompletion(); const canCert = canGenerateCertificate();
  const items: { icon: React.ReactNode; label: string; view: AppView; badge?: string }[] = [
    { icon: <Home className="h-4 w-4" />, label: 'Dashboard', view: 'student-dashboard' },
    { icon: <BookOpen className="h-4 w-4" />, label: 'Chapters', view: 'student-dashboard' },
    { icon: <BarChart3 className="h-4 w-4" />, label: 'Progress', view: 'progress-report' },
    { icon: <Flame className="h-4 w-4" />, label: 'Special Test', view: 'special-test-intro' },
    { icon: <Award className="h-4 w-4" />, label: 'Certificate', view: 'certificate', badge: canCert ? 'Ready' : undefined },
    { icon: <Search className="h-4 w-4" />, label: 'Verify Cert', view: 'certificate-verify' },
    { icon: <HelpCircle className="h-4 w-4" />, label: 'Help', view: 'help-info' },
  ];
  return (<div className="flex flex-col h-full">{!collapsed && (<div className="p-4"><div className="flex items-center gap-2 mb-1"><GraduationCap className="h-5 w-5 text-emerald-600" /><span className="font-semibold text-sm">Nathan&apos;s MCQ</span></div><p className="text-xs text-muted-foreground truncate">{currentUser?.name}</p><p className="text-xs text-muted-foreground truncate">{currentUser?.school}</p></div>)}<Separator /><ScrollArea className="flex-1 py-2"><nav className="space-y-1 px-2">{items.map((item) => (<Button key={item.view} variant="ghost" size={collapsed ? "icon" : "default"} className={`w-full justify-start gap-2 text-sm ${!collapsed ? 'px-3' : ''}`} onClick={() => { setCurrentView(item.view); onNavigate?.(); }}>{item.icon}{!collapsed && <span>{item.label}</span>}{!collapsed && item.badge && (<span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">{item.badge}</span>)}</Button>))}</nav></ScrollArea>{!collapsed && (<div className="p-3"><div className="text-xs text-muted-foreground mb-1">Overall Progress</div><div className="w-full bg-muted rounded-full h-1.5 mb-2"><div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${completion}%` }} /></div><p className="text-xs text-muted-foreground">{completion}% complete</p></div>)}<Separator /><div className="p-2"><Button variant="ghost" size={collapsed ? "icon" : "default"} className={`w-full justify-start gap-2 text-sm text-destructive hover:text-destructive ${!collapsed ? 'px-3' : ''}`} onClick={() => { logout(); onNavigate?.(); }}><LogOut className="h-4 w-4" />{!collapsed && <span>Logout</span>}</Button></div></div>);
}

function AdminSidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { setCurrentView, logout } = useAppStore();
  const items: { icon: React.ReactNode; label: string; view: AppView }[] = [
    { icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard', view: 'admin-dashboard' },
    { icon: <BookOpen className="h-4 w-4" />, label: 'Chapters', view: 'admin-chapters' },
    { icon: <FileQuestion className="h-4 w-4" />, label: 'Questions', view: 'admin-questions' },
    { icon: <Users className="h-4 w-4" />, label: 'Students', view: 'admin-students' },
    { icon: <Building2 className="h-4 w-4" />, label: 'School Report', view: 'admin-school-report' },
    { icon: <BarChart3 className="h-4 w-4" />, label: 'Analytics', view: 'admin-analytics' },
    { icon: <Award className="h-4 w-4" />, label: 'Certificates', view: 'admin-certificates' },
    { icon: <SettingsIcon className="h-4 w-4" />, label: 'Settings', view: 'admin-settings' },
    { icon: <HelpCircle className="h-4 w-4" />, label: 'Help', view: 'help-info' },
  ];
  return (<div className="flex flex-col h-full">{!collapsed && (<div className="p-4"><div className="flex items-center gap-2 mb-1"><Shield className="h-5 w-5 text-emerald-600" /><span className="font-semibold text-sm">Admin Panel</span></div><p className="text-xs text-muted-foreground">Nathan&apos;s Physics MCQ</p></div>)}<Separator /><ScrollArea className="flex-1 py-2"><nav className="space-y-1 px-2">{items.map((item) => (<Button key={item.view} variant="ghost" size={collapsed ? "icon" : "default"} className={`w-full justify-start gap-2 text-sm ${!collapsed ? 'px-3' : ''}`} onClick={() => { setCurrentView(item.view); onNavigate?.(); }}>{item.icon}{!collapsed && <span>{item.label}</span>}</Button>))}</nav></ScrollArea><Separator /><div className="p-2"><Button variant="ghost" size={collapsed ? "icon" : "default"} className={`w-full justify-start gap-2 text-sm text-destructive hover:text-destructive ${!collapsed ? 'px-3' : ''}`} onClick={() => { logout(); onNavigate?.(); }}><LogOut className="h-4 w-4" />{!collapsed && <span>Logout</span>}</Button></div></div>);
}

export default function AppShell() {
  const { initAppData, currentView, userRole } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  useEffect(() => { initAppData(); }, [initAppData]);
  const showNav = userRole && !['landing', 'student-login', 'student-register', 'admin-login', 'certificate-verify'].includes(currentView);
  const isTest = currentView === 'test' || currentView === 'special-test';
  if (!mounted) return (<div className="min-h-screen flex items-center justify-center bg-background"><div className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-6 w-6 animate-pulse" /><span className="text-sm">Loading...</span></div></div>);
  const Sidebar = userRole === 'admin' ? AdminSidebar : StudentSidebar;
  if (!showNav || isTest) return (<div className="min-h-screen bg-background"><ViewRouter /></div>);

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex lg:w-56 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card">
        <Sidebar collapsed={false} />
      </aside>
      <div className="flex-1 lg:pl-56 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-12 px-3 border-b bg-card">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Menu className="h-4 w-4" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium">Nathan&apos;s MCQ</span>
          </div>
          <div className="w-8" />
        </header>
        <main className="flex-1"><ViewRouter /></main>
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t">
          <div className="flex items-center justify-around h-14">
            {userRole === 'admin' ? (
              <>
                <BottomNavItem icon={<LayoutDashboard className="h-4 w-4" />} label="Home" view="admin-dashboard" />
                <BottomNavItem icon={<Users className="h-4 w-4" />} label="Students" view="admin-students" />
                <BottomNavItem icon={<BarChart3 className="h-4 w-4" />} label="Analytics" view="admin-analytics" />
                <BottomNavItem icon={<Award className="h-4 w-4" />} label="Certs" view="admin-certificates" />
                <BottomNavItem icon={<SettingsIcon className="h-4 w-4" />} label="Settings" view="admin-settings" />
              </>
            ) : (
              <>
                <BottomNavItem icon={<Home className="h-4 w-4" />} label="Home" view="student-dashboard" />
                <BottomNavItem icon={<BookOpen className="h-4 w-4" />} label="Chapters" view="student-dashboard" />
                <BottomNavItem icon={<Flame className="h-4 w-4" />} label="Special" view="special-test-intro" />
                <BottomNavItem icon={<BarChart3 className="h-4 w-4" />} label="Progress" view="progress-report" />
                <BottomNavItem icon={<Award className="h-4 w-4" />} label="Cert" view="certificate" />
              </>
            )}
          </div>
        </nav>
        <div className="lg:hidden h-14" />
      </div>
    </div>
  );
}

function BottomNavItem({ icon, label, view }: { icon: React.ReactNode; label: string; view: AppView }) {
  const { currentView, setCurrentView } = useAppStore();
  const isActive = currentView === view;
  return (<button className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs transition-colors ${isActive ? 'text-emerald-600' : 'text-muted-foreground'}`} onClick={() => setCurrentView(view)}>{icon}<span>{label}</span></button>);
}