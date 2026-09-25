const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

c = c.replace('import { useEffect, useState } from "react";', 'import { useEffect, useState, createContext, useContext, forwardRef } from "react";');

const contextDef = `
const RemindersContext = createContext<Record<string, any[]>>({});

const CustomDayButton = forwardRef<HTMLButtonElement, any>((props, ref) => {
  const { day, children, ...buttonProps } = props;
  const remindersByDate = useContext(RemindersContext);
  const dateKey = format(day.date, "yyyy-MM-dd");
  const dayReminders = remindersByDate[dateKey] || [];
  // Max 3 dots so it doesn't overflow
  const uniqueCategories = Array.from(new Set(dayReminders.map((r: any) => String(r.category || "Uncategorized")))).slice(0, 3) as string[];

  return (
    <button ref={ref} {...buttonProps} className={\`\${buttonProps.className} relative flex flex-col items-center justify-center\`}>
      <span className="relative z-10">{children}</span>
      {uniqueCategories.length > 0 && (
        <div className="absolute bottom-[2px] left-0 right-0 flex justify-center space-x-0.5 pointer-events-none">
          {uniqueCategories.map((cat: string, i) => (
            <div 
              key={i} 
              className={\`w-1 h-1 rounded-full ring-[1px] ring-[var(--color-background)] \${CATEGORY_COLORS[cat] || "bg-gray-400"}\`} 
            />
          ))}
        </div>
      )}
    </button>
  );
});
CustomDayButton.displayName = "CustomDayButton";

interface SidebarProps {`;

c = c.replace('interface SidebarProps {', contextDef);

// Now remove the inline CustomDayButton
const searchInlineButton = `  const CustomDayButton = (props: any) => {
    const { day, children, ...buttonProps } = props;
    const dateKey = format(day.date, "yyyy-MM-dd");
    const dayReminders = remindersByDate[dateKey] || [];
    // Max 3 dots so it doesn't overflow
    const uniqueCategories = Array.from(new Set(dayReminders.map((r: any) => String(r.category || "Uncategorized")))).slice(0, 3) as string[];

    return (
      <button {...buttonProps} className={\`\${buttonProps.className} relative flex flex-col items-center justify-center\`}>
        <span className="relative z-10">{children}</span>
        {uniqueCategories.length > 0 && (
          <div className="absolute bottom-[2px] left-0 right-0 flex justify-center space-x-0.5 pointer-events-none">
            {uniqueCategories.map((cat: string, i) => (
              <div 
                key={i} 
                className={\`w-1 h-1 rounded-full ring-[1px] ring-[var(--color-background)] \${CATEGORY_COLORS[cat] || "bg-gray-400"}\`} 
              />
            ))}
          </div>
        )}
      </button>
    );
  };`;

c = c.replace(searchInlineButton, '');

// Wrap DayPicker with Provider
const searchDayPicker = `<DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          className="mx-auto"
          showOutsideDays
          components={{ DayButton: CustomDayButton }}
        />`;

const replaceDayPicker = `<RemindersContext.Provider value={remindersByDate}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onSelectDate(date)}
            className="mx-auto"
            showOutsideDays
            components={{ DayButton: CustomDayButton }}
          />
        </RemindersContext.Provider>`;

c = c.replace(searchDayPicker, replaceDayPicker);

// Fix the Sidebar mobile width problem
c = c.replace('aside className="w-[340px] shrink-0', 'aside className="w-[85vw] max-w-[340px] shrink-0');

fs.writeFileSync('src/components/Sidebar.tsx', c);
