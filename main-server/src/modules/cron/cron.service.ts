import { Injectable, Logger } from '@nestjs/common';
import {Cron, Interval} from '@nestjs/schedule';
import {NotificatorService} from "../notificator/notificator.service";

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(private readonly notificatorService: NotificatorService) {}

    @Interval(360000)
    handleCron() {
        this.notificatorService.run();
        this.logger.debug('Called cron task - notification service - interval 36000');
    }


    @Cron('0 8 * * *')
    handleCronActiveJob() {
        this.notificatorService.sendActiveNotification();
        this.logger.debug('Called cron task - notification service - interval 36000');
    }



}
