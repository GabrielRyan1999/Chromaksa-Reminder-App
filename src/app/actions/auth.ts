"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(name: string, email: string, password: string) {
  try {
    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email is already registered. Please log in." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to register:", error);
    return { error: "An internal server error occurred. Please try again later." };
  }
}
