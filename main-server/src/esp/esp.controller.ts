import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {TempsService} from "../temps/temps.service";
import {AddTempDto} from "../temps/dto/add-temp.dto";

@Controller('/esp')
export class EspController {
    constructor(private readonly tempsService: TempsService) {}

    @Get('/ds18b20')
    async findAll(@Query() params): Promise<string> {
        console.log('qwe');
        console.log(params);
        const test = new AddTempDto();
        test.locationId = params.locationId;
        test.sensorId = params.valuename;
        test.value = params.value;

        this.tempsService.addTemp(test);
        return new Promise<string>((suc) => {
            return suc("sukces");
        });
    }
}
