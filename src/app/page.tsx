import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, FileText } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans selection:bg-[var(--color-brand-amber)] selection:text-white">
      
      {/* Navigation */}
      <nav className="border-b border-[var(--color-brand-graphite)] border-opacity-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif font-bold text-xl tracking-tight">
            Reminder App
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
        
        {/* Mockup / Hero Image Placeholder */}
        <div className="mt-20 relative rounded-xl border border-[var(--color-brand-graphite)] border-opacity-20 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center bg-black/5 dark:bg-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-50 pointer-events-none z-10" />
          {/* Fallback text if image is missing */}
          <div className="absolute text-[var(--color-brand-graphite)] opacity-50 flex flex-col items-center z-0">
            <Calendar className="w-16 h-16 mb-4" />
            <p className="font-serif text-xl">Drop screenshot to public/preview.png</p>
          </div>
          {/* Actual Preview Image */}
          <img 
            src="/preview.png" 
            alt="Reminder App Dashboard Preview" 
            className="w-full h-full object-cover object-top relative z-0"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-black/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-[var(--color-brand-graphite)] text-lg">A focused toolkit designed for modern professionals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-[var(--color-brand-amber)] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand-amber)] bg-opacity-20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-[var(--color-brand-amber)]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Expandable Reminders</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed">
                Add nested subtasks, jot down deep context notes, and categorize your to-dos with colored tags that keep your day organized.
              </p>
            </div>

            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-[var(--color-brand-sage)] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand-sage)] bg-opacity-20 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-[var(--color-brand-sage)]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Recurring & Due Dates</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed">
                Set exact times for reminders and schedule recurring tasks daily, weekly, or monthly. Missed a task? Just bump it to tomorrow.
              </p>
            </div>

            <div className="bg-[var(--color-background)] p-8 rounded-2xl border border-[var(--color-brand-graphite)] border-opacity-10 hover:border-[#8A8F98] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#8A8F98] bg-opacity-20 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-[#8A8F98]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Daily Journaling</h3>
              <p className="text-[var(--color-brand-graphite)] leading-relaxed">
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
