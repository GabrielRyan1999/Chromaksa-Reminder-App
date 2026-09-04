const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  });

  if (!user) {
    console.error("Test user not found. Please run node seed.js first.");
    return;
  }

  // Clear existing to avoid duplicates if run multiple times
  await prisma.reminder.deleteMany({
    where: { userId: user.id }
  });

  const categories = ['Work', 'Study', 'Errands', 'Household', 'Personal', 'Pets', 'Social', 'Hobby', 'Leisure', 'Travel'];
  
  const ideas = {
    'Work': ['Quarterly Review', 'Sync with team', 'Draft proposal', 'Reply to urgent emails'],
    'Study': ['Read Chapter 4', 'Finish assignment', 'Watch lecture', 'Review flashcards'],
    'Errands': ['Grocery shopping', 'Pick up dry cleaning', 'Post office dropoff'],
    'Household': ['Do laundry', 'Clean the kitchen', 'Take out trash', 'Fix leaky faucet'],
    'Personal': ['Meditate', 'Journaling', 'Plan next week'],
    'Pets': ['Buy dog food', 'Vet appointment', 'Long walk in the park'],
    'Social': ['Dinner with friends', 'Call parents', 'Birthday party'],
    'Hobby': ['Painting session', 'Practice guitar', 'Work on side project'],
    'Leisure': ['Movie night', 'Play video games', 'Read fiction book'],
    'Travel': ['Book flights', 'Pack bags', 'Renew passport']
  };

  const reminders = [];
  
  // Seed around 60 reminders spanning Sept and Oct 2026
  for (let i = 0; i < 80; i++) {
    // Random day between Sept 1 and Oct 31 (61 days)
    const randomDayOffset = Math.floor(Math.random() * 61); 
    const date = new Date(2026, 8, 1); // Sept 1, 2026 (Month is 0-indexed: 8 = Sept)
    date.setDate(date.getDate() + randomDayOffset);
    
    // Random hour between 8:00 and 18:00
    date.setHours(Math.floor(Math.random() * 11) + 8, Math.random() > 0.5 ? 30 : 0, 0, 0); 

    const category = categories[Math.floor(Math.random() * categories.length)];
    const titleOpts = ideas[category];
    const title = titleOpts[Math.floor(Math.random() * titleOpts.length)];

    reminders.push({
      userId: user.id,
      title: title,
      category: category,
      dueAt: date,
      status: Math.random() > 0.8 ? 'done' : 'pending' // 20% already completed
    });
  }

  await prisma.reminder.createMany({
    data: reminders
  });

  console.log(`Seeded ${reminders.length} reminders for Sept & Oct!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
