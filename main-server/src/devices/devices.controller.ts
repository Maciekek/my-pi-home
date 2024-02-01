import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { AddRelayDto } from './dto/add-relay.dto';
import { RelayDevice } from './interfaces/relayDevice.interface';
import { RelayService } from './relay.service';

@Controller('/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService, private readonly relayService: RelayService) {}

  @Post('relay/:id')
  async addRelay(@Param('id') locationId: string, @Body() relayDto: AddRelayDto): Promise<RelayDevice> {
    return this.devicesService.addRelayDevice(locationId, relayDto.ip, relayDto.gpio, relayDto.type, relayDto.name);
  }

  @Post('/:deviceId')
  async updateRelay(@Param('deviceId') deviceId: string, @Body() relayDto: AddRelayDto): Promise<RelayDevice> {
    return this.devicesService.updateWholeRelayDevice(deviceId, {
      ip: relayDto.ip,
      gpio: relayDto.gpio,
      type: relayDto.type,
      name: relayDto.name,
    });
  }

  @Get(':locationId/all')
  async getDevicesByLocationId(@Param('locationId') locationId: string): Promise<RelayDevice> {
    return this.devicesService.getDevicesByLocationId(locationId);
  }

  @Get('relay/:relayId/toggle')
  async relayToggle(@Param('relayId') relayId: string): Promise<void> {
    return this.relayService.relayToggleCall(relayId).then((data) => {
      return data;
    });
  }
}
