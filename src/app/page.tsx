import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, FileText } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans selection:bg-[var(--color-brand-amber)] selection:text-white">
      
      {/* Navigation */}
      <nav className="border-b border-[var(--color-brand-graphite)] border-opacity-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Reminder App Logo" className="w-8 h-8 object-contain" />
            <div className="font-serif font-bold text-xl tracking-tight">
              Reminder App
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/auth" className="text-sm font-medium hover:text-[var(--color-brand-amber)] transition-colors">
              Log in
            </Link>
            <Link href="/auth?mode=signup" className="bg-[var(--color-foreground)] text-[var(--color-background)] px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8">
          The minimalist planner for your <span className="text-[var(--color-brand-amber)] italic">scattered</span> brain.
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-brand-graphite)] max-w-2xl mx-auto mb-12">
          Bring your daily notes, calendars, and to-do lists into one beautifully simple workspace. Stop context-switching and start doing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth?mode=signup" className="group flex items-center justify-center bg-[var(--color-foreground)] text-[var(--color-background)] px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-all w-full sm:w-auto">
            Try it for free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        
        <HeroCarousel />
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-black/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-center">Everything you need. Nothing you don't.</h2>
            <p className="text-[var(--color-brand-graphite)] text-lg text-center">A focused toolkit designed for modern professionals.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-[var(--color-brand-amber)] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand-amber)] bg-opacity-20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-[var(--color-brand-amber)]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Expandable Reminders</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed text-sm">
                Add nested subtasks, jot down deep context notes, and categorize your to-dos with colored tags that keep your day organized.
              </p>
            </div>

            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-[var(--color-brand-sage)] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand-sage)] bg-opacity-20 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-[var(--color-brand-sage)]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Recurring & Due Dates</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed text-sm">
                Set exact times for reminders and schedule recurring tasks daily, weekly, or monthly. Missed a task? Just bump it to tomorrow.
              </p>
            </div>

            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Real-time Notifications</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed text-sm">
                Never miss a beat. Receive instant desktop pop-ups and personalized email alerts the moment your task is due.
              </p>
            </div>

            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-purple-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Dark Mode & Timezones</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed text-sm">
                Automatically adapts to your system's light or dark theme. Fully supports international timezones so your alerts are always on time.
              </p>
            </div>

            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-rose-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-rose-500 bg-opacity-20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Secure Access</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed text-sm">
                Industry-standard password encryption, forgot password recovery flows, and secure sessions keep your private data safe.
              </p>
            </div>

            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-[#8A8F98] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#8A8F98] bg-opacity-20 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-[#8A8F98]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Daily Journaling</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed text-sm">
                A rich-text, auto-saving notepad strictly tied to each date. Perfect for daily standups, brain dumps, and meeting minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-brand-graphite)] border-opacity-20 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-[var(--color-brand-graphite)]">
          <div className="font-serif font-bold text-lg text-[var(--color-foreground)] mb-4 md:mb-0">
            Reminder App
          </div>
          <div className="text-[var(--color-brand-graphite)] font-medium">
            A product by <a href="https://www.instagram.com/chromaksa.studio/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-foreground)] transition-colors underline underline-offset-4 decoration-[var(--color-brand-graphite)] hover:decoration-[var(--color-foreground)]">Chromaksa Studio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
