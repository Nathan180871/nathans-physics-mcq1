import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('certificateId');

    if (!certificateId) {
      return NextResponse.json(
        { success: false, error: 'certificateId is required' },
        { status: 400 }
      );
    }

    const certificate = await db.certificate.findUnique({
      where: { certificateId },
      include: {
        student: {
          select: { id: true, name: true, email: true, school: true, class: true },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        schoolName: certificate.schoolName,
        completionDate: certificate.completionDate,
        issued: certificate.issued,
        teacherRemarks: certificate.teacherRemarks,
        student: certificate.student,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}