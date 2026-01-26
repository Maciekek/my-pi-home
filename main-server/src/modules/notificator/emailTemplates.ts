const buildEmailLayout = (title, body) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:14px;box-shadow:0 8px 24px rgba(22,41,85,0.08);overflow:hidden;">
            <tr>
              <td style="background:#162955;color:#ffffff;padding:18px 24px;font-size:16px;font-weight:600;">
                my-pi-home alert
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px;color:#1d2433;font-size:14px;line-height:1.6;">
                <h2 style="margin:0 0 12px 0;font-size:18px;color:#162955;">${title}</h2>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#6b7280;font-size:12px;background:#f8fafc;">
                This is an automated notification. If you did not expect this, you can ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const buildStartupTestEmail = () => {
  const title = 'SMTP test email';
  const body = '<p>Your SMTP configuration is working. This is a startup test from my-pi-home.</p>';
  return {
    text: 'Your SMTP configuration is working. This is a startup test from my-pi-home.',
    html: buildEmailLayout(title, body),
    subject: title,
  };
};

const buildNoReadingsEmail = (locationName, locationId) => {
  const title = 'No readings for location';
  const name = locationName || locationId;
  const body = `<p>No readings found for location <strong>${name}</strong>.</p>
<p>Last reading: <strong>none</strong>.</p>`;
  return {
    text: `No readings found for location ${name}. Last reading: none.`,
    html: buildEmailLayout(title, body),
    subject: title,
  };
};

const buildInactiveEmail = (locationName, locationId, lastDate, thresholdMinutes) => {
  const title = 'No recent readings';
  const name = locationName || locationId;
  const body = `<p>No new readings for location <strong>${name}</strong> since <strong>${lastDate}</strong>.</p>
<p>Last reading: <strong>${lastDate}</strong>.</p>
<p>Threshold: <strong>${thresholdMinutes} minutes</strong>.</p>`;
  return {
    text: `No new readings for location ${name} since ${lastDate}. Last reading: ${lastDate}. Threshold: ${thresholdMinutes} minutes.`,
    html: buildEmailLayout(title, body),
    subject: title,
  };
};

export { buildStartupTestEmail, buildNoReadingsEmail, buildInactiveEmail };
