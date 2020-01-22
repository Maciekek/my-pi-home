import { Injectable, Logger } from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {HeartbeatService} from "../heartbeat/heartbeat.service";

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(private readonly heartbeatService: HeartbeatService) {

    }

    @Cron('45 * * * * *')
    handleCron() {
        console.log('qwe');
        this.heartbeatService.run();
        this.logger.debug('Called when the second is 45');
    }

}
