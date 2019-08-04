const ds18b20 = require('ds18b20');

const Reader = {
    sensorNames: [],
    getValues: () => {
        return Reader.sensorNames.map((sensorName) => {
            return {id: sensorName, value: Math.random()*100};
        })
    },
    getSensorNames: () => {
        ds18b20.sensors((err, ids) => {
            Reader.sensorNames = ['28-0000061ba8e4', '28-0000061ba8e5'];
            console.log(Reader.getValues());
        })
    },

};

Reader.getSensorNames();

module.exports = Reader;
