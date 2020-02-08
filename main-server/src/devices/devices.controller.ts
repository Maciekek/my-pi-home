import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put} from '@nestjs/common';
import {DevicesService} from "./devices.service";
import {AddRelayDto} from "./dto/add-relay.dto";
import {RelayDevice} from "./interfaces/relayDevice.interface";
import {RelayService} from "./relay.service";

@Controller('/devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService, private readonly relayService: RelayService) {}

    @Post('relay/:id')
    async addRelay(@Param('id') locationId: string, @Body() relayDto: AddRelayDto): Promise<RelayDevice> {
        return this.devicesService.addRelayDevice(locationId, relayDto.ip, relayDto.gpio, relayDto.type, relayDto.name);
    }

    @Get(':locationId/all')
    async getDevicesByLocationId(@Param('locationId') locationId: string): Promise<RelayDevice> {
        return this.devicesService.getDevicesByLocationId(locationId);
    }
// /api/devices/relay/5e3e9bf0a174e3091832e8fa/toggle
    @Get('relay/:relayId/toggle')
    async relayToggle(@Param('relayId') relayId: string): Promise<void> {
        this.relayService.relayToggleCall(relayId);
    }

//    api/devices/relay/5e3e9bf0a174e3091832e8fa/toggle

}
