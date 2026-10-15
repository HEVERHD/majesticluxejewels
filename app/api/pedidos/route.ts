import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `MLJ-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, phone, email,
      address, addressLine2, city, department, postalCode,
      notes, newsletter,
      paymentMethod,
      items,
      subtotal, shippingCost, total,
    } = body;

    // Basic validation
    if (!firstName || !lastName || !phone || !address || !city || !department || !items?.length) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    if (!["COD", "WOMPI"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Método de pago inválido" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        paymentMethod,
        status: "PENDING",
        paymentStatus: "PENDING",
        firstName, lastName, phone,
        email: email || "",
        address, addressLine2, city, department,
        postalCode: postalCode || "",
        notes: notes || "",
        newsletter: newsletter || false,
        subtotal, shippingCost, total,
        items: {
          create: items.map((item: {
            id: string; name: string; image?: string; price: number; quantity: number;
          }) => ({
            productId: item.id,
            name: item.name,
            image: item.image || null,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Notificación WhatsApp al admin (abre un link pre-cargado en la respuesta)
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "18633482679";
    const notifyText = encodeURIComponent(
      `🛍️ *Nuevo pedido* ${orderNumber}\n` +
      `👤 ${firstName} ${lastName}\n` +
      `📞 ${phone}\n` +
      `💰 $${total.toLocaleString("es-CO")} COP\n` +
      `💳 ${paymentMethod === "COD" ? "Contra entrega" : "Wompi"}\n` +
      `📍 ${city}, ${department}`
    );
    const adminNotifyUrl = `https://wa.me/${adminPhone}?text=${notifyText}`;

    return NextResponse.json({ order, adminNotifyUrl }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/pedidos]", err);
    return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    const where = status ? { status: status as never } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, limit });
  } catch (err) {
    console.error("[GET /api/pedidos]", err);
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}
