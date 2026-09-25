const { Client } = require('@upstash/qstash');
const qstash = new Client({ token: process.env.QSTASH_TOKEN, baseUrl: process.env.QSTASH_URL });
async function check() {
  const events = await qstash.events();
  const recent = events.events.slice(0, 15);
  console.log(JSON.stringify(recent.map(e => ({msgId: e.messageId, state: e.state, time: new Date(e.time).toLocaleTimeString(), due: e.nextDeliveryTime ? new Date(e.nextDeliveryTime).toLocaleTimeString() : null})), null, 2));
}
check();
