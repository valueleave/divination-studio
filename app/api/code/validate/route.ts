import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    const record = await prisma.redemptionCode.findUnique({ where: { code: code.trim().toUpperCase() } });
    if (!record) {
      return NextResponse.json({ error: "取次码不存在" }, { status: 404 });
    }
    if (record.status === "exhausted") {
      return NextResponse.json({ error: "此取次码已用尽" }, { status: 400 });
    }
    if (record.status === "expired") {
      return NextResponse.json({ error: "此取次码已过期" }, { status: 400 });
    }
    if (record.expiresAt && new Date() > record.expiresAt) {
      await prisma.redemptionCode.update({ where: { id: record.id }, data: { status: "expired" } });
      return NextResponse.json({ error: "此取次码已过期" }, { status: 400 });
    }
    const remaining = record.totalTurns - record.usedTurns;
    if (remaining <= 0) {
      await prisma.redemptionCode.update({ where: { id: record.id }, data: { status: "exhausted" } });
      return NextResponse.json({ error: "此取次码已用尽" }, { status: 400 });
    }
    return NextResponse.json({
      valid: true,
      code: record.code,
      remaining: remaining,
      totalTurns: record.totalTurns,
      usedTurns: record.usedTurns,
    });
  } catch (error) {
    console.error("Code validate error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}