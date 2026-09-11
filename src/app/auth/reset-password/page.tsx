"use client";

import { useState, Suspense } from "react";
import { updatePassword } from "@/app/actions/reset-password";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400">
        <p className="font-medium">Invalid or missing reset token.</p>
        <p className="text-sm mt-2"><a href="/auth/forgot-password" className="underline hover:text-red-500">Request a new link</a></p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const res = await updatePassword(token as string, password);
    
    if (res.error) {
      setError(res.error);
    } else {
      setMessage("Password successfully reset! Redirecting to log in...");
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    }
    
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
          Set New Password
        </h1>
        <p className="text-sm text-[var(--color-brand-graphite)] mt-2">
          Choose a strong password for your account
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
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none transition-shadow pr-10"
                placeholder="Must be at least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] p-1 rounded transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!message}
            className="w-full bg-[var(--color-foreground)] text-[var(--color-background)] rounded p-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] selection:bg-[var(--color-brand-amber)] selection:text-white px-4">
      <Suspense fallback={<div />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
