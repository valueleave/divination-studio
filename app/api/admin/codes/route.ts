import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCode } from "@/lib/payment";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.ADMIN_SECRET;
    if (secret && authHeader !== "Bearer " + secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orders = await prisma.paymentOrder.findMany({
      where: { status: "pending_verification" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders.map(function(o) {
      return { id: o.id, orderNo: o.orderNo, amount: o.amount, turnCount: o.turnCount, createdAt: o.createdAt.toISOString() };
    }));
  } catch (error) {
    console.error("Admin codes error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.ADMIN_SECRET;
    if (secret && authHeader !== "Bearer " + secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }
    const order = await prisma.paymentOrder.findUnique({ where: { id: orderId } });
    if (!order || order.status !== "pending_verification") {
      return NextResponse.json({ error: "Order not found or already processed" }, { status: 400 });
    }
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
    console.error("Admin activate error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}