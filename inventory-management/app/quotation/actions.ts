"use server";

import { prisma } from "@/lib/prisma";
import { convertToBaseUnit } from "@/lib/conversions";
import { isValidUnit } from "@/lib/units";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export async function createOrder(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Please login first");
  }

  // Check if user still exists in the database (handles post-reseed active cookies)
  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!dbUser) {
    throw new Error("User session invalid (User not found). Please log out and log in again.");
  }

  const productId = formData.get("productId") as string;

  const quantity = Number(
    formData.get("quantity")
  );

  const unit = formData.get("unit") as string;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!isValidUnit(product.dimension, unit)) {
    throw new Error("Invalid unit selected");
  }

  const baseQuantity = convertToBaseUnit(
    quantity,
    unit
  );

  const subtotal =
    baseQuantity *
    Number(product.pricePerBaseUnit);

  const order = await prisma.order.create({
    data: {
      userId: (session.user as any).id,

      totalAmount: subtotal,

      items: {
        create: [
          {
            productId: product.id,

            enteredUnit: unit,

            enteredUnitQuantity: quantity,

            baseQuantity,

            unitPrice: product.pricePerBaseUnit,

            subtotal,
          },
        ],
      },
    },
  });

  if (session.user.role === "ADMIN") {
    redirect("/admin/orders");
  } else {
    redirect("/");
  }
}