const fs = require('fs');
let c = fs.readFileSync('src/components/ShortcutHelper.tsx', 'utf8');

const regex = /<ul className="px-2 space-y-1 mb-1">[\s\S]*?<\/ul>/g;

const newUl = `<ul className="px-2 space-y-1 mb-1">
            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Global Search</span>
              <div className="flex items-center gap-1">
                <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">Ctrl</kbd>
                <span className="text-[10px] text-[var(--color-brand-graphite)]">+</span>
                <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">K</kbd>
              </div>
            </li>
            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Add Reminder</span>
              <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">N</kbd>
            </li>
            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Jump to Today</span>
              <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">T</kbd>
            </li>
            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Focus Journal</span>
              <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">J</kbd>
            </li>
            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Toggle Dark Mode</span>
              <div className="flex items-center gap-1">
                <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">Shift</kbd>
                <span className="text-[10px] text-[var(--color-brand-graphite)]">+</span>
                <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">D</kbd>
              </div>
            </li>
          </ul>`;

c = c.replace(regex, newUl);
fs.writeFileSync('src/components/ShortcutHelper.tsx', c);
console.log("Success");
