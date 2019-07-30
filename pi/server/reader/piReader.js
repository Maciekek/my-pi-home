const ds18b20 = require('ds18b20');

const Reader = {
	sensorNames: [],
	getValues: () => {
		console.log(sensorNames.map((sensorName) => { 
	              	return {id: sensorName, value: ds18b20.temperatureSync(sensorName, {parser: 'hex'})};
		}))
	},
	getSensorNames: () => {
		ds18b20.sensors((err, ids) => {
				sensorNames = ids;
				Reader.getValues();
			})
	},



//    getValue: () => {
  //      return ds18b20.temperatureSync('28-0000061ba8e4',{parser: 'hex'});
    //}
};

Reader.getSensorNames();

module.exports = Reader;
