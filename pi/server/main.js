const config = require('./src/readConfig');

const piReader = require('./src/reader/reader');
const tempsService = require('./src/services/tempServices');
const websocketManager = require('./websocketManager');

const MAX_TEMP = 60;
const MIN_TEMP = -30;

class Main {
  constructor() {
    this.readAndSendData();

    setInterval(this.readAndSendData, 360000);
    websocketManager.connect();
  }

  readAndSendData() {
    piReader.getValues().map((temp) => {
      const tempObject = {
        value: this.prepareTemps(temp.value),
        date: new Date(),
        locationId: config.locationId || undefined,
        sensorId: temp.id,
      };

      tempsService.addNewTemps(tempObject);
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
