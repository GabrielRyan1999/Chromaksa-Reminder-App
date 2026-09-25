const fs = require('fs');
let c = fs.readFileSync('src/app/actions/search.ts', 'utf8');
c = c.replace('import prisma from "@/lib/prisma";', 'import { prisma } from "@/lib/prisma";');
fs.writeFileSync('src/app/actions/search.ts', c);
