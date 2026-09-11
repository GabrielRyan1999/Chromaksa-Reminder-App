import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

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

  try {
    const now = new Date();
    
    // Find pending reminders due before now
    const dueReminders = await prisma.reminder.findMany({
      where: {
        status: 'pending',
        notifyEmail: true,
        dueAt: {
          lte: now,
        },
      },
      include: {
        user: true,
      },
    });

    if (dueReminders.length === 0) {
      return NextResponse.json({ message: 'No reminders to send.' });
    }

    // Send emails
    for (const reminder of dueReminders) {
      if (!reminder.user.email) continue;
      
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
      });

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
