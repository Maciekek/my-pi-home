import { Injectable, Logger } from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {CronJob} from "../cron/interfaces/cronJob";
import {LocationsService} from "../../locations/locations.service";
import {TempsService} from "../../temps/temps.service";
import {SlackService} from "../slack/slack.service";
import * as _ from 'lodash';
import {HeartbeatMemory} from "./heartbeatMemory";
import {logger} from "../../logger.middleware";
import * as moment from 'moment';
import {SensorsService} from "../../temps/sensors.service";

@Injectable()
export class HeartbeatService implements CronJob {
    private readonly logger = new Logger(HeartbeatService.name);

    heartbeatMemory: HeartbeatMemory;

    constructor(private readonly locations: LocationsService,
                private readonly tempService: TempsService,
                private readonly sensorsService: SensorsService,
                private readonly slackService: SlackService) {

        this.heartbeatMemory = new HeartbeatMemory();
        this.slackService.sendMessage("apka wystartowała!");

    }

    run = () => {
        this.logger.log('task run');
        const pMax = 50;
        const pMin = 40;

        const sMax = 40;
        const sMin = 30;

        const pID = '28-000006bee1fc';
        const sensors = {
            kal: '10-000802cbe042',
            pod: '10-000802d6d148',
            kot: '10-000802cbe825',
        };

        const trabkiLoction = this.locations.findById('5d83477c1d15b82553f8932f').then((data) => {
            console.log(data);
            return this.sensorsService.findAllSensorsYoungerthan((data as any)._id, moment().subtract(20, "minutes").toDate());
        }).then((temps) => {
            const pData = _.find(temps, ['sensorId', pID]);
            const kalData = _.find(temps, ['sensorId', sensors.kal]);
            const podData = _.find(temps, ['sensorId', sensors.pod]);
            const kotData = _.find(temps, ['sensorId', sensors.kot]);
            this.logger.log(`piec temp ${pData.value}` );
            this.logger.log(`kaloryfery temp ${kalData.value}` );
            this.logger.log(`podlogowka temp ${podData.value}` );
            this.logger.log(`podlogowka temp ${podData.value}` );
            this.logger.log(`kotlownia temp ${kotData.value}` );

            if (pData.value > pMax) {
                this.slackService.sendMessage(`\n\n TEMPERATURA PIECA JEST ZA WYSOKA! \n\n AKTUALNA TEMPERATURA PIECA: *${pData.value}* \n\n\n\n
                    \n\n Pozostałe odczyty: \n
                    KALORYFERY: ${kalData.value} \n
                    PODŁOGÓWKA: ${podData.value} \n
                    KOTŁOWNIA: ${kotData.value}`);
            }

            if (pData.value < pMin) {
                this.slackService.sendMessage(`\n\n TEMPERATURA JEST ZA NISKA! \n\n AKTUALNA TEMPERATURA PIECA: *${pData.value}* \n\n\n\n
                    \n\n Pozostałe odczyty: \n
                    KALORYFERY: ${kalData.value} \n
                    PODŁOGÓWKA: ${podData.value} \n
                    KOTŁOWNIA: ${kotData.value}`);
            }

            if (kalData.value < sMin || podData.value < sMin) {
                this.slackService.sendMessage(`\n\n TEMPARATURA PODŁOGOWKI ALBO KALORYFEROW JEST ZA NISKA! \n PIEC: *${pData.value}* \n\n\n\n
                \n\n Pozostałe odczyty: \n
                KALORYFERY: ${kalData.value} \n
                PODŁOGÓWKA: ${podData.value} \n
                KOTŁOWNIA: ${kotData.value}`);
            }

            if (kalData.value > sMax || podData.value > sMax) {
                this.slackService.sendMessage(`\n\n TEMPARATURA PODŁOGOWKI ALBO KALORYFEROW JEST ZA WYSOKA! \n PIEC: *${pData.value}* \n\n\n\n
                \n\n Pozostałe odczyty: \n
                KALORYFERY: ${kalData.value} \n
                PODŁOGÓWKA: ${podData.value} \n
                KOTŁOWNIA: ${kotData.value}`);
            }

            // this.slackService.sendMessage(`\n\n  AKTUALNA TEMPERATURA PIECA: *${pData.value}* \n\n\n\n
            //         \n\n Pozostałe odczyty: \n
            //         KALORYFERY: ${kalData.value} \n
            //         PODŁOGÓWKA: ${podData.value} \n
            //         KOTŁOWNIA: ${kotData.value}`);
        });

        // const lastResultsPromises = this.locations.findAll().then((locations) => {
        //     const locationLastResultPromises = locations.map((location) => {
        //         return this.sensorsService.findAllSensorsYoungerthan((location as any)._id, moment().subtract(10, "months").toDate());
        //     });
        //
        //     return locationLastResultPromises;
        //

        // });
        //
        // lastResultsPromises.then((a) => {
        //     Promise.all(a).then(results => {
        //         console.log('reslts, ', results);
        //         this.analyzeAllResults(results);
        //     });
        // });
    }

    analyzeAllResults = (results) => {
        this.logger.log(results);

        const resultsByLocationId = _.groupBy(_.flatMap(results), 'locationId');
        this.logger.log(resultsByLocationId);

        const allLocations = Object.keys(resultsByLocationId);

        allLocations.map(locationId => {
           // console.log(locationId, resultsByLocationId[locationId]);
           const newestDate = _.sortBy(resultsByLocationId[locationId], [(result) => moment((result as any).date).unix()]);
           this.logger.log(_.uniqBy(newestDate, 'sensorId'));

        });
    }

}
