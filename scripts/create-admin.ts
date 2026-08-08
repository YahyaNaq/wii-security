// Usage: npx tsx scripts/create-admin.ts <email> <password> <name>
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

try {
  process.loadEnvFile();
} catch {
  // no .env file present (e.g. CI provides env vars directly)
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password || !name) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> <name>");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name },
    create: { email: email.toLowerCase(), passwordHash, name },
  });

  console.log(`Admin user ready: ${admin.email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
