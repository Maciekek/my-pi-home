import { Controller, Get, Query } from '@nestjs/common';
import { AddTempDto } from '../temps/dto/add-temp.dto';
import { TempsService } from '../temps/temps.service';

@Controller('/esp')
export class EspController {
  constructor(private readonly tempsService: TempsService) {}

  @Get('/ds18b20')
  async findAll(@Query() params): Promise<string> {
    const test = new AddTempDto();
    test.locationId = params.locationId;
    test.sensorId = `${params.task}:_:${params.valuename}`;
    test.value = params.value;

    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    test.date = date.toISOString();

    this.tempsService.addTemp(test);
    return new Promise<string>((resolve) => {
      return resolve('sukces');
    });
  }
}
