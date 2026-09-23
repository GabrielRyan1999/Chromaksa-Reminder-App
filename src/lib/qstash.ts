import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN || '',
});

export async function scheduleReminder(reminderId: string, dueAt: Date) {
  if (!process.env.QSTASH_TOKEN) return null;
  
  // Calculate delay in seconds. If due in the past, send immediately (or skip).
  const notBefore = Math.max(Math.floor(dueAt.getTime() / 1000), Math.floor(Date.now() / 1000) + 1);

  try {
    const appUrl = process.env.APP_URL || "https://reminder-app-chromaksa.vercel.app";
    const res = await qstash.publishJSON({
      url: `${appUrl}/api/webhooks/qstash`,
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
