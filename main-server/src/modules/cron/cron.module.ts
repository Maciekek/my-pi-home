import { Module } from '@nestjs/common';
import {CronService} from "./cron.service";
import {NotificatorModule} from "../notificator/notificator.module";

@Module({
    imports: [NotificatorModule],
    providers: [CronService],
})

export class CronModule {}
