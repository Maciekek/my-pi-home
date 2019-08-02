import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Location} from "./interfaces/location.interface";
import {LocationsService} from "./locations.service";
import {AddLocationDto} from "./dto/add-location.dto";

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

}
