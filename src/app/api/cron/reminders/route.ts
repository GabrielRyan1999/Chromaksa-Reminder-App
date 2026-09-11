import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import webpush from 'web-push';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Set VAPID details inside the handler to prevent build-time errors if env vars are missing
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:' + (process.env.GMAIL_USER || 'admin@example.com'),
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
      process.env.VAPID_PRIVATE_KEY as string
    );
  }

  try {
    const now = new Date();
    
    // Find pending reminders due before now
    const dueReminders = await prisma.reminder.findMany({
      where: {
        status: 'pending',
        OR: [
          { notifyEmail: true },
          { notifyDesktop: true }
        ],
        dueAt: {
          lte: now,
        },
      },
      include: {
        user: {
          include: {
            pushSubscriptions: true,
          }
        },
      },
    });

    if (dueReminders.length === 0) {
      return NextResponse.json({ message: 'No reminders to send.' });
    }

    // Process reminders
    for (const reminder of dueReminders) {
      
      // Email Notification
      if (reminder.notifyEmail && reminder.user.email) {
        await transporter.sendMail({
          from: `"Reminder App" <${process.env.GMAIL_USER}>`,
          to: reminder.user.email,
          subject: `Reminder: ${reminder.title}`,
          html: `
            <div>
              <h2>${reminder.title}</h2>
              ${reminder.description ? `<p>${reminder.description}</p>` : ''}
              <p>Due at: ${reminder.dueAt.toLocaleString()}</p>
              <p>Log in to your Reminder App to mark this as done.</p>
            </div>
          `,
        }).catch(err => console.error("Email error:", err));
      }

      // Web Push Notification
      if (reminder.notifyDesktop && reminder.user.pushSubscriptions.length > 0) {
        const payload = JSON.stringify({
          title: reminder.title,
          body: reminder.description || `It's time for your reminder!`,
        });

        for (const sub of reminder.user.pushSubscriptions) {
          const pushConfig = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            }
          };

          await webpush.sendNotification(pushConfig, payload).catch(async (error) => {
            console.error("Push error:", error);
            if (error.statusCode === 410 || error.statusCode === 404) {
              // Subscription expired or invalid, remove from DB
              await prisma.pushSubscription.delete({ where: { id: sub.id } });
            }
          });
        }
      }

      // Update status to sent so we don't spam
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { status: 'sent' },
      });
    }

    return NextResponse.json({ success: true, count: dueReminders.length });
  } catch (error) {
    console.error('Error in cron job', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
