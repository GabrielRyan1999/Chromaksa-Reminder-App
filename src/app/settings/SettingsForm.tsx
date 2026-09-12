"use client";

import { useState } from "react";
import { updateUserSettings, deleteAllReminders } from "../actions/settings";
import { useRouter } from "next/navigation";
import { PushNotificationManager } from "@/components/PushNotificationManager";

export default function SettingsForm({ initialData }: { initialData: { name: string | null, email: string, timezone: string, emailNotifications?: boolean } }) {
  const [name, setName] = useState(initialData.name || "");
  const [timezone, setTimezone] = useState(initialData.timezone);
  const [emailNotifications, setEmailNotifications] = useState(initialData.emailNotifications !== false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      await updateUserSettings({ name, timezone, emailNotifications });
      router.refresh();
      setMessage({ text: "Settings saved successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAll() {
    setDeleting(true);
    try {
      await deleteAllReminders();
      router.refresh();
      setMessage({ text: "All reminders deleted successfully.", type: "success" });
      setShowConfirmDelete(false);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to delete reminders.", type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  // Simple list of common timezones for the MVP
  const timezones = [
    "UTC",
    "Asia/Jakarta",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Europe/London",
    "Europe/Paris",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[var(--color-brand-graphite)] mb-2">
          Email Address
        </label>
        <input 
          type="email" 
          value={initialData.email} 
          disabled 
          className="w-full bg-black/5 rounded px-3 py-2 text-sm text-[var(--color-brand-graphite)] border-none cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-brand-graphite)] mb-2">
          Name
        </label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none transition-shadow"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-brand-graphite)] mb-2">
          Timezone
        </label>
        <select 
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-brand-amber)] outline-none transition-shadow [&>option]:bg-white [&>option]:text-black dark:[&>option]:bg-[#1a1a1a] dark:[&>option]:text-white"
        >
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        <p className="text-xs text-[var(--color-brand-graphite)] mt-2">
          This affects when your daily reminder emails are sent.
        </p>
      </div>

      <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-[var(--color-brand-graphite)] border-opacity-20 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--color-foreground)] mb-1">Email Notifications</h3>
          <p className="text-xs text-[var(--color-brand-graphite)]">Receive email alerts for due reminders.</p>
        </div>
        
        <button
          type="button"
          onClick={() => setEmailNotifications(!emailNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            emailNotifications ? 'bg-[var(--color-brand-sage)]' : 'bg-[var(--color-brand-graphite)] bg-opacity-30'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <PushNotificationManager />

      <div className="flex items-center space-x-4">
        <button 
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-[var(--color-foreground)] text-[var(--color-background)] rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {message.text && (
          <p className={`text-sm ${message.type === 'success' ? 'text-[var(--color-brand-sage)]' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="pt-8 mt-8 border-t border-red-500/20">
        <h3 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h3>
        
        {!showConfirmDelete ? (
          <div className="flex items-center justify-between bg-red-500/5 p-4 rounded-lg border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-[var(--color-foreground)]">Delete All Reminders</p>
              <p className="text-xs text-[var(--color-brand-graphite)] mt-1">This action cannot be undone. All your reminders and tasks will be permanently removed.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded text-xs font-semibold transition-colors shrink-0 ml-4"
            >
              Delete All
            </button>
          </div>
        ) : (
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <p className="text-sm text-[var(--color-foreground)] font-medium mb-3">
              Are you absolutely sure you want to delete all reminders?
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete Everything"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-black/10 dark:bg-white/10 text-[var(--color-foreground)] rounded text-xs font-medium hover:opacity-80 transition-opacity"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
