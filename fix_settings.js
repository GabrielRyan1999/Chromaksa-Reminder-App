const fs = require('fs');
let c = fs.readFileSync('src/app/settings/SettingsForm.tsx', 'utf8');
c = c.replace('onClick={() => setEmailNotifications(!emailNotifications)}', 'role=\"switch\" aria-checked={emailNotifications} onClick={() => setEmailNotifications(!emailNotifications)}');
fs.writeFileSync('src/app/settings/SettingsForm.tsx', c);
