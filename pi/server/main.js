const config = require("./src/readConfig");

const piReader = require('./src/reader/reader');
const tempsService = require('./src/services/tempServices');

class Main {
    constructor() {
       this.readAndSendData();
       console.log(config.locationId)
       setInterval(this.readAndSendData, 360000)
    }

    readAndSendData() {
        const data = piReader.getValues().map(temp => {
            return {
                value: temp.value,
                date: new Date(),
                locationId: config.locationId || undefined,
                sensorId: temp.id,
            }
        });

        data.map(singledata => {
            tempsService.addNewTemps(singledata);
        })
    }
}
setTimeout(() => {
    const main = new Main();
}, 1000);




