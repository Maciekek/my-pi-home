import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';

import { DashboardsService } from './dashboards.service';
import { AddDashboardDto } from './dto/add-dashboard.dto';
import { Dashboard } from './interfaces/dashboard.interface';

@Controller('/dashboards')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardsService: DashboardsService) {}

  @Post(':id')
  async addLocation(@Param('id') locationId: string, @Body() dashboardConfig: AddDashboardDto): Promise<Dashboard> {
    return this.dashboardsService.addDashboard(locationId, dashboardConfig);
  }

  @Put(':id')
  async updateLocation(@Param('id') locationId: string, @Body() dashboardConfig: AddDashboardDto): Promise<Dashboard> {
    if (!this.dashboardsService.getDashboard(locationId)) {
      throw new HttpException(`DASHBOARD WITH ID ${locationId} not exist!`, HttpStatus.FORBIDDEN);
    }
    return this.dashboardsService.updateDashboard(locationId, dashboardConfig);
  }

  @Get(':id')
  async getDashboardByLocationId(@Param('id') id: string): Promise<Dashboard> {
    this.logger.log(`[getDashboardByLocationId]:getDashboardByLocationId ${id}`);
    return this.dashboardsService.getDashboard(id);
  }

  @Delete(':locationId/:widgetIndex')
  async deleteWidgetByIndex(
    @Param('locationId') locationId: string,
    @Param('widgetIndex') widgetIndex: number,
  ): Promise<Dashboard> {
    this.logger.log(`[getDashboardByLocationId]:deleteWidgetByIndex ${locationId} ${widgetIndex}`);
    return this.dashboardsService.removeWidgetByIndex(locationId, widgetIndex);
  }
}
