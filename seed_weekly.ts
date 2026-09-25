import { prisma } from './src/lib/prisma';
import { scheduleReminder } from './src/lib/qstash';

async function seed() {
  const ryan = await prisma.user.findUnique({ where: { email: 'ryangabriel1999@gmail.com' } });
  const loafty = await prisma.user.findUnique({ where: { email: 'loaftly@gmail.com' } });
  
  if (!ryan || !loafty) {
    console.error('Users not found!');
    return;
  }

  const testCases = [
    // RYAN'S REMINDERS
    {
      user: ryan,
      title: "Team Standup",
      description: "Daily sync with the development team.",
      daysOffset: 1, // Tomorrow
      hours: 10, minutes: 0,
      notifyBefore: 15,
      category: "Work"
    },
    {
      user: ryan,
      title: "Submit Weekly Report",
      description: "Send the progress report to the manager.",
      daysOffset: 2,
      hours: 16, minutes: 30,
      notifyBefore: 60,
      category: "Work"
    },
    {
      user: ryan,
      title: "Gym Session",
      description: "Leg day!",
      daysOffset: 0,
      hours: 18, minutes: 0, // Today evening
      notifyBefore: 30,
      category: "Personal"
    },
    // LOAFTY'S REMINDERS
    {
      user: loafty,
      title: "Client Meeting: Acme Corp",
      description: "Discuss the new project requirements.",
      daysOffset: 1,
      hours: 11, minutes: 0,
      notifyBefore: 30,
      category: "Work"
    },
    {
      user: loafty,
      title: "Pick up dry cleaning",
      description: "Don't forget the receipt.",
      daysOffset: 2,
      hours: 17, minutes: 30,
      notifyBefore: 15,
      category: "Errands"
    },
    {
      user: loafty,
      title: "Buy groceries",
      description: "Milk, eggs, and coffee beans.",
      daysOffset: 0,
      hours: 19, minutes: 0, // Today evening
      notifyBefore: 0,
      category: "Errands"
    }
  ];

  for (const tc of testCases) {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + tc.daysOffset);
    dueAt.setHours(tc.hours, tc.minutes, 0, 0);

    // If dueAt is in the past (e.g. it's already past 18:00 today), push to tomorrow
    if (dueAt.getTime() < Date.now()) {
      dueAt.setDate(dueAt.getDate() + 1);
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: tc.user.id,
        title: tc.title,
        description: tc.description,
        dueAt,
        category: tc.category,
        notifyEmail: true,
        notifyDesktop: true,
        notifyBeforeMinutes: tc.notifyBefore,
      }
    });

    const notifyAt = new Date(dueAt.getTime() - tc.notifyBefore * 60_000);
    const msgId = await scheduleReminder(reminder.id, notifyAt);
    
    if (msgId) {
      await prisma.reminder.update({ where: { id: reminder.id }, data: { qstashMessageId: msgId }});
      console.log('Seeded for', tc.user.email, ':', tc.title);
    } else {
      console.error('Failed to schedule in QStash for', tc.title);
    }
  }
}
seed().catch(console.error).finally(() => process.exit(0));
