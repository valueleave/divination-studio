import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { performMeihuaDivination } from '@/lib/meihua/engine';
import { generateMeihuaInterpretation } from '@/lib/meihua/interpreter';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const maxReqs = parseInt(process.env.RATE_LIMIT_MAX || '10');
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const rateCheck = checkRateLimit('meihua:' + ip, maxReqs, windowMs);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const now = new Date();
    const result = performMeihuaDivination(now);
    const interpretation = generateMeihuaInterpretation(result, question);
    const fullResult = {
      method: 'meihua', question, time: result.time,
      originalHexagram: result.originalHexagram, originalName: result.originalName,
      upperTrigram: result.upperTrigram, upperName: result.upperName,
      lowerTrigram: result.lowerTrigram, lowerName: result.lowerName,
      movingLine: result.movingLine,
      mutualHexagram: result.mutualHexagram, mutualName: result.mutualName,
      changedHexagram: result.changedHexagram, changedName: result.changedName,
      tiYong: result.tiYong, element: result.element,
      hexagramAnalysis: interpretation.hexagramAnalysis,
      shortTerm: interpretation.shortTerm, mediumTerm: interpretation.mediumTerm, longTerm: interpretation.longTerm,
      suggestions: interpretation.suggestions,
      comprehensiveAnalysis: interpretation.comprehensiveAnalysis,
      humanisticReading: interpretation.humanisticReading,
    };
    const record = await prisma.divinationRecord.create({
      data: { method: 'meihua', question, result: JSON.stringify(fullResult), createdAt: now },
    });
    return NextResponse.json({ id: record.id, ...fullResult });
  } catch (error) {
    console.error('Meihua divination error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
