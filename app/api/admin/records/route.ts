import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const secret = process.env.ADMIN_SECRET;
    if (secret && authHeader !== 'Bearer ' + secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const where = search
      ? { OR: [{ question: { contains: search } }, { method: { contains: search } }] }
      : {};
    const [records, total] = await Promise.all([
      prisma.divinationRecord.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take: limit,
      }),
      prisma.divinationRecord.count({ where }),
    ]);
    return NextResponse.json({
      records: records.map(r => ({
        id: r.id, method: r.method, question: r.question,
        createdAt: r.createdAt.toISOString(),
      })),
      total, page, totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin records error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const secret = process.env.ADMIN_SECRET;
    if (secret && authHeader !== 'Bearer ' + secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await req.json();
    if (id === 'all') {
      await prisma.divinationRecord.deleteMany();
      return NextResponse.json({ success: true, message: 'All records deleted' });
    }
    await prisma.divinationRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
