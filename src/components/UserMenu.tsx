"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, Sun, Moon, User as UserIcon, MessageSquareHeart } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function UserMenu({ user }: { user: any }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute top-6 right-4 md:right-8 z-50" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[var(--color-foreground)] text-[var(--color-background)] flex items-center justify-center font-bold shadow-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-amber)] dark:focus:ring-offset-[#111827]"
      >
        {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-background)] rounded-xl shadow-lg border border-[var(--color-brand-graphite)] border-opacity-20 py-2 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-2 border-b border-[var(--color-brand-graphite)] border-opacity-10 mb-1">
            <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
            <p className="text-xs text-[var(--color-brand-graphite)] truncate">{user?.email}</p>
          </div>
          
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/5 flex items-center transition-colors"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Link>

          <Link
            href="/feedback"
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/5 flex items-center transition-colors"
          >
            <MessageSquareHeart className="w-4 h-4 mr-3" />
            Give Feedback
          </Link>

          <button
            onClick={() => {
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/5 flex items-center transition-colors"
          >
            {mounted && resolvedTheme === 'dark' ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
            {mounted && resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          
          <button
            onClick={() => {
              signOut();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
