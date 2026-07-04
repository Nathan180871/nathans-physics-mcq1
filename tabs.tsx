import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['student', 'admin']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, role } = parsed.data;

    if (role === 'student') {
      const student = await db.student.findUnique({ where: { email } });
      if (!student || student.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        success: true,
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'student' as const,
          class: student.class,
          school: student.school,
          rollNumber: student.rollNumber,
        },
      });
    }

    const admin = await db.admin.findUnique({ where: { email } });
    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin' as const,
        class: '',
        school: '',
        rollNumber: '',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}