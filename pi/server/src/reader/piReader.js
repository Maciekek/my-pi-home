const ds18b20 = require('ds18b20');

const Reader = {
    sensorNames: [],
    getValues: () => {
	console.log(Reader.sensorNames)
        return Reader.sensorNames.map((sensorName) => {
		console.log(ds18b20.temperatureSync(sensorName))
            return {id: sensorName, value: ds18b20.temperatureSync(sensorName)};
        })
    },
    getSensorNames: () => {
        ds18b20.sensors((err, ids) => {
		console.log(ids)
		Reader.sensorNames = ids;
console.log(Reader.sensorNames);
        })
    },

};

Reader.getSensorNames();
console.log(Reader.sensorNames);

setTimeout(()=> Reader.getValues(),500);
module.exports = Reader;
