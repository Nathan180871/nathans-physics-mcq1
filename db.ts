import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const certificates = await db.certificate.findMany({
      where: { issued: true },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            school: true,
            class: true,
            rollNumber: true,
          },
        },
      },
      orderBy: { completionDate: 'desc' },
    });

    return NextResponse.json({ success: true, certificates });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
