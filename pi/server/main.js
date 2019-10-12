const config = require("./src/readConfig");

const piReader = require('./src/reader/reader');
const tempsService = require('./src/services/tempServices');
const wifiTempsService = require('./src/services/wifiTempService');

const MAX_TEMP = 60;
const MIN_TEMP = -30;

class Main {
    constructor() {
        this.readAndSendData();
        console.log(config.locationId);
        this.readAndSendData = this.readAndSendData.bind(this);

       setInterval(this.readAndSendData, 360000);
    }

    readAndSendData() {
        piReader.getValues().map(temp => {
            const tempObject = {
                value: this.prepareTemps(temp.value),
                date: new Date(),
                locationId: config.locationId || undefined,
                sensorId: temp.id,
            };

            tempsService.addNewTemps(tempObject);
        });

        if(config.wifiTemps.ip) {
            wifiTempsService.getTempsByIp(config.wifiTemps.ip).then((temps) => {
                temps.map(temp => {
                    const tempObject = {
                        value: this.prepareTemps(temp.value),
                        date: new Date(),
                        locationId: config.locationId || undefined,
                        sensorId: temp.id,
                    };
                    tempsService.addNewTemps(tempObject);
                    console.log(tempObject);
                });
            })
        }
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




