import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

// GET - All settings as key-value object
export async function GET() {
  try {
    const allSettings = await db.settings.findMany();

    const settingsObj: Record<string, string> = {};
    for (const s of allSettings) {
      settingsObj[s.key] = s.value;
    }

    return NextResponse.json({ success: true, settings: settingsObj });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update setting(s)
const singleSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

const bulkSettingsSchema = z.object({
  settings: z.record(z.string(), z.string()),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Try bulk update first
    const bulkParsed = bulkSettingsSchema.safeParse(body);
    if (bulkParsed.success) {
      const { settings } = bulkParsed.data;
      const entries = Object.entries(settings);

      await Promise.all(
        entries.map(([key, value]) =>
          db.settings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          })
        )
      );

      return NextResponse.json({ success: true });
    }

    // Try single setting update
    const singleParsed = singleSettingSchema.safeParse(body);
    if (singleParsed.success) {
      const { key, value } = singleParsed.data;

      await db.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request body. Provide { key, value } or { settings: { key: value, ... } }' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
