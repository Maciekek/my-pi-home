const sensor = require('node-dht-sensor').promises;

const createDHT22Reader = (pin) => {
    const read = async () => {
        try {
            const { temperature, humidity } = await sensor.read(22, pin);
            return {
                temperature: parseFloat(temperature.toFixed(2)),
                humidity: parseFloat(humidity.toFixed(2)),
            };
        } catch (error) {
            console.error('Failed to read from DHT22 sensor:', error);
            throw error;
        }
    };

    return { read };
};

module.exports = createDHT22Reader;