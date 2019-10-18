import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";

import {EspController} from "./esp.controller";
import {EspService} from "./esp.service";
import {TempsService} from "../temps/temps.service";
import {TempSchema} from "../temps/temp.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Temp', schema: TempSchema }])],
    controllers: [EspController],
    providers: [TempsService],
})
export class EspModule {}
