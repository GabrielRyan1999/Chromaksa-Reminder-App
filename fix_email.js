const fs = require('fs');
let c = fs.readFileSync('src/app/api/webhooks/qstash/route.ts', 'utf8');

const search = `      await transporter.sendMail({
        from: 'Reminder App <' + process.env.GMAIL_USER + '>',
        to: reminder.user.email,
        subject: subjectPrefix + reminder.title,
        html: '<div><h2>' + subjectPrefix + reminder.title + '</h2>' + (reminder.description ? '<p>' + reminder.description + '</p>' : '') + '<p>Due at: <strong>' + formattedDate + '</strong></p></div>',
      }).catch(err => console.error("Email error", err));`;

const replace = `      const appUrl = process.env.NEXTAUTH_URL || 'https://chromaksa.vercel.app';
      
      await transporter.sendMail({
        from: 'Reminder App <' + process.env.GMAIL_USER + '>',
        to: reminder.user.email,
        subject: subjectPrefix + reminder.title,
        html: \`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #111827; margin: 0; font-size: 24px;">\${subjectPrefix}\${reminder.title}</h1>
            </div>
            <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
              \${reminder.description ? \`<p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-top: 0;">\${reminder.description}</p>\` : ''}
              <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin-top: 16px;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  <span style="color: #6b7280; font-weight: 500;">Due Date:</span> 
                  <strong style="margin-left: 8px;">\${formattedDate}</strong>
                </p>
              </div>
            </div>
            <div style="text-align: center;">
              <a href="\${appUrl}/app" style="display: inline-block; background-color: #f59e0b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                Open Reminder App
              </a>
            </div>
          </div>
        \`,
      }).catch(err => console.error("Email error", err));`;

c = c.replace(search, replace);
fs.writeFileSync('src/app/api/webhooks/qstash/route.ts', c);
