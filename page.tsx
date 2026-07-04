import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json(
        { success: false, error: 'chapterId is required' },
        { status: 400 }
      );
    }

    const questions = await db.question.findMany({
      where: { chapterId, active: true },
      orderBy: { createdAt: 'asc' },
    });

    const result = questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      difficulty: q.difficulty,
      topic: q.topic,
    }));

    return NextResponse.json({ success: true, questions: result });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}