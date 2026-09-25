# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js (App Router), Tailwind CSS, Prisma, Neon Postgres, QStash (event-driven webhooks), Better Auth (Wait, the user screenshot showed "Better Auth", but they were using next-auth earlier? Let's leave it as NextAuth/BetterAuth).

## Users
Individuals needing a simple, reliable, and event-driven reminder system for daily tasks, work, and personal errands.

## Product Purpose
A robust reminder web application that allows users to schedule tasks with advance notifications. It ensures no task is forgotten by pushing notifications via email and desktop web push reliably exactly when due.

## Operating Context
Users interact with the app via a modern web interface on desktop or mobile browsers. They receive asynchronous notifications via Email and Web Push in the background.

## Capabilities and Constraints
- Event-driven background task scheduling using Upstash QStash.
- Desktop web push notifications using Service Workers.
- Email notifications using nodemailer.
- Advance notice capability (notify N minutes before due).
- Timezone-aware scheduling.
- PostgreSQL database hosted on Neon.

## Evidence on Hand
Working push notifications, working email delivery, fully functional QStash scheduling loop, optimistic UI state updates for adding/deleting tasks.

## Product Principles
- Reliability: Reminders must fire exactly when expected, whether the user is online or offline.
- Simplicity: Adding a reminder should be fast and frictionless with immediate UI feedback.
- Graceful Degradation: If push notifications are disabled or unsupported, email serves as a reliable fallback.
