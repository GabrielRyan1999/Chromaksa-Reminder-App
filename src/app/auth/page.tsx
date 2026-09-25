"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import { Eye, EyeOff } from "lucide-react";

function AuthForm() {
  const searchParams = useSearchParams();
  const initMode = searchParams.get("mode");
  
  const [isLogin, setIsLogin] = useState(initMode !== "signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (hp) {
      setLoading(false);
      return; // Silent reject
    }

    if (isLogin) {
      // Handle Login
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push("/app");
        router.refresh();
      }
    } else {
      // Handle Register
      const res = await registerUser(name, email, password);
      
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Switch to login tab and show success message
        setIsLogin(true);
        setPassword("");
        setEmail("");
        setName("");
        setSuccess("Account created successfully! Please log in.");
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] selection:bg-[var(--color-brand-amber)] selection:text-white px-4">
      <div className="w-full max-w-sm">
        
        {/* Logo / Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center group">
            <Image src="/logo.png" alt="Reminder App Logo" width={48} height={48} className="object-contain mb-3 group-hover:scale-105 transition-transform" />
            <h1 className="font-serif text-2xl font-bold text-[var(--color-foreground)] tracking-tight group-hover:text-[var(--color-brand-amber)] transition-colors">
              Reminder App
            </h1>
          </Link>
          <p className="text-sm text-[var(--color-brand-graphite)] mt-2">
            {isLogin ? "Welcome back" : "Create a new account"}
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-[var(--color-background)] border border-[var(--color-brand-graphite)] border-opacity-20 rounded-xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-600 dark:text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-600 text-sm text-center font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - invisible to humans */}
            <div className="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="website-url">Website URL</label>
              <input type="text" id="website-url" name="website_url" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-[var(--color-brand-graphite)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none transition-shadow"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-[var(--color-brand-graphite)] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email} autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none transition-shadow"
                placeholder="hello@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-brand-graphite)] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password} autoComplete={isLogin ? "current-password" : "new-password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none transition-shadow pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] p-1 rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <a href="/auth/forgot-password" className="text-xs text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] hover:underline transition-colors">
                    Forgot Password?
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-foreground)] text-[var(--color-background)] rounded p-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-[var(--color-brand-graphite)]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);

    if (hp) {
      setLoading(false);
      return; // Silent reject
    }
              }}
              className="text-[var(--color-foreground)] font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-background)]" />}>
      <AuthForm />
    </Suspense>
  );
}

