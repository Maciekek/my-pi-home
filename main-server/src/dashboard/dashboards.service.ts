import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Dashboard} from "./interfaces/dashboard.interface";
import {AddDashboardDto} from "./dto/add-dashboard.dto";

@Injectable()
export class DashboardsService {
    constructor(@InjectModel('Dashboard') private readonly dashboardModel: Model<Dashboard>) {}

    async addDashboard(id: string, dashboard: AddDashboardDto): Promise<Dashboard> {
        console.log(`[DashboardsService]:addDashboard ${id}, ${JSON.stringify(dashboard)}`);
        const addedDashboard = new this.dashboardModel(dashboard);
        return await addedDashboard.save();
    }

    async updateDashboard(id: string, dashboard: AddDashboardDto): Promise<Dashboard> {
        console.log(`[DashboardsService]:updateDashboard ${id}, ${JSON.stringify(dashboard)}`);
        const addedDashboard = new this.dashboardModel(dashboard);

        await this.dashboardModel.findOneAndUpdate({locationId: id},
            {$set: {locationId: id, config: addedDashboard.config}});

        return await this.dashboardModel.findOne({locationId: id});
    }

    async getDashboard(id: string): Promise<Dashboard> {
        return await this.dashboardModel.findOne({locationId: id});
    }

    async removeWidgetByIndex(locationId: string, widgetIndex: number): Promise<Dashboard> {
        const dashboad = await this.dashboardModel.findOne({locationId});
        const parsedConfig = JSON.parse(dashboad.config);

        parsedConfig.splice(widgetIndex, 1);

        await this.dashboardModel.findOneAndUpdate({locationId},
            {$set: {locationId, config: JSON.stringify(parsedConfig)}});

        return await this.dashboardModel.findOne({locationId});
    }

}
