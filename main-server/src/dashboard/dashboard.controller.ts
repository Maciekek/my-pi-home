import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put} from '@nestjs/common';

import {DashboardsService} from "./dashboards.service";
import {Dashboard} from "./interfaces/dashboard.interface";
import {AddDashboardDto} from "./dto/add-dashboard.dto";

@Controller('/dashboards')
export class DashboardController {
    constructor(private readonly dashboardsService: DashboardsService) {}

    @Post(':id')
    async addLocation(@Param('id') locationId: string, @Body() dashboardConfig: AddDashboardDto): Promise<Dashboard> {
        console.log(locationId)
        // if (this.dashboardsService.getDashboard(locationId)) {
        //     throw new HttpException(`DASHBOARD WITH ID ${locationId} already exist!`, HttpStatus.FORBIDDEN);
        // }
        return this.dashboardsService.addDashboard(locationId, dashboardConfig);
    }

    @Put(':id')
    async updateLocation(@Param('id') locationId: string, @Body() dashboardConfig: AddDashboardDto): Promise<Dashboard> {
        if (!this.dashboardsService.getDashboard(locationId)) {
            throw new HttpException(`DASHBOARD WITH ID ${locationId} already exist!`, HttpStatus.FORBIDDEN);
        }
        return this.dashboardsService.updateDashboard(locationId, dashboardConfig);
    }

    @Get(':id')
    async getDashboardByLocationId(@Param('id') id: string): Promise<Dashboard> {
        console.log(`[getDashboardByLocationId]:getDashboardByLocationId ${id}`);
        return this.dashboardsService.getDashboard(id);
    }
}
