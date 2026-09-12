"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import TiptapEditor from "./TiptapEditor";
import ReminderList from "./ReminderList";
import OnboardingBanner from "./OnboardingBanner";

interface DayViewProps {
  selectedDate: Date;
  user: any;
}

export default function DayView({ selectedDate, user }: DayViewProps) {
  const dateString = format(selectedDate, "EEEE, MMMM d, yyyy");

  const [timeStr, setTimeStr] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Hello");

  useEffect(() => {
    // Pick a random greeting based on the hour once on mount
    const hour = new Date().getHours();
    const morning = ["Good morning", "Morning", "Rise and shine", "Hi", "Hello"];
    const afternoon = ["Good afternoon", "Afternoon", "Hello", "Hi", "Hey there"];
    const evening = ["Good evening", "Evening", "Hello", "Hi", "Hey there"];
    
    let pool = evening;
    if (hour >= 5 && hour < 12) pool = morning;
    else if (hour >= 12 && hour < 17) pool = afternoon;
    
    setGreeting(pool[Math.floor(Math.random() * pool.length)]);

    // Update clock every second
    const updateTime = () => setTimeStr(format(new Date(), "h:mm a"));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)]">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <header className="mb-10 flex items-end justify-between border-b border-[var(--color-brand-graphite)] border-opacity-20 pb-6">
          <div>
            <div className="text-[var(--color-brand-graphite)] font-medium mb-2 text-lg">
              {greeting}, <span className="text-[var(--color-brand-amber)] font-semibold">{user?.name?.split(' ')[0] || "User"}</span>!
            </div>
            <h2 className="font-serif text-4xl text-[var(--color-foreground)] tracking-tight">
              {dateString}
            </h2>
          </div>
          
          {timeStr && (
            <div className="text-sm font-mono text-[var(--color-brand-graphite)] bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-md shadow-inner">
              {timeStr}
            </div>
          )}
        </header>

        <OnboardingBanner />

        {/* Reminders section */}
        <section className="mb-14">
          <div className="flex items-center space-x-2 mb-5">
            <h3 className="font-sans font-semibold text-lg text-[var(--color-brand-graphite)] uppercase tracking-wider text-xs">
              Reminders
            </h3>
          </div>
          
          <ReminderList selectedDate={selectedDate} />
        </section>

        <hr className="border-t border-[var(--color-brand-graphite)] border-opacity-20 mb-8" />

        {/* Notes section */}
        <section>
          <TiptapEditor selectedDate={selectedDate} />
        </section>
      </div>
    </div>
  );
}
