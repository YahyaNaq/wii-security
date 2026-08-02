import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

try {
  process.loadEnvFile();
} catch {
  // no .env file present (e.g. CI provides env vars directly)
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const guestTiers = [
  { slug: "under-50", minGuests: 0, maxGuests: 49, price: 15_000, sortOrder: 0 },
  { slug: "50-80", minGuests: 50, maxGuests: 80, price: 22_000, sortOrder: 1 },
  { slug: "80-150", minGuests: 81, maxGuests: 150, price: 30_000, sortOrder: 2 },
  { slug: "150-200", minGuests: 151, maxGuests: 200, price: 38_000, sortOrder: 3 },
  { slug: "200-300", minGuests: 201, maxGuests: 300, price: 46_000, sortOrder: 4 },
  { slug: "300-350", minGuests: 301, maxGuests: 350, price: 54_000, sortOrder: 5 },
  { slug: "350-400", minGuests: 351, maxGuests: 400, price: 62_000, sortOrder: 6 },
  { slug: "400-500", minGuests: 401, maxGuests: 500, price: 70_000, sortOrder: 7 },
];

const serviceOptions = [
  {
    serviceType: "PHOTOGRAPHY" as const,
    slug: "couple-bridal",
    label: "Couple + Bridal (120–150 pictures)",
    price: 15_000,
    sortOrder: 0,
  },
  {
    serviceType: "PHOTOGRAPHY" as const,
    slug: "couple-bridal-family",
    label: "Couple + Bridal + Family/Guests (unlimited)",
    price: 20_000,
    sortOrder: 1,
  },
  {
    serviceType: "VIDEOGRAPHY" as const,
    slug: "reels-cinematic",
    label: "Reels, Cinematic & Long Videos",
    price: 15_000,
    sortOrder: 0,
  },
  {
    serviceType: "VIDEOGRAPHY" as const,
    slug: "testimonial",
    label: "Testimonial Videos",
    price: 25_000,
    sortOrder: 1,
  },
];

async function main() {
  for (const tier of guestTiers) {
    await prisma.guestTierPrice.upsert({
      where: { slug: tier.slug },
      update: tier,
      create: tier,
    });
  }

  for (const option of serviceOptions) {
    await prisma.serviceOptionPrice.upsert({
      where: { serviceType_slug: { serviceType: option.serviceType, slug: option.slug } },
      update: option,
      create: option,
    });
  }

  console.log(`Seeded ${guestTiers.length} guest tiers and ${serviceOptions.length} service options.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
