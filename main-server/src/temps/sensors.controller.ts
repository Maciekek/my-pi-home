import {Body, Controller, Get, Logger, Param, Post} from '@nestjs/common';
import { Temp } from './interfaces/temp.interface';
import { TempsService } from './temps.service';
import { AddTempDto } from './dto/add-temp.dto';
import { SensorsService } from './sensors.service';

@Controller('/sensors')
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);

  constructor(private readonly sensorsService: SensorsService) {}

  @Post(':locationId')
  async findLastN(@Param('locationId') locationId: string, @Body() body: any): Promise<any> {
    this.logger.log(`[SensorsController]:find date range `, body);
    return this.sensorsService.findSensors(locationId, body);
  }
}
