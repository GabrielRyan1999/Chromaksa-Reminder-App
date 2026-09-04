import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSettings } from "../actions/settings";
import SettingsForm from "./SettingsForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }

  const settings = await getUserSettings();

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <header className="p-8 pb-0">
        <Link 
          href="/app" 
          className="inline-flex items-center text-sm font-medium text-[var(--color-brand-graphite)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </header>
      
      <main className="max-w-xl mx-auto px-8 py-12 w-full">
        <h1 className="font-serif text-3xl font-bold mb-8">Settings</h1>
        {settings && <SettingsForm initialData={settings} />}
      </main>
    </div>
  );
}
