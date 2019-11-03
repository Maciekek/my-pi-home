import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {TempsService} from "../temps/temps.service";
import {AddTempDto} from "../temps/dto/add-temp.dto";

@Controller('/esp')
export class EspController {
    constructor(private readonly tempsService: TempsService) {}

    @Get('/ds18b20')
    async findAll(@Query() params): Promise<string> {
        const test = new AddTempDto();
        test.locationId = params.locationId;
        test.sensorId = params.task;
        test.value = params.value;
        test.date = new Date().toISOString();

        this.tempsService.addTemp(test);
        return new Promise<string>((suc) => {
            return suc("sukces");
        });
    }
}
