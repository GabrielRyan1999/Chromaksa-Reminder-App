"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Calendar as CalendarIcon, FileText, CheckSquare, Clock } from "lucide-react";
import { searchContent } from "@/app/actions/search";
import { format } from "date-fns";
import { useDebounce } from "@/lib/hooks";

export default function GlobalSearch({ onSelectDate }: { onSelectDate: (date: Date) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ notes: any[], reminders: any[] }>({ notes: [], reminders: [] });
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults({ notes: [], reminders: [] });
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    
    searchContent(debouncedQuery).then((data) => {
      if (isMounted) {
        setResults(data);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [debouncedQuery]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-20 md:right-24 z-50 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 text-[var(--color-foreground)] flex items-center justify-center shadow-sm border border-[var(--color-brand-graphite)] border-opacity-20 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]"
        aria-label="Search (Ctrl+K)"
        title="Search (Ctrl+K)"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }

  // Strip HTML from Tiptap rich text for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-[10vh] px-4 animate-in fade-in duration-200">
      <div 
        className="bg-[var(--color-background)] w-full max-w-2xl rounded-2xl shadow-2xl border border-[var(--color-brand-graphite)] border-opacity-20 overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-top-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-[var(--color-brand-graphite)] border-opacity-10">
          <Search className="w-5 h-5 text-[var(--color-brand-graphite)] mr-3" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search tasks, notes, or categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[var(--color-foreground)] placeholder-[var(--color-brand-graphite)] text-base"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {!query && (
            <div className="px-4 py-12 text-center text-[var(--color-brand-graphite)] flex flex-col items-center">
              <Search className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">Type to start searching</p>
              <p className="text-xs mt-1 opacity-70">Tip: Use <kbd className="font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded ml-1">Ctrl+K</kbd> to open anytime</p>
            </div>
          )}

          {loading && query && (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-brand-graphite)] animate-pulse">
              Searching...
            </div>
          )}

          {!loading && query && results.reminders.length === 0 && results.notes.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-brand-graphite)]">
              No results found for "{query}"
            </div>
          )}

          {!loading && results.reminders.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-graphite)]">Tasks</h3>
              <ul className="space-y-1 mt-1">
                {results.reminders.map(r => (
                  <li key={r.id}>
                    <button 
                      onClick={() => {
                        onSelectDate(new Date(r.dueAt));
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group flex items-start"
                    >
                      <div className="mt-0.5 mr-3">
                        {r.status === 'done' ? <CheckSquare className="w-4 h-4 text-[var(--color-brand-sage)]" /> : <Clock className="w-4 h-4 text-[var(--color-brand-amber)]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">{r.title}</p>
                          <span className="text-xs text-[var(--color-brand-graphite)] whitespace-nowrap flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {format(new Date(r.dueAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        {r.description && <p className="text-xs text-[var(--color-brand-graphite)] truncate mt-0.5">{r.description}</p>}
                        {r.category && <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-black/5 dark:bg-white/10 text-[var(--color-brand-graphite)]">{r.category}</span>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && results.notes.length > 0 && (
            <div>
              <h3 className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-graphite)]">Daily Notes</h3>
              <ul className="space-y-1 mt-1">
                {results.notes.map(n => (
                  <li key={n.id}>
                    <button 
                      onClick={() => {
                        // date is in "yyyy-MM-dd"
                        const [y, m, d] = n.date.split("-");
                        onSelectDate(new Date(parseInt(y), parseInt(m)-1, parseInt(d)));
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group flex items-start"
                    >
                      <div className="mt-0.5 mr-3">
                        <FileText className="w-4 h-4 text-[#8A8F98]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">Journal for {format(new Date(n.date + "T12:00:00Z"), "MMM d, yyyy")}</p>
                          <span className="text-xs text-[var(--color-brand-graphite)] whitespace-nowrap">
                            {n.date}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-brand-graphite)] truncate mt-1 italic">
                          "{stripHtml(n.content).substring(0, 100)}..."
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
