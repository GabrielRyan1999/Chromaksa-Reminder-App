import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'ryangabriel1999@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('User not found!');
    return;
  }

  console.log('Seeding for user:', user.name);

  // Clear existing reminders (optional, but good for a clean screenshot)
  // Let's not clear them just in case they have real stuff, just add a bunch of nice looking ones.
  // Actually, wait, maybe just add them.

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const mockData = [
    {
      title: 'Weekly Sync with Product Team',
      description: 'Discuss Q4 roadmap and Web Push Notification metrics.',
      dateOffset: 0, // today
      time: '10:00',
      category: 'Work',
      status: 'pending',
      subtasks: ['Review analytics dashboard', 'Prepare slide deck']
    },
    {
      title: 'Lunch with Sarah',
      description: 'At the new Italian place downtown.',
      dateOffset: 0, // today
      time: '12:30',
      category: 'Social',
      status: 'done',
      subtasks: []
    },
    {
      title: 'Buy Groceries',
      description: 'Milk, eggs, bread, coffee beans, and some snacks for the weekend.',
      dateOffset: 0, // today
      time: '18:00',
      category: 'Household',
      status: 'pending',
      subtasks: ['Stop by the ATM first']
    },
    {
      title: 'Finish Next.js Landing Page',
      description: 'Add the new features grid and center the text.',
      dateOffset: -1, // yesterday
      time: '14:00',
      category: 'Work',
      status: 'done',
      subtasks: ['Fix dark mode bugs', 'Update screenshot']
    },
    {
      title: 'Gym Session: Upper Body',
      description: 'Bench press, pull-ups, and 15 min cardio.',
      dateOffset: 1, // tomorrow
      time: '07:30',
      category: 'Personal',
      status: 'pending',
      subtasks: []
    },
    {
      title: 'Pay Electricity Bill',
      description: 'Check the meter and pay via banking app.',
      dateOffset: 2, // day after tomorrow
      time: '09:00',
      category: 'Errands',
      status: 'pending',
      subtasks: []
    },
    {
      title: 'Project Deadline: Alpha Release',
      description: 'Final testing before deploying to production.',
      dateOffset: 3,
      time: '15:00',
      category: 'Work',
      status: 'pending',
      subtasks: ['Run e2e tests', 'Check Vercel logs', 'Notify stakeholders']
    },
    {
      title: 'Read "Atomic Habits"',
      description: 'Read Chapter 4 and 5.',
      dateOffset: -2,
      time: '20:00',
      category: 'Leisure',
      status: 'done',
      subtasks: []
    },
    {
      title: 'Dentist Appointment',
      description: 'Routine checkup and cleaning.',
      dateOffset: 5,
      time: '11:00',
      category: 'Personal',
      status: 'pending',
      subtasks: []
    }
  ];

  for (const item of mockData) {
    const d = new Date(year, month, now.getDate() + item.dateOffset);
    const [hours, minutes] = item.time.split(':');
    d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        title: item.title,
        description: item.description,
        category: item.category,
        status: item.status,
        dueAt: d,
        notifyDesktop: true,
        notifyEmail: true,
      }
    });

    for (const sub of item.subtasks) {
      await prisma.subtask.create({
        data: {
          reminderId: reminder.id,
          title: sub,
          isDone: item.status === 'done' ? true : false,
        }
      });
    }
  }

  console.log('Successfully seeded database for screenshot!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
