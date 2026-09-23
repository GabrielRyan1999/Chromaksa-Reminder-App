import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import webpush from 'web-push';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function handler(request: Request) {
  try {
    const body = await request.json();
    const reminderId = body.reminderId;

    if (!reminderId) {
      return NextResponse.json({ error: 'No reminderId provided' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        'mailto:' + (process.env.GMAIL_USER || 'admin@example.com'),
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    }

    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: {
        user: {
          include: { pushSubscriptions: true },
        },
      },
    });

    if (!reminder || reminder.status === 'done' || reminder.status === 'sent') {
      return NextResponse.json({ message: 'Skipped' });
    }

    if (reminder.notifyEmail && reminder.user.emailNotifications && reminder.user.email) {
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
        timeZone: reminder.user.timezone || 'UTC'
      }).format(new Date(reminder.dueAt));

      await transporter.sendMail({
        from: 'Reminder App <' + process.env.GMAIL_USER + '>',
        to: reminder.user.email,
        subject: 'Reminder: ' + reminder.title,
        html: '<div><h2>' + reminder.title + '</h2>' + (reminder.description ? '<p>' + reminder.description + '</p>' : '') + '<p>Due at: <strong>' + formattedDate + '</strong></p></div>',
      }).catch(err => console.error("Email error", err));
    }

    if (reminder.notifyDesktop && reminder.user.pushSubscriptions.length > 0) {
      const payload = JSON.stringify({
        title: reminder.title,
        body: reminder.description || 'Its time for your reminder!',
      });

      for (const sub of reminder.user.pushSubscriptions) {
        const pushConfig = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth, }
        };
        await webpush.sendNotification(pushConfig, payload).catch(async (error) => {
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        });
      }
    }

    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { status: 'sent', qstashMessageId: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
