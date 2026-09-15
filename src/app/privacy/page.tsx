import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Reminder App",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-12 text-[var(--color-foreground)]">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="font-serif text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-[var(--color-brand-graphite)]">
          <p>Last updated: September 2026</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, or interact with the Reminder App. This may include your name, email address, password, and the contents of your reminders and notes.</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to operate and improve our application, provide the features you request, and send you push notifications or email alerts related to your reminders.</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">3. Data Security</h2>
          <p>We take reasonable measures to help protect your information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. Passwords are securely hashed and never stored in plain text.</p>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-8 mb-4">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at Chromaksa Studio.</p>
        </div>
      </div>
    </div>
  );
}