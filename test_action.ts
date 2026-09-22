import { createReminder } from './src/app/actions/reminders';
async function test() {
  try {
    console.log(await createReminder('Test', new Date(), null, 'Work'));
  } catch(e) {
    console.error('ERROR:', e.message);
  }
}
test();
