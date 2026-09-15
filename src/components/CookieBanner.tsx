"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="max-w-4xl mx-auto bg-[var(--color-background)] border border-[var(--color-brand-graphite)] border-opacity-20 rounded-xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm text-[var(--color-brand-graphite)]">
          <span className="text-[var(--color-foreground)] font-semibold mb-1 block">We value your privacy</span>
          We use cookies and analytics to improve your experience and understand how you use our app. By continuing to use this site, you consent to our use of cookies as described in our{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-foreground)] transition-colors">
            Privacy Policy
          </Link>.
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
          <button
            onClick={handleAccept}
            className="w-full md:w-auto px-6 py-2 bg-[var(--color-foreground)] text-[var(--color-background)] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}