import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {RelayDeviceSchema} from "./devices.schema";
import {DevicesController} from "./devices.controller";
import {DevicesService} from "./devices.service";
import {RelayService} from "./relay.service";
import {EventsGateway} from "../events/events.gateway";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Devices', schema: RelayDeviceSchema}])],
    controllers: [DevicesController],
    providers: [DevicesService, RelayService, EventsGateway],
})
export class DevicesModule {}
