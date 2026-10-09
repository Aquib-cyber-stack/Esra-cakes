import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CAKES = [
  {
    name: "Chocolate Truffle Delight",
    slug: "chocolate-truffle-delight",
    description:
      "Rich dark cocoa sponge layered with silky ganache, finished with a glossy chocolate drip.",
    category: "BIRTHDAY" as const,
    flavours: ["Chocolate Truffle"],
    sizes: ["6-inch (8 servings)", "8-inch (16 servings)", "10-inch (24 servings)"],
    startingPrice: 1899,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
  },
  {
    name: "Classic Red Velvet",
    slug: "classic-red-velvet",
    description: "Velvety red sponge with tangy cream cheese frosting, hand-piped rosettes.",
    category: "BIRTHDAY" as const,
    flavours: ["Red Velvet"],
    sizes: ["6-inch (8 servings)", "8-inch (16 servings)"],
    startingPrice: 1799,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=800",
  },
  {
    name: "Three-Tier Wedding Elegance",
    slug: "three-tier-wedding-elegance",
    description:
      "A statement three-tier wedding cake with delicate sugar florals and a gold leaf finish.",
    category: "WEDDING" as const,
    flavours: ["Vanilla Bean", "Pistachio Rose", "Lemon Blueberry"],
    sizes: ["3-tier (60 servings)", "4-tier (90 servings)"],
    startingPrice: 12999,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1519654793190-2301e6cbdf59?w=800",
  },
  {
    name: "Golden Anniversary Cake",
    slug: "golden-anniversary-cake",
    description: "Salted caramel layers with a gold-dusted finish, designed for milestone anniversaries.",
    category: "ANNIVERSARY" as const,
    flavours: ["Salted Caramel"],
    sizes: ["8-inch (16 servings)", "10-inch (24 servings)"],
    startingPrice: 2499,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800",
  },
  {
    name: "Rainbow Cartoon Cake",
    slug: "rainbow-cartoon-cake",
    description: "A playful, colourful cake hand-decorated to match your child's favourite character.",
    category: "KIDS" as const,
    flavours: ["Vanilla Bean", "Chocolate Truffle"],
    sizes: ["6-inch (8 servings)", "8-inch (16 servings)"],
    startingPrice: 1999,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=800",
  },
  {
    name: "Corporate Logo Cake",
    slug: "corporate-logo-cake",
    description: "A sheet cake with edible print branding — perfect for launches and milestones.",
    category: "CORPORATE" as const,
    flavours: ["Black Forest", "Chocolate Truffle"],
    sizes: ["Quarter sheet (20 servings)", "Half sheet (40 servings)"],
    startingPrice: 3499,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800",
  },
  {
    name: "Bespoke Sculpted Cake",
    slug: "bespoke-sculpted-cake",
    description: "Fully custom sculpted design built from your reference photo — any shape, any theme.",
    category: "CUSTOM" as const,
    flavours: ["Chocolate Truffle", "Red Velvet", "Pistachio Rose"],
    sizes: ["Small (10 servings)", "Medium (20 servings)", "Large (35 servings)"],
    startingPrice: 4999,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800",
  },
  {
    name: "Lemon Blueberry Bliss",
    slug: "lemon-blueberry-bliss",
    description: "Bright lemon sponge folded with fresh blueberries, finished with a citrus glaze.",
    category: "BIRTHDAY" as const,
    flavours: ["Lemon Blueberry"],
    sizes: ["6-inch (8 servings)", "8-inch (16 servings)"],
    startingPrice: 1899,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=800",
  },
];

const REVIEWS = [
  {
    name: "Priya M.",
    rating: 5,
    message:
      "We sent a blurry photo of my daughter's favourite cartoon and Esra Cakes turned it into the actual cake — down to the colours. It didn't taste like a bakery cake either, it tasted homemade.",
    occasion: "Kids Birthday",
    status: "APPROVED" as const,
    isFeatured: true,
  },
  {
    name: "Arjun & Meera",
    rating: 5,
    message: "Our wedding cake was the centrepiece of the whole reception. Absolutely stunning and delicious.",
    occasion: "Wedding",
    status: "APPROVED" as const,
    isFeatured: true,
  },
  {
    name: "Fatima R.",
    rating: 4,
    message: "Great communication throughout and the cake arrived exactly on time for our office launch.",
    occasion: "Corporate Event",
    status: "APPROVED" as const,
    isFeatured: false,
  },
  {
    name: "Karan S.",
    rating: 5,
    message: "Third time ordering from Esra Cakes and every single time it's exceeded expectations.",
    occasion: "Anniversary",
    status: "PENDING" as const,
    isFeatured: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@esracakes.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: process.env.SEED_ADMIN_NAME || "Esra",
      email: adminEmail,
      passwordHash,
      role: "SUPERADMIN",
    },
  });
  console.log(`✅ Admin ready: ${adminEmail}`);

  for (const c of CAKES) {
    const { image, ...cakeData } = c;
    await prisma.cake.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        ...cakeData,
        images: { create: [{ url: image, isPrimary: true, sortOrder: 0 }] },
      },
    });
  }
  console.log(`✅ Seeded ${CAKES.length} cakes`);

  for (const r of REVIEWS) {
    await prisma.review.create({ data: r });
  }
  console.log(`✅ Seeded ${REVIEWS.length} reviews`);

  console.log("🌱 Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
