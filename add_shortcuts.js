const fs = require('fs');
let c = fs.readFileSync('src/components/ClientDashboard.tsx', 'utf8');

c = c.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";\nimport { useTheme } from "next-themes";');

const oldComponentStart = 'export default function ClientDashboard({ user, initialAllReminders, initialTodayReminders }: { user: any, initialAllReminders?: any[], initialTodayReminders?: any[] }) {\n  const [selectedDate, setSelectedDate] = useState<Date>(new Date());\n  const [sidebarOpen, setSidebarOpen] = useState(false);';

const newComponentStart = `export default function ClientDashboard({ user, initialAllReminders, initialTodayReminders }: { user: any, initialAllReminders?: any[], initialTodayReminders?: any[] }) {
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
  }, [resolvedTheme, setTheme]);`;

c = c.replace(oldComponentStart, newComponentStart);
fs.writeFileSync('src/components/ClientDashboard.tsx', c);
console.log("Success");
