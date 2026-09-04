const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  });

  if (!user) {
    console.error("Test user not found.");
    return;
  }

  // Clear existing
  await prisma.reminder.deleteMany({ where: { userId: user.id } });
  await prisma.subtask.deleteMany();
  await prisma.note.deleteMany({ where: { userId: user.id } });

  const categories = ['Work', 'Study', 'Errands', 'Household', 'Personal', 'Pets', 'Social', 'Hobby', 'Leisure', 'Travel'];
  
  const ideas = {
    'Work': { title: 'Quarterly Review', subtasks: ['Prepare slides', 'Gather metrics', 'Email boss'], note: 'Make sure to highlight Q3 growth.' },
    'Study': { title: 'Read Chapter 4', subtasks: ['Read pages 40-60', 'Take notes', 'Do practice questions'], note: 'Focus on the thermodynamics section.' },
    'Errands': { title: 'Grocery shopping', subtasks: ['Milk', 'Eggs', 'Bread', 'Coffee'], note: 'Go to the store on 5th Ave.' },
    'Household': { title: 'Clean the kitchen', subtasks: ['Wipe counters', 'Load dishwasher', 'Take out trash'], note: 'Use the new lemon spray.' },
    'Personal': { title: 'Plan next week', subtasks: ['Check calendar', 'Set 3 main goals', 'Block deep work time'], note: 'Try to keep Friday afternoon free.' },
    'Pets': { title: 'Vet appointment', subtasks: ['Find vaccine records', 'Bring treats', 'Ask about diet'], note: 'Appointment is with Dr. Smith.' },
    'Social': { title: 'Dinner with friends', subtasks: ['Book table', 'Confirm headcount', 'Check for allergies'], note: 'Meeting at the Italian place downtown.' },
    'Hobby': { title: 'Practice guitar', subtasks: ['Tune guitar', 'Warm up scales', 'Learn new song chorus'], note: 'Focus on fingerpicking technique today.' },
    'Leisure': { title: 'Movie night', subtasks: ['Pick a movie', 'Make popcorn', 'Dim lights'], note: 'Watching that new sci-fi thriller.' },
    'Travel': { title: 'Pack bags', subtasks: ['Clothes', 'Toiletries', 'Chargers', 'Passport'], note: 'Remember to pack the universal adapter.' }
  };

  const datesWithNotes = new Set();

  // Seed 60 reminders spanning Sept and Oct 2026
  for (let i = 0; i < 60; i++) {
    const randomDayOffset = Math.floor(Math.random() * 61); 
    const date = new Date(2026, 8, 1); 
    date.setDate(date.getDate() + randomDayOffset);
    date.setHours(Math.floor(Math.random() * 11) + 8, Math.random() > 0.5 ? 30 : 0, 0, 0); 

    const category = categories[Math.floor(Math.random() * categories.length)];
    const idea = ideas[category];

    // Create Reminder
    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        title: idea.title,
        category: category,
        description: idea.note,
        dueAt: date,
        status: Math.random() > 0.8 ? 'done' : 'pending',
      }
    });

    // Create Subtasks
    for (const subTitle of idea.subtasks) {
      await prisma.subtask.create({
        data: {
          reminderId: reminder.id,
          title: subTitle,
          isDone: Math.random() > 0.5
        }
      });
    }

    // Mark this date for daily notes
    const dateKey = date.toISOString().split('T')[0];
    datesWithNotes.add(dateKey);
  }

  // Create Daily Notes for the dates that have reminders
  for (const dateKey of datesWithNotes) {
    const tiptapJson = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: `Journal for ${dateKey}` }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'This is an auto-generated daily note. I had a really productive day today!' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Some key takeaways:' }] },
        { type: 'bulletList', content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Stayed hydrated' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Finished most of my tasks' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Felt great overall' }] }] }
          ] 
        }
      ]
    };

    await prisma.note.create({
      data: {
        userId: user.id,
        date: dateKey,
        content: JSON.stringify(tiptapJson)
      }
    });
  }

  console.log(`Seeded fully! Created reminders, subtasks, and ${datesWithNotes.size} daily notes.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
