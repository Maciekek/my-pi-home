import { Module } from '@nestjs/common';
import {CronService} from "./cron.service";
import {HeartbeatModule} from "../heartbeat/heartbeat.module";

@Module({
    imports: [HeartbeatModule],
    providers: [CronService],
})

export class CronModule {}
