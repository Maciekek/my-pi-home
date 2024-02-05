const ds18b20 = require('ds18b20');

const Reader = {
  sensorNames: [],
  getValues: () => {
    return Reader.sensorNames.map((sensorName) => {
      return { id: sensorName, value: ds18b20.temperatureSync(sensorName) };
    });
  },
  getSensorNames: () => {
    ds18b20.sensors((err, ids) => {
      Reader.sensorNames = ids;
    });
  },
};

Reader.getSensorNames();

setTimeout(() => Reader.getValues(), 500);
module.exports = Reader;
