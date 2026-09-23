import { prisma } from './src/lib/prisma';
import { scheduleReminder } from './src/lib/qstash';

async function seed() {
  // Find users
  const ryan = await prisma.user.findUnique({ where: { email: 'ryangabriel1999@gmail.com' } });
  const loafty = await prisma.user.findUnique({ where: { email: 'loaftly@gmail.com' } });
  
  const dueAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

  if (ryan) {
    const reminder1 = await prisma.reminder.create({
      data: {
        userId: ryan.id,
        title: "QStash Neon Test Reminder for Ryan!",
        description: "This is an event-driven webhook notification test.",
        dueAt,
        notifyEmail: true,
      }
    });
    const msgId = await scheduleReminder(reminder1.id, dueAt);
    await prisma.reminder.update({ where: { id: reminder1.id }, data: { qstashMessageId: msgId }});
    console.log("Seeded for ryan, qstash id:", msgId);
  }

  if (loafty) {
    const reminder2 = await prisma.reminder.create({
      data: {
        userId: loafty.id,
        title: "QStash Neon Test Reminder for Loafty!",
        description: "This is an event-driven webhook notification test.",
        dueAt,
        notifyEmail: true,
      }
    });
    const msgId = await scheduleReminder(reminder2.id, dueAt);
    await prisma.reminder.update({ where: { id: reminder2.id }, data: { qstashMessageId: msgId }});
    console.log("Seeded for loafty, qstash id:", msgId);
  }
}
seed();
