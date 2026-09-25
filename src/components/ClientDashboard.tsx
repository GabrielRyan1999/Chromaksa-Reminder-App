"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import Sidebar from "./Sidebar";
import DayView from "./DayView";
import UserMenu from "./UserMenu";
import GlobalSearch from "./GlobalSearch";
import ShortcutHelper from "./ShortcutHelper";

export default function ClientDashboard({ user, initialAllReminders, initialTodayReminders }: { user: any, initialAllReminders?: any[], initialTodayReminders?: any[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      // Ctrl+K is handled in GlobalSearch, N is handled in ReminderList
      if (isInput) return;

      if (e.key === 't' || e.key === 'T') {
        setSelectedDate(new Date());
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        const editor = document.querySelector('.ProseMirror');
        if (editor) {
          (editor as HTMLElement).focus();
        }
      } else if (e.key === 'D' && e.shiftKey) {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resolvedTheme, setTheme]);

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless sidebarOpen is true */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSidebarOpen(false); }} initialReminders={initialAllReminders} />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 w-full">
        <DayView selectedDate={selectedDate} user={user} onMenuClick={() => setSidebarOpen(true)} />
      </div>
      <GlobalSearch onSelectDate={(d) => { setSelectedDate(d); setSidebarOpen(false); }} />
      <ShortcutHelper />
      <UserMenu user={user} />
    </div>
  );
}

