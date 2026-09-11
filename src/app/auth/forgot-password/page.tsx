"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/reset-password";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const res = await requestPasswordReset(email);
    
    if (res.error) {
      setError(res.error);
    } else {
      setMessage("If that email is registered, we've sent a password reset link to it.");
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] selection:bg-[var(--color-brand-amber)] selection:text-white px-4">
      <div className="w-full max-w-sm">
        
        <Link href="/auth" className="inline-flex items-center text-sm text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to log in
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-[var(--color-brand-graphite)] mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="bg-[var(--color-background)] border border-[var(--color-brand-graphite)] border-opacity-20 rounded-xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-600 dark:text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-600 dark:text-emerald-400 text-sm text-center font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-brand-graphite)] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none transition-shadow"
                placeholder="hello@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-foreground)] text-[var(--color-background)] rounded p-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
