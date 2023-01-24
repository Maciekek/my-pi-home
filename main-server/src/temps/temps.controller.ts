import {Body, Controller, Get, Logger, Param, Post} from '@nestjs/common';
import { Temp } from './interfaces/temp.interface';
import { TempsService } from './temps.service';
import { AddTempDto } from './dto/add-temp.dto';

@Controller('/temps')
export class TempsController {
  private readonly logger = new Logger(TempsController.name);

  constructor(private readonly tempsService: TempsService) {}

  @Post()
  async addTemp(@Body() addTempDto: AddTempDto): Promise<Temp> {
    this.logger.log('POST [addTemp]');
    return this.tempsService.addTemp(addTempDto);
  }

  @Get()
  async findAll(): Promise<Temp[]> {
    return this.tempsService.findAll();
  }

  @Get(':n/:locationId')
  async findLastN(@Param('locationId') locationId: string, @Param('n') n: string): Promise<Temp[]> {
    return this.tempsService.findLastN(locationId, n);
  }
}
