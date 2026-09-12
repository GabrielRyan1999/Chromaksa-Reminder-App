"use client";

import { useState, useEffect } from "react";

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      setIsInitialized(true);
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    } finally {
      setIsInitialized(true);
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function subscribe() {
    setLoading(true);
    setMessage('');
    try {
      if (!('Notification' in window)) {
        throw new Error('Browser does not support notifications');
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const registration = await navigator.serviceWorker.ready;
      if (!registration) {
        throw new Error('Service worker not registered');
      }
      
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error('Missing VAPID public key. Check your environment variables.');
      }

      // Try to clear any existing (possibly corrupted or old VAPID) subscription first
      try {
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          await existingSub.unsubscribe();
        }
      } catch (e) {
        console.warn("Could not fetch/unsubscribe existing push subscription", e);
      }

      let sub;
      try {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      } catch (subError: any) {
        console.warn("First subscribe attempt failed, trying to unregister SW and retry...", subError);
        // Force unregister all service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let r of registrations) {
          await r.unregister();
        }
        
        // Re-register
        const newRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });
        
        // Retry subscribe
        sub = await newRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      }

      setSubscription(sub);

      // Send to backend
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub),
      });

      if (response.ok) {
        setMessage('Successfully subscribed to desktop notifications!');
      } else {
        setMessage('Failed to save subscription on the server.');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      setMessage(`Error: ${error.message || 'Failed to subscribe'}`);
    }
    setLoading(false);
  }

  async function unsubscribe() {
    setLoading(true);
    setMessage('');
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setMessage('Notifications disabled for this browser.');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setMessage('Error disabling notifications.');
    }
    setLoading(false);
  }

  if (!isSupported) {
    return <p className="text-sm text-[var(--color-brand-graphite)]">Push notifications are not supported in this browser.</p>;
  }

  return (
    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-[var(--color-brand-graphite)] border-opacity-20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--color-foreground)] mb-1">Desktop Notifications</h3>
          <p className="text-xs text-[var(--color-brand-graphite)]">Receive alerts when your reminders are due.</p>
        </div>
        
        <button
          onClick={() => subscription ? unsubscribe() : subscribe()}
          disabled={loading || !isInitialized}
          className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${
            isInitialized ? 'transition-colors duration-200' : ''
          } ${
            subscription ? 'bg-[var(--color-brand-sage)]' : 'bg-[var(--color-brand-graphite)] bg-opacity-30'
          } ${loading || !isInitialized ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white ${
              isInitialized ? 'transition-transform duration-200' : ''
            } ${
              subscription ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {message && <p className="text-xs mt-3 text-[var(--color-brand-graphite)]">{message}</p>}
    </div>
  );
}
