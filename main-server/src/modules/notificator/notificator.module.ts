import { Module } from '@nestjs/common';
import {NotificatorService} from "./notificator.service";
import {LocationsModule} from "../../locations/locations.module";
import {TempsModule} from "../../temps/temps.module";
import {SlackModule} from "../slack/slack.module";

@Module({
    imports: [LocationsModule, TempsModule, SlackModule],
    providers: [NotificatorService],
    exports: [NotificatorService],
})

export class NotificatorModule {}
