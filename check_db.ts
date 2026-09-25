import { prisma } from './src/lib/prisma';
async function check() {
  const users = await prisma.user.findMany({
    where: { email: { contains: 'loaf' } }
  });
  console.log(users.map(u => u.email));
}
check();
