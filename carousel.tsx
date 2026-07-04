'use client';

import dynamic from 'next/dynamic';

const AppShell = dynamic(() => import('@/components/app/AppShell'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-2 text-muted-foreground">
        <svg className="h-6 w-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
        </svg>
        <span className="text-sm">Loading Nathan&apos;s Physics MCQ...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <AppShell />;
}