import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

// GET - List questions for a chapter
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
      where: { chapterId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, questions });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new question
const createQuestionSchema = z.object({
  chapterId: z.string().min(1),
  questionText: z.string().min(1),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctOption: z.enum(['optionA', 'optionB', 'optionC', 'optionD']),
  explanation: z.string().default(''),
  difficulty: z.string().default('Medium'),
  topic: z.string().default(''),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const question = await db.question.create({ data: parsed.data });

    return NextResponse.json({ success: true, question });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Edit question
const updateQuestionSchema = z.object({
  id: z.string().min(1),
  questionText: z.string().min(1).optional(),
  optionA: z.string().min(1).optional(),
  optionB: z.string().min(1).optional(),
  optionC: z.string().min(1).optional(),
  optionD: z.string().min(1).optional(),
  correctOption: z.enum(['optionA', 'optionB', 'optionC', 'optionD']).optional(),
  explanation: z.string().optional(),
  difficulty: z.string().optional(),
  topic: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const question = await db.question.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, question });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete question
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

    await db.question.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}