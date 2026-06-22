import * as moment from 'moment';
import { buildThresholdEmail } from './emailTemplates';

const isCooldownActive = (lastSentMap, cooldownKey, cooldownMinutes, now) => {
  const lastSent = lastSentMap[cooldownKey];
  if (!lastSent) {
    return false;
  }
  return moment(lastSent).isAfter(now.clone().subtract(cooldownMinutes, 'minutes'));
};

const processLocationThresholds = async ({
  location,
  tempService,
  now,
  cooldownMinutes,
  lastSentMap,
  sendEmail,
  logger,
}) => {
  const settings = (location as any).notificationSettings;
  const email = settings && settings.email;
  if (!email) {
    return;
  }

  const tempSettings = (location as any).tempSettings;
  const sensors = (tempSettings && tempSettings.sensors) || [];
  if (!sensors.length) {
    return;
  }

  const locationId = (location as any)._id;
  const locationName = (location as any).name;

  for (const sensor of sensors) {
    const wantsAbove = sensor.notifyAbove && sensor.maxTemp !== undefined && sensor.maxTemp !== null;
    const wantsBelow = sensor.notifyBelow && sensor.minTemp !== undefined && sensor.minTemp !== null;
    if (!wantsAbove && !wantsBelow) {
      continue;
    }

    const lastTemp = await tempService.findLastBySensor(locationId, sensor.sensorId);
    if (!lastTemp || lastTemp.value === undefined || lastTemp.value === null) {
      continue;
    }

    const value = Number(lastTemp.value);
    const date = lastTemp.date ? moment(lastTemp.date).toISOString() : '';
    const sensorName = sensor.name || sensor.sensorId;

    let breach = null;
    if (wantsAbove && value > Number(sensor.maxTemp)) {
      breach = { direction: 'above', threshold: Number(sensor.maxTemp) };
    } else if (wantsBelow && value < Number(sensor.minTemp)) {
      breach = { direction: 'below', threshold: Number(sensor.minTemp) };
    }

    if (!breach) {
      continue;
    }

    const cooldownKey = `${locationId}:${sensor.sensorId}:${breach.direction}:${email}`;
    if (isCooldownActive(lastSentMap, cooldownKey, cooldownMinutes, now)) {
      continue;
    }

    logger.log(
      `[Notificator service] Sensor ${sensorName} ${breach.direction} threshold ${breach.threshold} (value ${value}) -> ${email}`,
    );
    const mail = buildThresholdEmail(locationName, sensorName, breach.direction, value, breach.threshold, date);
    await sendEmail(email, mail.subject, mail);
    lastSentMap[cooldownKey] = new Date();
  }
};

export { processLocationThresholds };
