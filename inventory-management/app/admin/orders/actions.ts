"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export async function approveOrder(orderId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "APPROVED",
    },
  });

  revalidatePath("/admin/orders");
}