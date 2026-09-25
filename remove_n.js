const fs = require('fs');
let c = fs.readFileSync('src/components/ReminderList.tsx', 'utf8');

c = c.replace('+ Add reminder <span className="hidden md:inline-block text-xs bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded ml-2 opacity-50">N</span>', '+ Add reminder');

fs.writeFileSync('src/components/ReminderList.tsx', c);
