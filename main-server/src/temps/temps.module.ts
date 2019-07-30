import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {TempSchema} from "./temp.schema";
import { TempsController } from './temps.controller';
import {TempsService} from "./temps.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Temp', schema: TempSchema }])],
    controllers: [TempsController],
    providers: [TempsService],
})
export class TempsModule {}
