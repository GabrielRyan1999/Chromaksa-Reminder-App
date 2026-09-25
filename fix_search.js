const fs = require('fs');
let c = fs.readFileSync('src/app/actions/search.ts', 'utf8');
c = c.replace('@/lib/db', '@/lib/prisma');
fs.writeFileSync('src/app/actions/search.ts', c);
