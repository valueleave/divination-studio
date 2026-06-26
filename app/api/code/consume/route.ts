import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    const record = await prisma.redemptionCode.findUnique({ where: { code: code.trim().toUpperCase() } });
    if (!record) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }
    if (record.status !== "active") {
      return NextResponse.json({ error: "Code is not active" }, { status: 400 });
    }
    const remaining = record.totalTurns - record.usedTurns;
    if (remaining <= 0) {
      await prisma.redemptionCode.update({ where: { id: record.id }, data: { status: "exhausted" } });
      return NextResponse.json({ error: "No turns remaining" }, { status: 400 });
    }
    // Consume one turn
    const newUsed = record.usedTurns + 1;
    const newStatus = newUsed >= record.totalTurns ? "exhausted" : "active";
    await prisma.redemptionCode.update({
      where: { id: record.id },
      data: { usedTurns: newUsed, status: newStatus },
    });
    return NextResponse.json({
      success: true,
      remaining: record.totalTurns - newUsed,
      code: record.code,
    });
  } catch (error) {
    console.error("Code consume error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}