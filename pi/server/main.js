const config = require('./src/readConfig');

const ds18b20Reader = require('./src/ds18b20Reader/ds18b20Reader');
const tempsService = require('./src/services/tempServices');
const websocketManager = require('./websocketManager');
const createDHT22Reader = require('./src/dht22Reader/dht22Reader');

const MAX_TEMP = 60;
const MIN_TEMP = -30;

class Main {
  constructor() {    
    this.readAndSendData();
    setInterval(this.readAndSendData, 60000);
    websocketManager.connect();
  }

  readAndSendData = () => {
    ds18b20Reader.getValues().map((temp) => {
      const tempObject = {
        value: this.prepareTemps(temp.value),
        date: new Date(),
        locationId: config.locationId || undefined,
        sensorId: temp.id,
      };

      tempsService.addNewTemps(tempObject);
    });

    if(config.dht22) {
      config.dht22.map((dht22Config) => {
        createDHT22Reader(dht22Config.pin).read().then((data) => {
          const temp = {
            value: this.prepareTemps(data.temperature),
            date: new Date(),
            locationId: config.locationId || undefined,
            sensorId: `${dht22Config.namePrefix}-temp`,
          };
  
          tempsService.addNewTemps(temp);
  
          const hum = {
            value: data.humidity,
            date: new Date(),
            locationId: config.locationId || undefined,
            sensorId: `${dht22Config.namePrefix}-hum`,
          };
  
          tempsService.addNewTemps(hum);
  
        }).catch((err) => {
          console.error('Error reading DHT22 sensor:', err);
        });
      });
    }
  }

  prepareTemps = (value) => {
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
