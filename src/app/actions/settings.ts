"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUserSettings() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, timezone: true, emailNotifications: true }
  });
}

export async function updateUserSettings(data: { name: string, timezone: string, emailNotifications?: boolean }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      timezone: data.timezone,
      ...(data.emailNotifications !== undefined && { emailNotifications: data.emailNotifications })
    }
  });
}
