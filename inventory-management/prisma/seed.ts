import { PrismaClient } from "@prisma/client";
import "dotenv/config";
const prisma = new PrismaClient();

async function main() {
  // Clear existing database
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@medchem.com",
      password: "admin123",
      role: "ADMIN",
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: "Seller User",
      email: "seller@medchem.com",
      password: "seller123",
      role: "USER",
    },
  });

  console.log("Users seeded successfully:", { admin: admin.email, seller: seller.email });

  // Seed Products
  await prisma.product.createMany({
    data: [
      {
        name: "Sugar",
        sku: "SUG001",
        dimension: "weight",
        baseUnit: "g",
        inventoryQuantity: 50000,
        pricePerBaseUnit: 0.06,
      },
      {
        name: "Mustard Oil",
        sku: "OIL001",
        dimension: "volume",
        baseUnit: "mL",
        inventoryQuantity: 100000,
        pricePerBaseUnit: 0.15,
      },
      {
        name: "Bottle",
        sku: "BOT001",
        dimension: "count",
        baseUnit: "item",
        inventoryQuantity: 500,
        pricePerBaseUnit: 20,
      },
    ],
  });

  console.log("Products seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });