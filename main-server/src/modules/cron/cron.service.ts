import { Injectable, Logger } from '@nestjs/common';
import {Cron, Interval} from '@nestjs/schedule';
import {HeartbeatService} from "../heartbeat/heartbeat.service";

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(private readonly heartbeatService: HeartbeatService) {

    }

    @Interval(10000)
    handleCron() {
        this.heartbeatService.run();
        this.logger.debug('Called cron task');
    }

}
