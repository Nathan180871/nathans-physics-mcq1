import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const chapters = await db.chapter.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { questions: { where: { active: true } } },
        },
      },
    });

    const result = chapters.map((ch) => ({
      id: ch.id,
      order: ch.order,
      name: ch.name,
      slug: ch.slug,
      description: ch.description,
      topics: ch.topics,
      questionCount: ch._count.questions,
    }));

    return NextResponse.json({ success: true, chapters: result });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}