const config = require('./src/readConfig');

const piReader = require('./src/reader/reader');
const tempsService = require('./src/services/tempServices');
const wifiLinkService = require('./src/services/wifiLinkService');
const websocketManager = require('./websocketManager');

const MAX_TEMP = 60;
const MIN_TEMP = -30;

class Main {
  constructor() {
    this.readAndSendData = this.readAndSendData.bind(this);
    this.sendWifiData = this.sendWifiData.bind(this);
    this.readAndSendData();
    this.sendWifiData();

    setInterval(this.readAndSendData, 360000);
    setInterval(this.sendWifiData, 60000);
    websocketManager.connect();
  }

  readAndSendData() {
    const readDate = new Date();

    piReader.getValues().map((temp) => {
      const tempObject = {
        value: this.prepareTemps(temp.value),
        date: readDate,
        locationId: config.locationId || undefined,
        sensorId: temp.id,
      };

      tempsService.addNewTemps(tempObject);
    });
  }

  async sendWifiData() {
    const wifiLinkMetrics = await wifiLinkService.getLinkMetrics();
    const readDate = new Date();
    this.sendWifiMetrics(wifiLinkMetrics, readDate);
  }

  sendWifiMetrics(metrics, date) {
    const readings = [
      { sensorId: 'wifi_signal_dbm', value: metrics.wifiSignalDbm },
      { sensorId: 'wifi_tx_bitrate_mbps', value: metrics.wifiTxBitrateMbps },
      { sensorId: 'wifi_rx_bitrate_mbps', value: metrics.wifiRxBitrateMbps },
    ];

    readings.forEach((reading) => {
      if (typeof reading.value !== 'number') {
        return;
      }

      tempsService.addNewTemps({
        value: reading.value,
        date,
        locationId: config.locationId || undefined,
        sensorId: reading.sensorId,
      });
    });
  }

  prepareTemps(value) {
    if (value > MAX_TEMP) {
      return MAX_TEMP;
    }

    if (value < MIN_TEMP) {
      return MIN_TEMP;
    }

    return value;
  }
}

setTimeout(() => {
  const main = new Main();
}, 1000);
