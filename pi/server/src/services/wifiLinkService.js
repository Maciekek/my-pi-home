const { exec } = require('child_process');

const IW_LINK_COMMAND = 'iw dev wlan0 link | grep -E "signal|tx bitrate|rx bitrate"';

const wifiLinkService = {
  getLinkMetrics: () =>
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
    }),
};

module.exports = wifiLinkService;
