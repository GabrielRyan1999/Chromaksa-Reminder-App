import sys
with open('src/app/actions/reminders.ts', 'r') as f:
    content = f.read()

content = content.replace('import { authOptions } from "@/lib/auth";', 'import { authOptions } from "@/lib/auth";\nimport { scheduleReminder, cancelReminder } from "@/lib/qstash";')

# createReminder
old_create = """  const reminder = await prisma.reminder.create({
    data: {
      userId: session.user.id,
      title,
      dueAt,
      recurrenceRule,
      category,
      notifyDesktop: true,
      notifyEmail: true,
    }
  });

  return reminder;"""
new_create = """  const reminder = await prisma.reminder.create({
    data: {
      userId: session.user.id,
      title,
      dueAt,
      recurrenceRule,
      category,
      notifyDesktop: true,
      notifyEmail: true,
    }
  });

  const messageId = await scheduleReminder(reminder.id, dueAt);
  if (messageId) {
    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { qstashMessageId: messageId }
    });
    reminder.qstashMessageId = messageId;
  }

  return reminder;"""
content = content.replace(old_create, new_create)

# bumpReminder
old_bump = """  return prisma.reminder.update({
    where: { id },
    data: { dueAt: newDueAt }
  });"""
new_bump = """  const messageId = await scheduleReminder(id, newDueAt);
  if (reminder.qstashMessageId) await cancelReminder(reminder.qstashMessageId);

  return prisma.reminder.update({
    where: { id },
    data: { dueAt: newDueAt, qstashMessageId: messageId }
  });"""
content = content.replace(old_bump, new_bump)

# toggleReminderStatus
old_toggle = """  const updated = await prisma.reminder.update({
    where: { id },
    data: { status }
  });"""
new_toggle = """  const updated = await prisma.reminder.update({
    where: { id },
    data: { status }
  });

  if (status === "done" && reminder.qstashMessageId) {
    await cancelReminder(reminder.qstashMessageId);
  } else if (status === "pending" && !updated.qstashMessageId) {
    const msgId = await scheduleReminder(id, new Date(updated.dueAt));
    if (msgId) await prisma.reminder.update({ where: { id }, data: { qstashMessageId: msgId } });
  }"""
content = content.replace(old_toggle, new_toggle)

# toggleReminderStatus recurrence
old_recurrence = """    await prisma.reminder.create({
      data: {
        userId: session.user.id,
        title: reminder.title,
        description: reminder.description,
        dueAt: nextDueAt,
        recurrenceRule: reminder.recurrenceRule,
        status: "pending",
        notifyDesktop: reminder.notifyDesktop,
        notifyEmail: reminder.notifyEmail,
      }
    });"""
new_recurrence = """    const spawned = await prisma.reminder.create({
      data: {
        userId: session.user.id,
        title: reminder.title,
        description: reminder.description,
        dueAt: nextDueAt,
        recurrenceRule: reminder.recurrenceRule,
        status: "pending",
        notifyDesktop: reminder.notifyDesktop,
        notifyEmail: reminder.notifyEmail,
      }
    });
    const msgId = await scheduleReminder(spawned.id, nextDueAt);
    if (msgId) await prisma.reminder.update({ where: { id: spawned.id }, data: { qstashMessageId: msgId } });"""
content = content.replace(old_recurrence, new_recurrence)

# deleteReminder
old_delete = """  return prisma.reminder.delete({
    where: {
      id,
      userId: session.user.id,
    }
  });"""
new_delete = """  const reminder = await prisma.reminder.findUnique({ where: { id } });
  if (reminder?.qstashMessageId) await cancelReminder(reminder.qstashMessageId);

  return prisma.reminder.delete({
    where: {
      id,
      userId: session.user.id,
    }
  });"""
content = content.replace(old_delete, new_delete)

with open('src/app/actions/reminders.ts', 'w') as f:
    f.write(content)
