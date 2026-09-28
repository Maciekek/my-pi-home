const { exec } = require('child_process');
const axios = require('axios');
const runtimeConfig = require('./readConfig');
const config = require('config');

const WIFI_REPORT_INTERVAL_MS = 60000;
const IW_LINK_COMMAND = 'iw dev wlan0 link | grep -E "signal|tx bitrate|rx bitrate"';
const apiUrl = config.get('api.url');

const getLinkMetrics = () =>
  new Promise((resolve) => {
    exec(IW_LINK_COMMAND, (error, stdout) => {
      if (error || !stdout) {
        resolve({});
        return;
      }

      const metrics = {};
      const lines = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      lines.forEach((line) => {
        const signalMatch = line.match(/^signal:\s*(-?\d+)\s*dBm$/i);
        if (signalMatch) {
          metrics.wifiSignalDbm = Number(signalMatch[1]);
          return;
        }

        const txMatch = line.match(/^tx bitrate:\s*([0-9.]+)\s*MBit\/s/i);
        if (txMatch) {
          metrics.wifiTxBitrateMbps = Number(txMatch[1]);
          return;
        }

        const rxMatch = line.match(/^rx bitrate:\s*([0-9.]+)\s*MBit\/s/i);
        if (rxMatch) {
          metrics.wifiRxBitrateMbps = Number(rxMatch[1]);
        }
      });

      resolve(metrics);
    });
  });

const postReading = (sensorId, value, date) => {
  const body = {
    value,
    date,
    locationId: runtimeConfig.locationId || undefined,
    sensorId,
  };

  return axios.post(`${apiUrl}/temps`, body).catch((error) => {
    console.log('wifi metrics send error', error.errno || error.response?.data || error.message);
  });
};

const sendWifiMetrics = async () => {
  const metrics = await getLinkMetrics();
  const date = new Date();
  const readings = [
    { sensorId: 'wifi_signal_dbm', value: metrics.wifiSignalDbm },
    { sensorId: 'wifi_tx_bitrate_mbps', value: metrics.wifiTxBitrateMbps },
    { sensorId: 'wifi_rx_bitrate_mbps', value: metrics.wifiRxBitrateMbps },
  ];

  await Promise.all(
    readings
      .filter((reading) => typeof reading.value === 'number')
      .map((reading) => postReading(reading.sensorId, reading.value, date))
  );
};

const startWifiMetricsReporter = () => {
  sendWifiMetrics().catch((error) => {
    console.log('wifi metrics reporter error', error.message);
  });

  setInterval(() => {
    sendWifiMetrics().catch((error) => {
      console.log('wifi metrics reporter error', error.message);
    });
  }, WIFI_REPORT_INTERVAL_MS);
};

if (require.main === module) {
  startWifiMetricsReporter();
}

module.exports = startWifiMetricsReporter;
