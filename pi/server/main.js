const piReader = require('./reader/reader');
const tempsService = require('./services/tempServices');


const LOCATION_ID = 1;

class Main {
    constructor() {
       this.readAndSendData();

       setInterval(this.readAndSendData, 360000)
    }

    readAndSendData() {
        const data = piReader.getValues().map(temp => {
            return {
                value: temp.value,
                date: new Date(),
                locationId: LOCATION_ID,
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




