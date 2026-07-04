import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const reopenTestSchema = z.object({
  studentId: z.string().min(1),
  chapterId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reopenTestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { studentId, chapterId } = parsed.data;

    // Find the latest passed attempt for this student + chapter
    const latestPassed = await db.attempt.findFirst({
      where: {
        studentId,
        chapterId,
        passed: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestPassed) {
      return NextResponse.json(
        { success: false, error: 'No passed attempt found for this student and chapter' },
        { status: 404 }
      );
    }

    // Mark the latest passed attempt as not passed
    await db.attempt.update({
      where: { id: latestPassed.id },
      data: { passed: false },
    });

    // Check if the student still has all chapters passed
    const activeChapters = await db.chapter.findMany({
      where: { active: true },
      select: { id: true },
    });

    const passedAttempts = await db.attempt.findMany({
      where: { studentId, passed: true },
      select: { chapterId: true },
      distinct: ['chapterId'],
    });

    const passedChapterIds = new Set(passedAttempts.map((a) => a.chapterId));
    const allChaptersPassed = activeChapters.length > 0 && activeChapters.every((ch) => passedChapterIds.has(ch.id));

    // If not all chapters passed anymore, revoke certificate
    if (!allChaptersPassed) {
      await db.certificate.updateMany({
        where: { studentId, issued: true },
        data: { issued: false },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test reopened successfully',
      allChaptersPassed,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
