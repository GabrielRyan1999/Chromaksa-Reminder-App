import { createReminder } from './src/app/actions/reminders';

async function test() {
  try {
    const r = await createReminder("Test script", new Date(Date.now() + 5*60000), null, null, 0);
    console.log(r);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
