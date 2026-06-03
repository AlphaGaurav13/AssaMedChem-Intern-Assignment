"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    redirect("/signup?error=MissingFields");
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    redirect("/signup?error=EmailExists");
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "USER", // Default role for registering users
      },
    });
  } catch (err) {
    redirect("/signup?error=ServerError");
  }

  // Redirect to login page on success with a status parameter
  redirect("/login?success=registered");
}
