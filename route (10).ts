import { NextRequest, NextResponse } from 'next/server';
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

    const certificate = await db.certificate.findUnique({
      where: { studentId },
    });

    if (!certificate || !certificate.issued) {
      return NextResponse.json({ success: true, issued: false });
    }

    return NextResponse.json({
      success: true,
      issued: true,
      certificate: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        schoolName: certificate.schoolName,
        completionDate: certificate.completionDate,
        teacherRemarks: certificate.teacherRemarks,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}