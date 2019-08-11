const config = require("./src/readConfig");

const piReader = require('./src/reader/reader');
const tempsService = require('./src/services/tempServices');

class Main {
    constructor() {
       this.readAndSendData();
       console.log(config.locationId);

       tempsService.getLocationSettings(config.locationId).then((locationsResponse) => {
           console.log("asd", locationsResponse.data[0].tempSettings);
           console.log("asd", );
           const tempSettings = JSON.parse(locationsResponse.data[0].tempSettings.replace(new RegExp('\'', 'g'), '"'));
           console.log( tempSettings.interval)
           // setInterval(this.readAndSendData, tempSettings.interval)
       })
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




