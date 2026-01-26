import * as moment from 'moment';
import { buildInactiveEmail, buildNoReadingsEmail } from './emailTemplates';

const isCooldownActive = (lastSentMap, cooldownKey, cooldownMinutes, now) => {
  const lastSent = lastSentMap[cooldownKey];
  if (!lastSent) {
    return false;
  }
  return moment(lastSent).isAfter(now.clone().subtract(cooldownMinutes, 'minutes'));
};

const processLocationInactivity = async ({
  location,
  tempService,
  now,
  cooldownMinutes,
  lastSentMap,
  sendEmail,
  logger,
}) => {
  const settings = (location as any).notificationSettings;
  if (!settings || !settings.enabled) {
    return;
  }

  if (!settings.email || !settings.inactiveThresholdMinutes) {
    logger.log(
      `[Notificator service] Missing notification settings for location ${(location as any)._id}, skipping.`,
    );
    return;
  }

  const locationId = (location as any)._id;
  const locationName = (location as any).name;
  const thresholdMinutes = Number(settings.inactiveThresholdMinutes);
  const cooldownKey = `${locationId}:${settings.email}`;

  const lastTemp = await tempService.findLastOne(locationId);
  if (!lastTemp || !lastTemp.date) {
    logger.log(
      `[Notificator service] No readings for location ${locationId}, notification -> ${settings.email}`,
    );
    if (isCooldownActive(lastSentMap, cooldownKey, cooldownMinutes, now)) {
      return;
    }
    const email = buildNoReadingsEmail(locationName, locationId);
    await sendEmail(settings.email, email.subject, email);
    lastSentMap[cooldownKey] = new Date();
    return;
  }

  const lastDate = moment(lastTemp.date);
  if (!lastDate.isValid()) {
    logger.log(`[Notificator service] Invalid reading date for location ${locationId}`);
    return;
  }

  const thresholdDate = now.clone().subtract(thresholdMinutes, 'minutes');
  if (!lastDate.isBefore(thresholdDate)) {
    return;
  }

  if (isCooldownActive(lastSentMap, cooldownKey, cooldownMinutes, now)) {
    return;
  }

  logger.log(
    `[Notificator service] Inactive since ${lastDate.toISOString()} (limit ${thresholdMinutes} min) -> ${
      settings.email
    }`,
  );
  const email = buildInactiveEmail(locationName, locationId, lastDate.toISOString(), thresholdMinutes);
  await sendEmail(settings.email, email.subject, email);
  lastSentMap[cooldownKey] = new Date();
};

export { processLocationInactivity };
