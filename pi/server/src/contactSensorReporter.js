const { execFile } = require('child_process');
const { apiClient } = require('./services/apiClient');
const runtimeConfig = require('./readConfig');
const config = require('config');

// Reed switch wired GPIO -> GND with internal pull-up:
// magnet present -> contact closed -> "lo"; magnet away -> open -> "hi".
const POLL_INTERVAL_MS = 100;
const STABLE_MS = 200;
const RETRY_INTERVAL_MS = 5000;
const HEARTBEAT_INTERVAL_MS = 10 * 60 * 1000;
const SETTINGS_REFRESH_INTERVAL_MS = 60 * 1000;

const apiUrl = config.get('api.url');
// Sensors (sensorId, name, gpio) are configured per location in the web app settings.
let sensors = [];
let hasLoadedSettings = false;

const pinctrl = (args) =>
  new Promise((resolve, reject) => {
    execFile('pinctrl', args, (error, stdout) => (error ? reject(error) : resolve(stdout)));
  });

// "17: ip    pu | hi // GPIO17 = input" -> { 17: 'hi' }
const readLevels = async () => {
  const stdout = await pinctrl(['get', sensors.map((sensor) => sensor.gpio).join(',')]);
  const levels = {};

  stdout.split('\n').forEach((line) => {
    const match = line.match(/^\s*(\d+):.*\|\s*(hi|lo)\b/);
    if (match) {
      levels[match[1]] = match[2];
    }
  });

  return levels;
};

const postState = (sensor) => {
  const body = {
    locationId: runtimeConfig.locationId,
    sensorId: sensor.id,
    name: sensor.name,
    isOpen: sensor.state.isOpen,
    date: sensor.state.date,
  };

  return apiClient
    .post(`${apiUrl}/contacts`, body)
    .then(() => {
      console.log(`[contact] ${sensor.id} sent: ${body.isOpen ? 'open' : 'closed'}`);
      sensor.unsent = false;
    })
    .catch((error) => {
      console.log('[contact] send error', error.errno || error.response?.data || error.message);
      sensor.unsent = true;
    });
};

const isValidGpio = (gpio) => Number.isInteger(gpio) && gpio >= 2 && gpio <= 27;

const refreshSensors = async () => {
  const response = await apiClient.get(`${apiUrl}/locations/${runtimeConfig.locationId}`);
  const contactSettings = response.data && response.data.contactSettings;
  const configured = ((contactSettings && contactSettings.sensors) || [])
    .map((sensor) => ({ id: sensor.sensorId, name: sensor.name, gpio: Number(sensor.gpio) }))
    .filter((sensor) => sensor.id && isValidGpio(sensor.gpio));

  const next = [];
  for (const sensor of configured) {
    const existing = sensors.find((current) => current.id === sensor.id && current.gpio === sensor.gpio);
    if (existing) {
      existing.name = sensor.name;
      next.push(existing);
      continue;
    }

    await pinctrl(['set', String(sensor.gpio), 'ip', 'pu']);
    console.log(`[contact] watching ${sensor.id} (${sensor.name}) on GPIO${sensor.gpio}`);
    next.push(sensor);
  }

  sensors
    .filter((current) => !next.includes(current))
    .forEach((removed) => console.log(`[contact] stopped watching ${removed.id} on GPIO${removed.gpio}`));

  if (!next.length && (sensors.length || !hasLoadedSettings)) {
    console.log(`[contact] no contact sensors configured for location ${runtimeConfig.locationId}`);
  }

  hasLoadedSettings = true;
  sensors = next;
};

const poll = async () => {
  if (!sensors.length) {
    return;
  }

  const levels = await readLevels();
  const now = Date.now();

  sensors.forEach((sensor) => {
    const level = levels[sensor.gpio];
    if (!level) {
      return;
    }

    if (level !== sensor.candidate) {
      sensor.candidate = level;
      sensor.candidateSince = now;
    }

    const isStable = now - sensor.candidateSince >= STABLE_MS;
    const isOpen = sensor.candidate === 'hi';

    if (isStable && (!sensor.state || sensor.state.isOpen !== isOpen)) {
      sensor.state = { isOpen, date: new Date(sensor.candidateSince) };
      console.log(`[contact] ${sensor.id} -> ${isOpen ? 'open (hi)' : 'closed (lo)'}`);
      postState(sensor);
    }
  });
};

const startContactSensorReporter = () => {
  console.log(`[contact] reporter started, settings from ${apiUrl}/locations/${runtimeConfig.locationId}`);
  const refresh = () =>
    refreshSensors().catch((error) =>
      console.log('[contact] settings refresh error, keeping previous sensors', error.errno || error.message),
    );
  refresh();
  setInterval(refresh, SETTINGS_REFRESH_INTERVAL_MS);

  const loop = () =>
    poll()
      .catch((error) => console.log('[contact] read error', error.message))
      .finally(() => setTimeout(loop, POLL_INTERVAL_MS));
  loop();

  setInterval(() => {
    sensors.filter((sensor) => sensor.unsent && sensor.state).forEach(postState);
  }, RETRY_INTERVAL_MS);

  // Server ignores unchanged states, so this only recovers events lost while it was unreachable.
  setInterval(() => {
    sensors.filter((sensor) => sensor.state).forEach(postState);
  }, HEARTBEAT_INTERVAL_MS);
};

if (require.main === module) {
  startContactSensorReporter();
}

module.exports = startContactSensorReporter;
