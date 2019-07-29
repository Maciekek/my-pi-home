const ds18b20 = require('ds18b20');

const Reader = {
    getValue: () => {
        return ds18b20.temperatureSync('28-0000061ba8e4',{parser: 'hex'});
    }
};
Reader.getValue();

module.exports = Reader;
