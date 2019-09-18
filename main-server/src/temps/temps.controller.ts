import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Temp} from "./interfaces/temp.interface";
import {TempsService} from "./temps.service";
import {AddTempDto} from "./dto/add-temp.dto";

@Controller('/temps')
export class TempsController {
    constructor(private readonly tempsService: TempsService) {}

    @Post()
    async addTemp(@Body() addTempDto: AddTempDto): Promise<Temp> {
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
