import { getAllReminders } from './src/app/actions/reminders';
async function run() {
  const data = await getAllReminders();
  console.log(data);
}
run();
