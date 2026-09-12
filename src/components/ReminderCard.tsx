"use client";

import { useState } from "react";
import { Check, Trash2, ArrowRight, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { toggleReminderStatus, deleteReminder, bumpReminder, updateReminderDetails, createSubtask, toggleSubtask, deleteSubtask } from "@/app/actions/reminders";

export default function ReminderCard({ reminder, onRemove, onBump, onToggle }: any) {
  const [expanded, setExpanded] = useState(false);
  
  // Local state for edits
  const [category, setCategory] = useState(reminder.category || "");
  const [description, setDescription] = useState(reminder.description || "");
  const [subtasks, setSubtasks] = useState<any[]>(reminder.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);

  const timeString = new Date(reminder.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const recurrenceString = reminder.recurrenceRule ? reminder.recurrenceRule.charAt(0).toUpperCase() + reminder.recurrenceRule.slice(1) : "";

  async function handleSaveDetails() {
    setIsSaving(true);
    try {
      await updateReminderDetails(reminder.id, { category, description });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    const tempId = Math.random().toString();
    const subtask = { id: tempId, title: newSubtask, isDone: false };
    setSubtasks([...subtasks, subtask]);
    setNewSubtask("");

    try {
      const created = await createSubtask(reminder.id, subtask.title);
      setSubtasks(prev => prev.map(s => s.id === tempId ? created : s));
    } catch (e) {
      setSubtasks(prev => prev.filter(s => s.id !== tempId));
    }
  }

  async function handleToggleSubtask(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, isDone: newStatus } : s));
    await toggleSubtask(id, newStatus);
  }

  async function handleDeleteSubtask(id: string) {
    setSubtasks(prev => prev.filter(s => s.id !== id));
    await deleteSubtask(id);
  }

  return (
    <div className={`mb-3 border rounded-lg transition-all duration-300 ${
      reminder.status === 'done' 
        ? 'border-[var(--color-brand-sage)]/20 bg-[var(--color-brand-sage)]/5 opacity-50 grayscale-[50%]' 
        : 'border-[var(--color-brand-graphite)] border-opacity-20 bg-[var(--color-background)] hover:border-opacity-30 shadow-sm'
    }`}>
      
      {/* Collapsed Header */}
      <div 
        className="p-3 flex items-center justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggle(reminder.id, reminder.status); }}
            className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${
              reminder.status === "done" 
                ? "bg-[var(--color-brand-sage)] border-transparent text-white scale-95" 
                : "border border-[var(--color-brand-graphite)] border-opacity-40 hover:border-[var(--color-brand-amber)] hover:bg-[var(--color-brand-amber)]/5"
            }`}
          >
            {reminder.status === "done" && <Check className="w-3 h-3" />}
          </button>
          
          <div className="flex flex-col">
            <span className={`text-sm font-medium transition-all duration-300 ${
              reminder.status === "done" ? "text-[var(--color-brand-graphite)] line-through italic" : "text-[var(--color-foreground)]"
            }`}>
              {reminder.title}
            </span>
            <div className={`flex items-center text-[10px] mt-1 space-x-2 transition-all duration-300 ${
              reminder.status === "done" ? "text-[var(--color-brand-graphite)]/60" : "text-[var(--color-brand-graphite)]"
            }`}>
              <span>{timeString}{recurrenceString && ` • ${recurrenceString}`}</span>
              {category && (
                <>
                  <span>•</span>
                  <span className="uppercase tracking-wider">{category}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`flex items-center space-x-1 transition-opacity ${expanded || reminder.status === 'done' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); onBump(reminder.id); }}
            className="p-1.5 text-[var(--color-brand-graphite)] hover:text-[var(--color-brand-amber)] transition-colors"
            title="Bump to tomorrow"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(reminder.id); }}
            className="p-1.5 text-[var(--color-brand-graphite)] hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="px-1 text-[var(--color-brand-graphite)]">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="p-4 border-t border-[var(--color-brand-graphite)] border-opacity-10 bg-black/5 rounded-b-lg">
          
          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-wider text-[var(--color-brand-graphite)] font-bold mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                // Save immediately on change for select
                updateReminderDetails(reminder.id, { category: e.target.value, description })
                  .then(() => window.dispatchEvent(new Event("refresh-categories")))
                  .catch(console.error);
              }}
              className="w-full bg-transparent border-b border-[var(--color-brand-graphite)] border-opacity-20 py-1 text-sm text-[var(--color-foreground)] focus:border-[var(--color-brand-amber)] outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="">No Category</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Errands">Errands</option>
              <option value="Household">Household</option>
              <option value="Personal">Personal</option>
              <option value="Pets">Pets</option>
              <option value="Social">Social</option>
              <option value="Hobby">Hobby</option>
              <option value="Leisure">Leisure</option>
              <option value="Travel">Travel</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-wider text-[var(--color-brand-graphite)] font-bold mb-2">To Do List</label>
            
            <div className="space-y-1 mb-2">
              {subtasks.map(sub => (
                <div key={sub.id} className="flex items-center space-x-2 group/sub">
                  <input 
                    type="checkbox" 
                    checked={sub.isDone}
                    onChange={() => handleToggleSubtask(sub.id, sub.isDone)}
                    className="w-3.5 h-3.5 rounded-sm border-[var(--color-brand-graphite)] text-[var(--color-brand-amber)] focus:ring-0 cursor-pointer" 
                  />
                  <span className={`text-sm flex-1 ${sub.isDone ? "line-through text-[var(--color-brand-graphite)]" : "text-[var(--color-foreground)]"}`}>
                    {sub.title}
                  </span>
                  <button 
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="opacity-0 group-hover/sub:opacity-100 text-[var(--color-brand-graphite)] hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex items-center space-x-2">
              <Plus className="w-3.5 h-3.5 text-[var(--color-brand-graphite)]" />
              <input 
                type="text" 
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 bg-transparent text-sm text-[var(--color-foreground)] placeholder-[var(--color-brand-graphite)] border-none p-0 focus:ring-0 outline-none"
              />
            </form>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-wider text-[var(--color-brand-graphite)] font-bold mb-1">Notes</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDetails}
              placeholder="Add details about this reminder..."
              className="w-full bg-transparent border border-[var(--color-brand-graphite)] border-opacity-20 rounded p-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-brand-amber)] outline-none min-h-[80px] resize-y"
            />
          </div>

        </div>
      )}
    </div>
  );
}
