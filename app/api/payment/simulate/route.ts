import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCode } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }
    const order = await prisma.paymentOrder.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "pending") {
      return NextResponse.json({ error: "Order already processed" }, { status: 400 });
    }
    // Simulate payment success
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
    console.error("Simulate payment error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}