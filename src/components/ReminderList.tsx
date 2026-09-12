"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getReminders, createReminder, toggleReminderStatus, deleteReminder, bumpReminder } from "@/app/actions/reminders";
import ReminderCard from "./ReminderCard";
import { TimePicker } from "@/components/ui/time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReminderListProps {
  selectedDate: Date;
}

const remindersCache: Record<string, any[]> = {};

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
      // Use cache for instant UI if available
      if (remindersCache[dateKey]) {
        setReminders(remindersCache[dateKey]);
        setLoading(false);
      } else {
        setReminders([]); // Clear immediately when switching to uncached date
        setLoading(true);
      }

      try {
        const data = await getReminders(dateKey);
        remindersCache[dateKey] = data;
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
    setReminders(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: newStatus } : r);
      remindersCache[dateKey] = updated;
      return updated;
    });
    await toggleReminderStatus(id, newStatus);
    window.dispatchEvent(new Event("refresh-categories"));
  }

  async function handleDelete(id: string) {
    setReminders(prev => {
      const updated = prev.filter(r => r.id !== id);
      remindersCache[dateKey] = updated;
      return updated;
    });
    await deleteReminder(id);
    window.dispatchEvent(new Event("refresh-categories"));
  }

  async function handleBumpToTomorrow(id: string) {
    setReminders(prev => {
      const updated = prev.filter(r => r.id !== id);
      remindersCache[dateKey] = updated;
      return updated;
    });
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
    
    setReminders(prev => {
      const updated = [...prev, newReminder];
      remindersCache[dateKey] = updated;
      return updated;
    });
    setNewTaskTitle("");
    setIsAdding(false);

    try {
      const created = await createReminder(newTaskTitle, dueAt, newReminder.recurrenceRule);
      setReminders(prev => {
        const updated = prev.map(r => r.id === tempId ? created : r);
        remindersCache[dateKey] = updated;
        return updated;
      });
      window.dispatchEvent(new Event("refresh-categories"));
    } catch (e) {
      console.error(e);
      setReminders(prev => {
        const updated = prev.filter(r => r.id !== tempId);
        remindersCache[dateKey] = updated;
        return updated;
      });
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
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <TimePicker 
              value={time} 
              onChange={setTime} 
              showCurrentTimeButton={false} 
            />
            <div className="w-[120px]">
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Recurrence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One-off</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
