import { buildContactEmail } from './emailTemplates';

const formatEventDate = (date) =>
  new Date(date).toLocaleString('pl-PL', { timeZone: process.env.NOTIFICATION_TIMEZONE || 'Europe/Warsaw' });

const processContactChange = async ({ location, contact, sendEmail, logger }) => {
  const settings = location && (location as any).notificationSettings;
  const email = settings && settings.email;
  if (!email) {
    return;
  }

  const wantsNotification = contact.isOpen ? settings.notifyContactOpen : settings.notifyContactClose;
  if (!wantsNotification) {
    return;
  }

  const locationName = (location as any).name || contact.locationId;
  const contactSettings = (location as any).contactSettings;
  const configured = ((contactSettings && contactSettings.sensors) || []).find(
    (sensor) => sensor.sensorId === contact.sensorId,
  );
  const sensorName = (configured && configured.name) || contact.name || contact.sensorId;

  logger.log(
    `[Notificator service] Contact ${sensorName} ${contact.isOpen ? 'opened' : 'closed'} -> ${email}`,
  );
  const mail = buildContactEmail(locationName, sensorName, contact.isOpen, formatEventDate(contact.date));
  await sendEmail(email, mail.subject, mail);
};

export { processContactChange };
