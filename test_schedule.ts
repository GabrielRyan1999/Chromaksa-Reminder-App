import { scheduleReminder } from './src/lib/qstash';

async function test() {
  const msgId = await scheduleReminder('test', new Date(Date.now() + 60_000));
  console.log('Result:', msgId);
}
test();
