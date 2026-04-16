import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[AUTH POST]", error);
    return Response.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE() {
  await deleteSession();
  return Response.json({ ok: true });
}
