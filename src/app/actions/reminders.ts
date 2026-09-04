"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAllReminders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  // Fetch all pending reminders to display in category lists
  return prisma.reminder.findMany({
    where: {
      userId: session.user.id,
      status: { not: "done" }
    },
    orderBy: {
      dueAt: 'asc'
    }
  });
}

export async function getReminders(date: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  // date is YYYY-MM-DD
  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const reminders = await prisma.reminder.findMany({
    where: {
      userId: session.user.id,
      dueAt: {
        gte: startOfDay,
        lte: endOfDay,
      }
    },
    include: {
      subtasks: true,
    },
    orderBy: {
      dueAt: 'asc'
    }
  });

  return reminders;
}

export async function createReminder(title: string, dueAt: Date, recurrenceRule: string | null = null) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const reminder = await prisma.reminder.create({
    data: {
      userId: session.user.id,
      title,
      dueAt,
      recurrenceRule,
    }
  });

  return reminder;
}

export async function bumpReminder(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const reminder = await prisma.reminder.findUnique({ where: { id } });
  if (!reminder || reminder.userId !== session.user.id) throw new Error("Not found");

  const newDueAt = new Date(reminder.dueAt);
  newDueAt.setDate(newDueAt.getDate() + 1);

  return prisma.reminder.update({
    where: { id },
    data: { dueAt: newDueAt }
  });
}

export async function toggleReminderStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const reminder = await prisma.reminder.findUnique({ where: { id } });
  if (!reminder || reminder.userId !== session.user.id) throw new Error("Not found");

  const updated = await prisma.reminder.update({
    where: { id },
    data: { status }
  });

  // Handle recurrence spawning if marked done
  if (status === "done" && reminder.recurrenceRule && reminder.status !== "done") {
    const nextDueAt = new Date(reminder.dueAt);
    
    if (reminder.recurrenceRule === "daily") {
      nextDueAt.setDate(nextDueAt.getDate() + 1);
    } else if (reminder.recurrenceRule === "weekly") {
      nextDueAt.setDate(nextDueAt.getDate() + 7);
    } else if (reminder.recurrenceRule === "monthly") {
      nextDueAt.setMonth(nextDueAt.getMonth() + 1);
    }

    // Only create if it doesn't already exist for that specific date (basic dedup)
    // For MVP, we just create it.
    await prisma.reminder.create({
      data: {
        userId: session.user.id,
        title: reminder.title,
        description: reminder.description,
        dueAt: nextDueAt,
        recurrenceRule: reminder.recurrenceRule,
        status: "pending"
      }
    });
  }

  return updated;
}

export async function deleteReminder(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.reminder.delete({
    where: {
      id,
      userId: session.user.id,
    }
  });
}

export async function updateReminderDetails(id: string, data: { description?: string, category?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Validate ownership implicitly by including userId
  return prisma.reminder.update({
    where: { id, userId: session.user.id },
    data,
  });
}

export async function createSubtask(reminderId: string, title: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const reminder = await prisma.reminder.findUnique({ where: { id: reminderId } });
  if (!reminder || reminder.userId !== session.user.id) throw new Error("Not found");

  return prisma.subtask.create({
    data: {
      reminderId,
      title,
    }
  });
}

export async function toggleSubtask(id: string, isDone: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const subtask = await prisma.subtask.findUnique({ where: { id }, include: { reminder: true } });
  if (!subtask || subtask.reminder.userId !== session.user.id) throw new Error("Not found");

  return prisma.subtask.update({
    where: { id },
    data: { isDone }
  });
}

export async function deleteSubtask(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const subtask = await prisma.subtask.findUnique({ where: { id }, include: { reminder: true } });
  if (!subtask || subtask.reminder.userId !== session.user.id) throw new Error("Not found");

  return prisma.subtask.delete({
    where: { id }
  });
}
