import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { AddLocationDto } from './dto/add-location.dto';
import { Location } from './interfaces/location.interface';
import { LocationsService } from './locations.service';

@Controller('/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Post()
  async addLocation(@Body() addLocationDto: AddLocationDto): Promise<Location> {
    return this.locationsService.addLocation(addLocationDto);
  }

  @Put(':id')
  async updateLocation(@Param('id') id: string, @Body() addLocationDto: AddLocationDto): Promise<Location> {
    return this.locationsService.updateLocation(id, addLocationDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Location> {
    return this.locationsService.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<DeleteResult> {
    return this.locationsService.deleteById(id);
  }

  // @Put(':id/tempSettings')
  // async setTempSettings(@Param('id') id: string, @Body() setTempSettings: SetTempSettingsDto): Promise<any> {
  //     return this.locationsService.setTempSettings(id, setTempSettings);
  // }

  // @Put(':id/sensorsSettings')
  // async setSensorsSettings(@Param('id') id: string, @Body() setSensorSettings: SetSensorSettingsDto): Promise<any> {
  //     console.log(setSensorSettings)
  //     return this.locationsService.setSensorSettings(id, setSensorSettings);
  // }
}
