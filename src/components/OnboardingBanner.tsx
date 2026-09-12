"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";

export default function OnboardingBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    const dismissed = localStorage.getItem("onboarding_banner_dismissed");
    if (dismissed) return;

    // Show banner if notification permission is not granted yet
    // or we just want to encourage them to visit settings.
    if ('Notification' in window && Notification.permission !== 'granted') {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="bg-[var(--color-foreground)] text-[var(--color-background)] p-4 rounded-xl mb-8 flex items-start justify-between relative shadow-lg">
      <div className="flex items-start space-x-4 pr-8">
        <div className="bg-[var(--color-background)] p-2 rounded-full mt-1">
          <Bell className="w-5 h-5 text-[var(--color-foreground)]" />
        </div>
        <div>
          <h3 className="font-bold text-base mb-1">Never miss a deadline!</h3>
          <p className="text-sm opacity-90 mb-3 max-w-md">
            Your reminders will only work perfectly if you configure your <strong>Timezone</strong> and enable <strong>Desktop Notifications</strong>.
          </p>
          <Link 
            href="/settings"
            className="inline-block bg-[var(--color-background)] text-[var(--color-foreground)] px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Configure Settings
          </Link>
        </div>
      </div>
      
      <button 
        onClick={() => {
          localStorage.setItem("onboarding_banner_dismissed", "true");
          setShow(false);
        }}
        className="absolute top-4 right-4 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
