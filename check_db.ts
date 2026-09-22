import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const latest = await prisma.reminder.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  console.log(latest.map(r => r.title + ' | ' + r.category + ' | ' + r.createdAt));
}
check().finally(() => prisma.$disconnect());
