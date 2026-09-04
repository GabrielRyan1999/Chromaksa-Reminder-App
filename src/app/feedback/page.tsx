"use client";

import { useForm, ValidationError } from '@formspree/react';
import Link from "next/link";
import { ArrowLeft, MessageSquareHeart } from "lucide-react";

export default function FeedbackPage() {
  const [state, handleSubmit] = useForm('myeyyyaj');
  
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col selection:bg-[var(--color-brand-amber)] selection:text-white">
      <header className="p-8 pb-0">
        <Link 
          href="/app" 
          className="inline-flex items-center text-sm font-medium text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </header>
      
      <main className="max-w-xl mx-auto px-8 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-10">
          <MessageSquareHeart className="w-12 h-12 mx-auto mb-4 text-[var(--color-brand-amber)]" />
          <h1 className="font-serif text-3xl font-bold mb-2">We'd love your feedback!</h1>
          <p className="text-[var(--color-brand-graphite)]">
            How can we improve Reminder App for you? Let us know below.
          </p>
        </div>

        {state.succeeded ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center animate-in fade-in zoom-in-95">
            <h2 className="text-emerald-600 font-bold text-xl mb-2">Thank you!</h2>
            <p className="text-emerald-700/80 text-sm">Your feedback has been successfully submitted. We appreciate your time!</p>
            <Link href="/app" className="inline-block mt-6 px-6 py-2 bg-emerald-600 text-white rounded-md text-sm font-semibold hover:bg-emerald-700 transition-colors">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-black/5 dark:bg-white/5 border border-[var(--color-brand-graphite)] border-opacity-20 rounded-xl p-6 sm:p-8">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-brand-graphite)] mb-1">
                Your Email Address
              </label>
              <input 
                id="email" 
                type="email" 
                name="email" 
                required 
                className="w-full bg-[var(--color-background)] border border-[var(--color-brand-graphite)] border-opacity-30 rounded-md p-2.5 text-sm text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-brand-amber)] focus:border-transparent outline-none transition-all"
                placeholder="hello@example.com"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-[var(--color-brand-graphite)] mb-1">
                Your Message
              </label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows={5}
                className="w-full bg-[var(--color-background)] border border-[var(--color-brand-graphite)] border-opacity-30 rounded-md p-2.5 text-sm text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-brand-amber)] focus:border-transparent outline-none transition-all resize-y"
                placeholder="I really love the app, but it would be great if..."
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>

            <button 
              type="submit" 
              disabled={state.submitting}
              className="w-full bg-[var(--color-foreground)] text-[var(--color-background)] rounded-md p-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.submitting ? "Sending..." : "Submit Feedback"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
