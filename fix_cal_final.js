const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const anchor = '  // Group by date for the calendar dots';
const anchorIdx = c.indexOf(anchor);

const correctBottom = `
  // Group by date for the calendar dots
  const remindersByDate = reminders.reduce((acc, rem) => {
    const dateKey = format(new Date(rem.dueAt), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(rem);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <aside className="w-[85vw] max-w-[340px] shrink-0 border-r border-[var(--color-brand-graphite)] border-opacity-20 flex flex-col h-full bg-[var(--color-background)]">
      <div className="p-5 border-b border-[var(--color-brand-graphite)] border-opacity-20 flex items-center">
        <Image src="/logo.png" alt="Reminder App Logo" width={32} height={32} className="object-contain mr-3" />
        <h1 className="font-serif font-bold text-xl">Reminder App</h1>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        <style>{\`
          .rdp-root {
            --rdp-day-height: 38px;
            --rdp-day_button-width: 38px;
            --rdp-accent-color: var(--color-foreground);
            --rdp-today-color: var(--color-brand-amber);
            --rdp-selected-border: none;
            margin: 0 auto;
          }
          .rdp-selected .rdp-day_button {
            background-color: var(--color-foreground) !important;
            color: var(--color-background) !important;
            border-radius: 10px;
          }
          .rdp-today .rdp-day_button {
            font-weight: 800;
          }
          .rdp-today.rdp-selected .rdp-day_button {
            background-color: var(--color-foreground) !important;
            color: var(--color-brand-amber) !important;
          }
        \`}</style>
        <RemindersContext.Provider value={remindersByDate}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onSelectDate(date)}
            className="mx-auto"
            showOutsideDays
            components={{ DayButton: CustomDayButton }}
          />
        </RemindersContext.Provider>

        <div className="mt-8 px-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-graphite)] mb-4">Categories</h3>
          <ul className="space-y-3">
            {Object.entries(categories).map(([cat, items]) => {
              const categoryItems = items as any[];
              return (
                <li key={cat}>
                  <button 
                    onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                    className="w-full flex items-center justify-between text-sm text-[var(--color-foreground)] hover:opacity-70 transition-opacity"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={\`w-3 h-3 rounded-full \${CATEGORY_COLORS[cat] || "bg-gray-400"}\`}></span>
                      <span className="font-medium">{cat}</span>
                    </div>
                    <span className="text-[var(--color-brand-graphite)] text-xs">{categoryItems.length}</span>
                  </button>
                  
                  {expandedCategory === cat && (
                    <ul className="mt-2 ml-6 space-y-2 border-l-2 border-[var(--color-brand-graphite)] border-opacity-20 pl-4 py-1">
                      {categoryItems.map((rem: any) => (
                        <li key={rem.id}>
                          <button 
                            onClick={() => onSelectDate(new Date(rem.dueAt))}
                            className="flex flex-col text-left group w-full"
                          >
                            <span className="text-xs text-[var(--color-foreground)] group-hover:text-[var(--color-brand-amber)] transition-colors truncate w-full">
                              {rem.title}
                            </span>
                            <span className="text-[10px] text-[var(--color-brand-graphite)] flex items-center mt-0.5">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {format(new Date(rem.dueAt), "MMM d")}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-[var(--color-brand-graphite)] border-opacity-20 bg-black/5 dark:bg-white/5 text-center mt-auto">
        <p className="text-xs text-[var(--color-brand-graphite)]">
          A product by{" "}
          <a 
            href="https://www.instagram.com/chromaksa.studio/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[var(--color-foreground)] transition-colors underline underline-offset-4 decoration-[var(--color-brand-graphite)] hover:decoration-[var(--color-foreground)] font-medium"
          >
            Chromaksa Studio
          </a>
        </p>
      </div>
    </aside>
  );
}
`;

c = c.substring(0, anchorIdx) + correctBottom;
fs.writeFileSync('src/components/Sidebar.tsx', c);
