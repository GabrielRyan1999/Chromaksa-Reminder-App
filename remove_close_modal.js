const fs = require('fs');
let c = fs.readFileSync('src/components/ShortcutHelper.tsx', 'utf8');

const closeItem = `            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Close Modals</span>
              <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">Esc</kbd>
            </li>`;

c = c.replace(closeItem, '');
fs.writeFileSync('src/components/ShortcutHelper.tsx', c);
