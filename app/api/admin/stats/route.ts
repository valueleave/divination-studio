import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const secret = process.env.ADMIN_SECRET;
    if (secret && authHeader !== 'Bearer ' + secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [totalRecords, todayRecords, meihuaCount, xiaoliurenCount] = await Promise.all([
      prisma.divinationRecord.count(),
      prisma.divinationRecord.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.divinationRecord.count({ where: { method: 'meihua' } }),
      prisma.divinationRecord.count({ where: { method: 'xiaoliuren' } }),
    ]);
    return NextResponse.json({
      totalRecords,
      todayRecords,
      meihuaCount,
      xiaoliurenCount,
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
