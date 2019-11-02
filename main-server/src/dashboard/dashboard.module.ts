import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";

import {DashboardController} from "./dashboard.controller";
import {DashboardSchema} from "./dashboard.schema";
import {DashboardsService} from "./dashboards.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Dashboard', schema: DashboardSchema}])],
    controllers: [DashboardController],
    providers: [DashboardsService],
})
export class DashboardModule {}
