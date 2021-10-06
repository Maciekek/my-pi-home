import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Location } from './interfaces/location.interface';
import { LocationsService } from './locations.service';
import { AddLocationDto } from './dto/add-location.dto';

@Controller('/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async addLocation(@Body() addLocationDto: AddLocationDto): Promise<Location> {
    return this.locationsService.addLocation(addLocationDto);
  }

  @Put(':id')
  async updateLocation(@Param('id') id: string, @Body() addLocationDto: AddLocationDto): Promise<Location> {
    return this.locationsService.updateLocation(id, addLocationDto);
  }

  @Get()
  async findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Location> {
    return this.locationsService.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<Location> {
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
