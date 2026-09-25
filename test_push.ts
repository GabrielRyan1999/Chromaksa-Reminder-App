import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@example.com',
  'BDwskUSxM6qtaF1IpLav0d2FLHSP5qHXkv9jwE9cWl2JWN6JjrmfLT91PA582xwEWPDRzfA8dPAyeItkhmKmVj4',
  'Dx0vUb8UHDgeES0uN5qdA3gGR95IaHpryBixav1ldEY'
);

const pushConfig = {
  endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABqs4nQ6U9ntj2udsJcOHzN_t27fBmZfIfCwtyIPn0FsxS_B1Tau0tPVxz3A4tK40WaxflUXnsiyDIVbC-zhTp42YUqg9d4uRm6egf6EMO5XI3fqr9ojhWJkdSHcawoGxtAJyb5a_vEPfQkShbxOr9tuKeSVk3LHPm32Zp7sstr3FFHpg4',
  keys: {
    p256dh: 'BEUihGSxm42KI__NTFUHnZxHjMBTnjTK8nkQDIwJyJ3_vdEcpYdWyTTBwEAAWTV3K3Rm3AOIjtl_DbGr1iKgjv8',
    auth: 'i_u6uWAAEcfWzpxweqEGuw'
  }
};

const payload = JSON.stringify({
  title: 'Test Push',
  body: 'This is a test'
});

async function test() {
  try {
    console.log("Sending push...");
    const res = await webpush.sendNotification(pushConfig, payload);
    console.log("Success:", res.statusCode);
  } catch (error) {
    console.error("Failed:", error);
  }
}
test();
