const Reader = {
    sensorNames: [],
    getValues: () => {
        return Reader.sensorNames.map((sensorName) => {
            return {id: sensorName, value: Math.random()*100};
        })
    },
    getSensorNames: () => {
        Reader.sensorNames = ['28-0000061ba8e4', '28-0000061ba8e5', '28-0000061ba8e6'];
    },

};

Reader.getSensorNames();

module.exports = Reader;
