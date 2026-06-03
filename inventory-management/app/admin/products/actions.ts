"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const dimension = formData.get("dimension") as string;
  const baseUnit = formData.get("baseUnit") as string;

  const inventoryQuantity = Number(
    formData.get("inventoryQuantity")
  );

  const pricePerBaseUnit = Number(
    formData.get("pricePerBaseUnit")
  );

  await prisma.product.create({
    data: {
      name,
      sku,
      dimension,
      baseUnit,
      inventoryQuantity,
      pricePerBaseUnit,
    },
  });

  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/products");
}