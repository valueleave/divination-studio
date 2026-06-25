import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const records = await prisma.divinationRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      records.map((r) => ({
        id: r.id,
        method: r.method,
        question: r.question,
        result: JSON.parse(r.result),
        createdAt: r.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
