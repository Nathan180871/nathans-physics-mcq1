import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'studentId is required' },
        { status: 400 }
      );
    }

    // Get all active chapters
    const chapters = await db.chapter.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    // Get all attempts for this student
    const attempts = await db.attempt.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });

    // Group attempts by chapterId
    const attemptsByChapter = new Map<string, typeof attempts>();
    for (const attempt of attempts) {
      const existing = attemptsByChapter.get(attempt.chapterId) ?? [];
      existing.push(attempt);
      attemptsByChapter.set(attempt.chapterId, existing);
    }

    // Build progress for each chapter
    const chapterProgress = chapters.map((chapter) => {
      const chapterAttempts = attemptsByChapter.get(chapter.id) ?? [];

      if (chapterAttempts.length === 0) {
        return {
          chapterId: chapter.id,
          chapterName: chapter.name,
          attempts: 0,
          highestScore: 0,
          latestScore: 0,
          passed: false,
          bestTime: 0,
          lastAttemptDate: null,
          status: 'not_started' as const,
        };
      }

      const highestScore = Math.max(...chapterAttempts.map((a) => a.percentage));
      const latestScore = chapterAttempts[0].percentage;
      const passed = chapterAttempts.some((a) => a.passed);
      const bestTime = Math.min(
        ...chapterAttempts.filter((a) => a.timeTaken > 0).map((a) => a.timeTaken)
      );
      const lastAttemptDate = chapterAttempts[0].createdAt;

      const status = passed ? 'passed' as const : 'in_progress' as const;

      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        attempts: chapterAttempts.length,
        highestScore: Math.round(highestScore * 100) / 100,
        latestScore: Math.round(latestScore * 100) / 100,
        passed,
        bestTime: chapterAttempts.some((a) => a.timeTaken > 0) ? bestTime : 0,
        lastAttemptDate,
        status,
      };
    });

    const totalChapters = chapters.length;
    const passedChapters = chapterProgress.filter((c) => c.passed).length;
    const completionPercentage = totalChapters > 0
      ? Math.round((passedChapters / totalChapters) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      chapters: chapterProgress,
      totalChapters,
      passedChapters,
      completionPercentage,
      totalAttempts: attempts.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}