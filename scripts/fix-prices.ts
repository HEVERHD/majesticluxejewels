import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname   = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

for (const file of [".env.local", ".env"]) {
  try {
    readFileSync(resolve(projectRoot, file), "utf8")
      .split(/\r?\n/)
      .forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const eq  = trimmed.indexOf("=");
        if (eq === -1) return;
        const key = trimmed.slice(0, eq).trim();
        let val   = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        if (key && !process.env[key]) process.env[key] = val;
      });
  } catch { /* no existe */ }
}

async function main() {
  const { PrismaNeon }   = await import("@prisma/adapter-neon");
  const { PrismaClient } = await import("../app/generated/prisma/client");

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const prisma  = new PrismaClient({ adapter });

  // Trae todos los productos
  const products = await prisma.product.findMany({ select: { id: true, name: true, price: true } });

  // Solo corrige los que tienen precio < 10000 (claramente les faltan los ceros)
  const toFix = products.filter((p) => p.price < 10000);

  if (toFix.length === 0) {
    console.log("✅ No hay precios que corregir.");
    await prisma.$disconnect();
    return;
  }

  console.log(`\nCorrigiendo ${toFix.length} producto(s):\n`);

  for (const p of toFix) {
    const newPrice = p.price * 1000;
    await prisma.product.update({ where: { id: p.id }, data: { price: newPrice } });
    console.log(`  ✓ ${p.name}: $${p.price} → $${newPrice.toLocaleString("es-CO")}`);
  }

  console.log("\n✅ Precios corregidos.");
  await prisma.$disconnect();
}

main().catch(console.error);
