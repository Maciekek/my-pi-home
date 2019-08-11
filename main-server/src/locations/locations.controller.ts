import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {Location} from "./interfaces/location.interface";
import {LocationsService} from "./locations.service";
import {AddLocationDto} from "./dto/add-location.dto";
import {SetTempSettingsDto} from "./dto/set-temp-settings.dto";
import set = Reflect.set;

@Controller('/locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Post()
    async addTemp(@Body() addLocationDto: AddLocationDto): Promise<Location> {
        return this.locationsService.addTemp(addLocationDto);
    }

    @Get()
    async findAll(): Promise<Location[]> {
        return this.locationsService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Location> {
        return this.locationsService.findById(id);
    }

    @Put(':id/tempSettings')
    async setTempSettings(@Param('id') id: string, @Body() setTempSettings: SetTempSettingsDto): Promise<any> {
        return this.locationsService.setTempSettings(id, setTempSettings);
    }

}
