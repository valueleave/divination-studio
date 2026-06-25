import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { performXiaoliurenDivination } from '@/lib/xiaoliuren/engine';
import { generateXiaoliurenInterpretation } from '@/lib/xiaoliuren/interpreter';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const maxReqs = parseInt(process.env.RATE_LIMIT_MAX || '10');
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const rateCheck = checkRateLimit('xiaoliuren:' + ip, maxReqs, windowMs);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const now = new Date();
    const result = performXiaoliurenDivination(now);
    const interpretation = generateXiaoliurenInterpretation(result, question);
    const fullResult = {
      method: 'xiaoliuren', question, time: result.time,
      finalPosition: result.finalPosition, deityName: result.deityName,
      grade: result.grade, element: result.element, direction: result.direction,
      monthPosition: result.monthPosition, dayPosition: result.dayPosition,
      month: result.month, day: result.day, shichen: result.shichen,
      basicAnalysis: interpretation.basicAnalysis, meaning: interpretation.meaning,
      loveForecast: interpretation.loveForecast, careerForecast: interpretation.careerForecast,
      wealthForecast: interpretation.wealthForecast, healthForecast: interpretation.healthForecast,
      advice: interpretation.advice,
      comprehensiveAnalysis: interpretation.comprehensiveAnalysis,
      humanisticReading: interpretation.humanisticReading,
    };
    const record = await prisma.divinationRecord.create({
      data: { method: 'xiaoliuren', question, result: JSON.stringify(fullResult), createdAt: now },
    });
    return NextResponse.json({ id: record.id, ...fullResult });
  } catch (error) {
    console.error('Xiaoliuren divination error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
