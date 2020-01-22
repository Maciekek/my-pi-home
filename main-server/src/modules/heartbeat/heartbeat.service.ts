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

    }

    run = () => {
        this.logger.log('task run');

        const lastResultsPromises = this.locations.findAll().then((locations) => {
            const locationLastResultPromises = locations.map((location) => {
                return this.sensorsService.findAllSensorsYoungerthan((location as any)._id, moment().subtract(10, "months").toDate());
            });

            return locationLastResultPromises;

        });

        lastResultsPromises.then((a) => {
            Promise.all(a).then(results => {
                console.log('reslts, ', results);
                this.analyzeAllResults(results);
            });
        });
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
