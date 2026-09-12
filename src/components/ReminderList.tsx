"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getReminders, createReminder, toggleReminderStatus, deleteReminder, bumpReminder } from "@/app/actions/reminders";
import ReminderCard from "./ReminderCard";
import { TimePicker } from "@/components/ui/time-picker";

interface ReminderListProps {
  selectedDate: Date;
}

export default function ReminderList({ selectedDate }: ReminderListProps) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [time, setTime] = useState("09:00 AM");
  const [recurrence, setRecurrence] = useState("none");
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        (e.target as HTMLElement).isContentEditable ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsAdding(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    async function fetchReminders() {
      setLoading(true);
      try {
        const data = await getReminders(dateKey);
        setReminders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReminders();
  }, [dateKey]);

  async function handleToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === "done" ? "pending" : "done";
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    await toggleReminderStatus(id, newStatus);
    window.dispatchEvent(new Event("refresh-categories"));
  }

  async function handleDelete(id: string) {
    setReminders(prev => prev.filter(r => r.id !== id));
    await deleteReminder(id);
    window.dispatchEvent(new Event("refresh-categories"));
  }

  async function handleBumpToTomorrow(id: string) {
    setReminders(prev => prev.filter(r => r.id !== id));
    await bumpReminder(id);
    window.dispatchEvent(new Event("refresh-categories"));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    let hours = 9;
    let minutes = 0;
    
    if (time.includes("AM") || time.includes("PM")) {
      const [hm, ap] = time.split(" ");
      const [hStr, mStr] = hm.split(":");
      hours = parseInt(hStr, 10);
      minutes = parseInt(mStr, 10);
      if (ap === "PM" && hours < 12) hours += 12;
      if (ap === "AM" && hours === 12) hours = 0;
    } else {
      const [hStr, mStr] = (time || "09:00").split(':');
      hours = parseInt(hStr, 10) || 9;
      minutes = parseInt(mStr, 10) || 0;
    }
    
    const dueAt = new Date(selectedDate);
    dueAt.setHours(hours, minutes, 0, 0);

    const tempId = Math.random().toString();
    const newReminder = {
      id: tempId,
      title: newTaskTitle,
      status: "pending",
      dueAt,
      recurrenceRule: recurrence === "none" ? null : recurrence,
    };
    
    setReminders([...reminders, newReminder]);
    setNewTaskTitle("");
    setIsAdding(false);

    try {
      const created = await createReminder(newTaskTitle, dueAt, newReminder.recurrenceRule);
      setReminders(prev => prev.map(r => r.id === tempId ? created : r));
      window.dispatchEvent(new Event("refresh-categories"));
    } catch (e) {
      console.error(e);
      setReminders(prev => prev.filter(r => r.id !== tempId));
    }
  }

  if (loading) return <div className="text-sm text-[var(--color-brand-graphite)] animate-pulse">Loading reminders...</div>;

  return (
    <div>
      {reminders.length === 0 ? (
        <p className="text-sm text-[var(--color-brand-graphite)] italic mb-4">No reminders for this day. Add one below.</p>
      ) : (
        <div className="mb-4">
          {reminders.map(reminder => (
            <ReminderCard 
              key={reminder.id} 
              reminder={reminder} 
              onRemove={handleDelete} 
              onBump={handleBumpToTomorrow} 
              onToggle={handleToggle} 
            />
          ))}
        </div>
      )}
      
      {isAdding ? (
        <form onSubmit={handleAdd} className="mt-4 p-4 border border-[var(--color-brand-graphite)] border-opacity-20 rounded shadow-sm bg-[var(--color-background)]">
          <input 
            type="text" 
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full bg-black/5 dark:bg-white/5 rounded px-3 py-2 text-sm text-[var(--color-foreground)] border-none focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none mb-3"
          />
          <div className="flex items-center gap-3 mb-4">
            <TimePicker 
              value={time} 
              onChange={setTime} 
              showCurrentTimeButton={false} 
            />
            <select 
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="bg-black/5 dark:bg-white/5 rounded px-2 py-2 h-9 text-xs text-[var(--color-foreground)] border border-[var(--color-brand-graphite)] border-opacity-20 outline-none focus:ring-1 focus:ring-[var(--color-brand-amber)] [&>option]:bg-white [&>option]:text-black dark:[&>option]:bg-[#1a1a1a] dark:[&>option]:text-white cursor-pointer"
            >
              <option value="none">One-off</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="submit"
              className="px-4 py-1.5 text-sm bg-[var(--color-foreground)] text-[var(--color-background)] rounded hover:opacity-90 font-medium transition-opacity"
            >
              Add
            </button>
            <button 
              type="button"
              onClick={() => { setIsAdding(false); setNewTaskTitle(""); }}
              className="px-3 py-1.5 text-sm text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] text-sm mt-2 transition-colors flex items-center font-medium"
        >
          + Add reminder
        </button>
      )}
    </div>
  );
}
