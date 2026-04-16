import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Crear usuario admin por defecto
  const existing = await prisma.user.findUnique({
    where: { email: "admin@majesticluxejewels.com" },
  });

  if (!existing) {
    const hash = await bcrypt.hash("Admin123!", 12);
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@majesticluxejewels.com",
        password: hash,
        role: "SUPER_ADMIN",
      },
    });
    console.log("✓ Admin creado: admin@majesticluxejewels.com / Admin123!");
  } else {
    console.log("✓ Admin ya existe");
  }

  // Categorías iniciales
  const categories = [
    { name: "Anillos", slug: "anillos" },
    { name: "Collares", slug: "collares" },
    { name: "Pulseras", slug: "pulseras" },
    { name: "Aretes", slug: "aretes" },
    { name: "Conjuntos", slug: "conjuntos" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✓ Categorías creadas");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
