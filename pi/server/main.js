const config = require("./src/readConfig");

const piReader = require('./src/reader/reader');
const tempsService = require('./src/services/tempServices');

const MAX_TEMP = 60;
const MIN_TEMP = -30;

class Main {
    constructor() {
        this.readAndSendData();
        console.log(config.locationId);

        setInterval(this.readAndSendData, 360000)
    }

    readAndSendData() {
        const data = piReader.getValues().map(temp => {
            return {
                value: this.prepareTemps(temp.value),
                date: new Date(),
                locationId: config.locationId || undefined,
                sensorId: temp.id,
            }
        });

        data.map(singledata => {
            tempsService.addNewTemps(singledata);
        })
    }

    prepareTemps(value) {
        if (value > MAX_TEMP) {
            return MAX_TEMP;
        }

        if (value < MIN_TEMP) {
            return MIN_TEMP;
        }

        return value.toFixed(2);
    }
}

setTimeout(() => {
    const main = new Main();
}, 1000);




