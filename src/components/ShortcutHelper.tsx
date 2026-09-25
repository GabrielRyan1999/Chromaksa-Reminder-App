"use client";

import { useState, useRef, useEffect } from "react";
import { Keyboard } from "lucide-react";

export default function ShortcutHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 md:right-8 z-50" ref={menuRef}>
      {isOpen && (
        <div className="absolute bottom-12 right-0 mb-2 w-64 bg-[var(--color-background)] rounded-xl shadow-lg border border-[var(--color-brand-graphite)] border-opacity-20 py-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-4 py-2 border-b border-[var(--color-brand-graphite)] border-opacity-10 mb-2">
            <h4 className="text-sm font-bold text-[var(--color-foreground)]">Keyboard Shortcuts</h4>
          </div>
          <ul className="px-2 space-y-1 mb-1">
            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Global Search</span>
              <div className="flex items-center gap-1">
                <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">Ctrl</kbd>
                <span className="text-[10px] text-[var(--color-brand-graphite)]">+</span>
                <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">K</kbd>
              </div>
            </li>
            <li className="flex items-center justify-between px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
              <span className="text-xs text-[var(--color-brand-graphite)]">Add Reminder</span>
              <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[var(--color-foreground)]">N</kbd>
            </li>

          </ul>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] flex items-center justify-center shadow-sm border border-[var(--color-brand-graphite)] border-opacity-20 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]"
        aria-label="Keyboard Shortcuts"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-4 h-4" />
      </button>
    </div>
  );
}
