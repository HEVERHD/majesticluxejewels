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

const EMAIL    = "admin@majesticluxejewels.com";
const PASSWORD = "Majestic2025!";

async function main() {
  const { PrismaNeon }      = await import("@prisma/adapter-neon");
  const { PrismaClient }    = await import("../app/generated/prisma/client");
  const { default: bcrypt } = await import("bcryptjs");

  // Misma API que lib/prisma.ts usa
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const prisma  = new PrismaClient({ adapter });

  const hash = await bcrypt.hash(PASSWORD, 12);

  const user = await prisma.user.upsert({
    where:  { email: EMAIL },
    update: { password: hash },
    create: { email: EMAIL, password: hash, name: "Admin", role: "ADMIN" },
  });

  console.log("✅ Usuario listo:");
  console.log("   Email:     ", user.email);
  console.log("   Contraseña:", PASSWORD);
  console.log("   Role:      ", user.role);

  await prisma.$disconnect();
}

main().catch(console.error);
