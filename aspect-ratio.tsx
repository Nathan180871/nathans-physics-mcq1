import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  school: z.string().default(''),
  rollNumber: z.string().default(''),
  class: z.string().default('XII'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, school, rollNumber, class: studentClass } = parsed.data;

    const existing = await db.student.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    const student = await db.student.create({
      data: {
        name,
        email,
        password,
        school,
        rollNumber,
        class: studentClass,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student' as const,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}