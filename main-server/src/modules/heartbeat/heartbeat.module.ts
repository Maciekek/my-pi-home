import { Module } from '@nestjs/common';
import {HeartbeatService} from "./heartbeat.service";
import {LocationsModule} from "../../locations/locations.module";
import {TempsModule} from "../../temps/temps.module";
import {SlackModule} from "../slack/slack.module";

@Module({
    imports: [LocationsModule, TempsModule, SlackModule],
    providers: [HeartbeatService],
    exports: [HeartbeatService],
})

export class HeartbeatModule {}
