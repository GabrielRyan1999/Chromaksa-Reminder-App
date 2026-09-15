import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";

const sansFont = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serifFont = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reminder & Daily Notes",
  description: "Personal planning tool for your daily notes and reminders.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import CookieBanner from "@/components/CookieBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
          <Analytics />
          <CookieBanner />
      </body>
    </html>
  );
}
