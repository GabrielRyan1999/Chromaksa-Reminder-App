const fs = require('fs');
let c = fs.readFileSync('src/components/GlobalSearch.tsx', 'utf8');

const newButton = `  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-20 md:right-24 z-50 h-10 px-3 md:px-4 rounded-full bg-black/5 dark:bg-white/5 text-[var(--color-foreground)] flex items-center justify-center gap-2 shadow-sm border border-[var(--color-brand-graphite)] border-opacity-20 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]"
        aria-label="Search (Ctrl+K)"
        title="Search (Ctrl+K)"
      >
        <Search className="w-4 h-4" />
        <div className="hidden md:flex items-center gap-1 text-[10px] font-medium text-[var(--color-brand-graphite)]">
          <kbd className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">Ctrl</kbd>
          <span>K</span>
        </div>
      </button>
    );
  }`;

const oldButton = `  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-20 md:right-24 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 text-[var(--color-foreground)] flex items-center justify-center shadow-sm border border-[var(--color-brand-graphite)] border-opacity-20 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }`;

c = c.replace(newButton, oldButton);
fs.writeFileSync('src/components/GlobalSearch.tsx', c);
