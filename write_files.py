with open('src/lib/prisma.ts', 'w') as f:
    f.write('''import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
''')

with open('src/lib/qstash.ts', 'w') as f:
    f.write('''import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN || '',
});

export async function scheduleReminder(reminderId: string, dueAt: Date) {
  if (!process.env.QSTASH_TOKEN) return null;
  
  // Calculate delay in seconds. If due in the past, send immediately (or skip).
  const notBefore = Math.max(Math.floor(dueAt.getTime() / 1000), Math.floor(Date.now() / 1000) + 1);

  try {
    const res = await qstash.publishJSON({
      url: "https://reminder-app-chromaksa.vercel.app/api/webhooks/qstash",
      body: { reminderId },
      notBefore,
    });
    return res.messageId;
  } catch (error) {
    console.error("Failed to schedule QStash message:", error);
    return null;
  }
}

export async function cancelReminder(messageId: string | null) {
  if (!process.env.QSTASH_TOKEN || !messageId) return;
  try {
    await qstash.messages.delete(messageId);
  } catch (error) {
    console.error("Failed to cancel QStash message:", error);
  }
}
''')
