import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Reminder App",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-12 text-[var(--color-foreground)]">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="font-serif text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-[var(--color-brand-graphite)]">
          <p>Last updated: September 2026</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using the Reminder App, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our services.</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">2. Description of Service</h2>
          <p>Reminder App provides a personal productivity tool for managing notes and tasks. We reserve the right to modify or discontinue the service at any time without notice.</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">3. User Accounts</h2>
          <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">4. Limitation of Liability</h2>
          <p>In no event shall Reminder App or Chromaksa Studio be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of the service.</p>
        </div>
      </div>
    </div>
  );
}