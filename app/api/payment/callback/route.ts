import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCode } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const { orderNo, status: payStatus, mode } = await req.json();
    if (!orderNo || payStatus !== "paid") {
      return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
    }
    const order = await prisma.paymentOrder.findUnique({ where: { orderNo } });
    if (!order || order.status !== "pending") {
      return NextResponse.json({ error: "Order not found or already processed" }, { status: 400 });
    }
    // Generate redemption code
    const code = generateCode();
    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: { status: "paid", paidAt: new Date() },
    });
    await prisma.redemptionCode.create({
      data: {
        code,
        totalTurns: order.turnCount,
        usedTurns: 0,
        status: "active",
        paymentId: order.id,
      },
    });
    return NextResponse.json({ success: true, code, turnCount: order.turnCount });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}