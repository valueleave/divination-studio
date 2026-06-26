import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNo, generateCode, PRICING_PLANS } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();
    const plan = PRICING_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const orderNo = generateOrderNo();
    const order = await prisma.paymentOrder.create({
      data: { orderNo, amount: plan.price, turnCount: plan.turns, status: "pending" },
    });
    // In production, call xorpay API here to get QR code URL
    // For simulated mode, return a mock response
    return NextResponse.json({
      orderId: order.id,
      orderNo: order.orderNo,
      amount: order.amount,
      turnCount: order.turnCount,
      // In xorpay mode, this would be the real payment QR code URL
      qrCodeUrl: null,
      mode: process.env.PAYMENT_PROVIDER || "simulated",
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}