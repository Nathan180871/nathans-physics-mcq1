import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const exportCsv = searchParams.get('export');

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'adminId is required' },
        { status: 400 }
      );
    }

    // Verify admin exists
    const admin = await db.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 403 }
      );
    }

    // Get all students
    const students = await db.student.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Get attempt counts per student
    const attemptCounts = await db.attempt.groupBy({
      by: ['studentId'],
      _count: { id: true },
    });
    const attemptCountMap = new Map(attemptCounts.map((a) => [a.studentId, a._count.id]));

    // Get passed chapters per student
    const passedChapters = await db.attempt.groupBy({
      by: ['studentId', 'chapterId'],
      where: { passed: true },
      _count: { id: true },
    });
    const passedChapterMap = new Map<string, number>();
    for (const pc of passedChapters) {
      passedChapterMap.set(pc.studentId, (passedChapterMap.get(pc.studentId) ?? 0) + 1);
    }

    // Get certificate status
    const certificates = await db.certificate.findMany({
      select: { studentId: true, issued: true, certificateId: true },
    });
    const certMap = new Map(certificates.map((c) => [c.studentId, c]));

    const studentsWithStats = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      class: s.class,
      school: s.school,
      rollNumber: s.rollNumber,
      createdAt: s.createdAt,
      attemptCount: attemptCountMap.get(s.id) ?? 0,
      passedChapterCount: passedChapterMap.get(s.id) ?? 0,
      certificate: certMap.get(s.id) ?? null,
    }));

    // CSV export
    if (exportCsv === 'csv') {
      const headers = [
        'Name', 'Email', 'Class', 'School', 'Roll Number',
        'Total Attempts', 'Passed Chapters', 'Certificate Issued',
        'Registered Date',
      ];
      const rows = studentsWithStats.map((s) => [
        s.name,
        s.email,
        s.class,
        s.school,
        s.rollNumber,
        String(s.attemptCount),
        String(s.passedChapterCount),
        s.certificate?.issued ? 'Yes' : 'No',
        s.createdAt.toISOString().split('T')[0],
      ]);

      const csvLines = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))];
      const csvText = csvLines.join('\n');

      return new NextResponse(csvText, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename=students.csv',
        },
      });
    }

    return NextResponse.json({ success: true, students: studentsWithStats });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}