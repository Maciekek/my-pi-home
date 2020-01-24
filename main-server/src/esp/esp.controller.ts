import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {TempsService} from "../temps/temps.service";
import {AddTempDto} from "../temps/dto/add-temp.dto";
import moment from 'moment';

@Controller('/esp')
export class EspController {
    constructor(private readonly tempsService: TempsService) {}

    @Get('/ds18b20')
    async findAll(@Query() params): Promise<string> {
        const test = new AddTempDto();
        test.locationId = params.locationId;
        test.sensorId = `${params.task}:_:${params.valuename}`;
        test.value = params.value;

        // @ts-ignore
        test.date = moment().set('second', 0).set('milisecond', 0).toISOString();

        this.tempsService.addTemp(test);
        return new Promise<string>((suc) => {
            return suc("sukces");
        });
    }
}
