import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWompiWebhook, getWompiTransaction } from "@/lib/wompi";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-event-checksum") || "";

    // Verify signature
    const valid = await verifyWompiWebhook(rawBody, signature);
    if (!valid) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "transaction.updated") {
      return NextResponse.json({ received: true });
    }

    const transactionData = event.data?.transaction;
    if (!transactionData) return NextResponse.json({ received: true });

    const { id: transactionId, reference, status } = transactionData;

    // Find order by orderNumber (reference)
    const order = await prisma.order.findUnique({
      where: { orderNumber: reference },
    });

    if (!order) {
      console.warn("[Wompi webhook] Order not found for reference:", reference);
      return NextResponse.json({ received: true });
    }

    // Map Wompi status to our payment status
    const paymentStatusMap: Record<string, string> = {
      APPROVED: "PAID",
      DECLINED: "FAILED",
      VOIDED: "REFUNDED",
      ERROR: "FAILED",
    };

    const paymentStatus = paymentStatusMap[status] || "PENDING";
    const orderStatus =
      status === "APPROVED"
        ? "CONFIRMED"
        : status === "DECLINED" || status === "ERROR"
        ? "CANCELLED"
        : order.status;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paymentStatus as never,
        status: orderStatus as never,
        wompiTransactionId: transactionId,
      },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Wompi webhook]", err);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}
