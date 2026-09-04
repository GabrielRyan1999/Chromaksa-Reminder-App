"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getNote(date: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const note = await prisma.note.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date,
      }
    }
  });

  if (note && note.content) {
    try {
      (note as any).content = JSON.parse(note.content);
    } catch (e) {
      console.error("Failed to parse note content", e);
    }
  }

  return note;
}

export async function saveNote(date: string, content: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const stringifiedContent = typeof content === 'string' ? content : JSON.stringify(content);

  const note = await prisma.note.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date,
      }
    },
    update: {
      content: stringifiedContent,
    },
    create: {
      userId: session.user.id,
      date,
      content: stringifiedContent,
    }
  });

  return note;
}
