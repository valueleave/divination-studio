import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.divinationRecord.findUnique({
      where: { id },
    });
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: record.id,
      method: record.method,
      question: record.question,
      result: JSON.parse(record.result),
      createdAt: record.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.divinationRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
