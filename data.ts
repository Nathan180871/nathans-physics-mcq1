import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

// GET - All chapters (including inactive)
export async function GET() {
  try {
    const chapters = await db.chapter.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json({ success: true, chapters });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add chapter
const createChapterSchema = z.object({
  order: z.number().int().min(0),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(''),
  topics: z.string().default(''),
  active: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createChapterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const chapter = await db.chapter.create({ data: parsed.data });

    return NextResponse.json({ success: true, chapter });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Edit chapter
const updateChapterSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0).optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  topics: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateChapterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const chapter = await db.chapter.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, chapter });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete chapter (cascade deletes questions)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      );
    }

    await db.chapter.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}