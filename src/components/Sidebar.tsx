"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllReminders } from "@/app/actions/reminders";
import { CATEGORY_COLORS } from "@/lib/constants";

interface SidebarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function Sidebar({ selectedDate, onSelectDate }: SidebarProps) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Basic polling or refresh could be added, but fetch once on mount for MVP
    getAllReminders().then(setReminders).catch(console.error);
    
    // Listen to custom event to refresh categories when a new reminder is added
    const handleRefresh = () => getAllReminders().then(setReminders).catch(console.error);
    window.addEventListener("refresh-categories", handleRefresh);
    return () => window.removeEventListener("refresh-categories", handleRefresh);
  }, []);

  // Group by category for the sidebar list
  const categories = reminders.reduce((acc, rem) => {
    const cat = rem.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rem);
    return acc;
  }, {} as Record<string, any[]>);

  // Group by date for the calendar dots
  const remindersByDate = reminders.reduce((acc, rem) => {
    const dateKey = format(new Date(rem.dueAt), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(rem);
    return acc;
  }, {} as Record<string, any[]>);

  const CustomDayButton = (props: any) => {
    const { day, children, ...buttonProps } = props;
    const dateKey = format(day.date, "yyyy-MM-dd");
    const dayReminders = remindersByDate[dateKey] || [];
    // Max 3 dots so it doesn't overflow
    const uniqueCategories = Array.from(new Set(dayReminders.map((r: any) => String(r.category || "Uncategorized")))).slice(0, 3) as string[];

    return (
      <button {...buttonProps} className={`${buttonProps.className} relative flex flex-col items-center justify-center`}>
        <span className="relative z-10">{children}</span>
        {uniqueCategories.length > 0 && (
          <div className="absolute bottom-[2px] left-0 right-0 flex justify-center space-x-0.5 pointer-events-none">
            {uniqueCategories.map((cat: string, i) => (
              <div 
                key={i} 
                className={`w-1 h-1 rounded-full ring-[1px] ring-[var(--color-background)] ${CATEGORY_COLORS[cat] || "bg-gray-400"}`} 
              />
            ))}
          </div>
        )}
      </button>
    );
  };

  return (
    <aside className="w-[340px] shrink-0 border-r border-[var(--color-brand-graphite)] border-opacity-20 flex flex-col h-full bg-[var(--color-background)]">
      <div className="p-5 border-b border-[var(--color-brand-graphite)] border-opacity-20 flex items-center justify-between">
        <h1 className="font-serif font-bold text-xl">Reminder App</h1>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        <style>{`
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
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          className="mx-auto"
          showOutsideDays
          components={{ DayButton: CustomDayButton }}
        />

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
                      <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat] || "bg-gray-400"}`}></span>
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
