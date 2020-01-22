import { Injectable, Logger } from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {CronJob} from "../cron/interfaces/cronJob";
import {LocationsService} from "../../locations/locations.service";
import {TempsService} from "../../temps/temps.service";
import {SlackService} from "../slack/slack.service";

@Injectable()
export class HeartbeatService implements CronJob {
    private readonly logger = new Logger(HeartbeatService.name);

    constructor(private readonly locations: LocationsService,
                private readonly tempService: TempsService,
                private readonly slackService: SlackService) {

    }

    run = () => {
        this.logger.log('task run');

        this.locations.findAll().then((tes) => {
            console.log(tes);

            return this.tempService.findLastN('5d824e39838cc11c480b3630', 1);

        }).then((a) => {
            console.log(a);
            this.slackService.sendMessage(a);
        });
        console.log(this.slackService.slackApi.admin);
        return {};
    }

}
