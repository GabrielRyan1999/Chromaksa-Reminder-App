"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function searchContent(query: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const q = query.trim().toLowerCase();
  
  if (!q) return { notes: [], reminders: [] };

  // Search Notes
  const notes = await prisma.note.findMany({
    where: {
      userId,
      content: {
        contains: q,
        mode: 'insensitive',
      }
    },
    select: {
      id: true,
      date: true,
      content: true,
    },
    take: 10,
  });

  // Search Reminders (matching title, description, or subtasks)
  const reminders = await prisma.reminder.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { subtasks: { some: { title: { contains: q, mode: 'insensitive' } } } }
      ]
    },
    select: {
      id: true,
      title: true,
      description: true,
      dueAt: true,
      category: true,
      status: true,
      subtasks: {
        where: { title: { contains: q, mode: 'insensitive' } }
      }
    },
    orderBy: { dueAt: 'desc' },
    take: 15,
  });

  return { notes, reminders };
}
