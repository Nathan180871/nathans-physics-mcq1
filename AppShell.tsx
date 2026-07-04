import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'adminId is required' },
        { status: 400 }
      );
    }

    // Verify admin exists
    const admin = await db.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 403 }
      );
    }

    // Total students
    const totalStudents = await db.student.count();

    // Get all active chapters
    const activeChapters = await db.chapter.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    // All attempts
    const allAttempts = await db.attempt.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Recent attempts (last 20)
    const recentAttempts = allAttempts.slice(0, 20).map((a) => ({
      id: a.id,
      studentId: a.studentId,
      chapterName: a.chapterName,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: a.percentage,
      passed: a.passed,
      timeTaken: a.timeTaken,
      createdAt: a.createdAt,
    }));

    // Chapter-wise pass rate and avg score
    const chapterWisePassRate = await Promise.all(
      activeChapters.map(async (chapter) => {
        const chapterAttempts = allAttempts.filter((a) => a.chapterId === chapter.id);

        if (chapterAttempts.length === 0) {
          return {
            chapterName: chapter.name,
            passRate: 0,
            avgScore: 0,
            totalAttempts: 0,
          };
        }

        const passedCount = chapterAttempts.filter((a) => a.passed).length;
        const avgScore = chapterAttempts.reduce((sum, a) => sum + a.percentage, 0) / chapterAttempts.length;

        return {
          chapterName: chapter.name,
          passRate: Math.round((passedCount / chapterAttempts.length) * 100 * 100) / 100,
          avgScore: Math.round(avgScore * 100) / 100,
          totalAttempts: chapterAttempts.length,
        };
      })
    );

    // Most difficult chapters (sorted by avgScore ascending)
    const mostDifficultChapters = [...chapterWisePassRate]
      .filter((c) => c.totalAttempts > 0)
      .sort((a, b) => a.avgScore - b.avgScore);

    // Students who have completed all chapters
    const studentsWithCerts = await db.certificate.findMany({
      where: { issued: true },
    });
    const completedStudents = studentsWithCerts.length;

    return NextResponse.json({
      success: true,
      analytics: {
        totalStudents,
        completedStudents,
        chapterWisePassRate,
        mostDifficultChapters,
        recentAttempts,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}