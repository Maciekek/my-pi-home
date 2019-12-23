import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Temp} from "./interfaces/temp.interface";
import {TempsService} from "./temps.service";
import {AddTempDto} from "./dto/add-temp.dto";
import {SensorsService} from "./sensors.service";

@Controller('/sensors')
export class SensorsController {
    constructor(private readonly sensorsService: SensorsService) {}

    @Post(':locationId')
    async findLastN(@Param('locationId') locationId: string, @Body() body: any): Promise<any> {
        console.log(`[SensorsController]:findLastN`, body);
        return this.sensorsService.findSensors(locationId, body);
    }

}