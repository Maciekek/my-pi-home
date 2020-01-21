import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {TempSchema} from "./temp.schema";
import { TempsController } from './temps.controller';
import {TempsService} from "./temps.service";
import {SensorsController} from "./sensors.controller";
import {SensorsService} from "./sensors.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Temp', schema: TempSchema }])],
    controllers: [TempsController, SensorsController],
    providers: [TempsService, SensorsService],
    exports: [TempsService],
})
export class TempsModule {}
