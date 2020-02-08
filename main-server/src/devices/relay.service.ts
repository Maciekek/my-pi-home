import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {RelayDevice} from "./interfaces/relayDevice.interface";
import { Model } from 'mongoose';
import {EventsGateway} from "../events/events.gateway";
import {DevicesService} from './devices.service';

function uuidv4() {
    // tslint:disable-next-line
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        // tslint:disable-next-line
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

@Injectable()
export class RelayService {
    constructor(@InjectModel('Devices') private readonly relayDevice: Model<RelayDevice>,
                private readonly ws: EventsGateway,
                private readonly devicesService: DevicesService) {}

    private readonly logger = new Logger(RelayService.name);

    async relayToggleCall(relayId: string): Promise<void> {
        this.logger.log(`Relay toggle: ${relayId}`);
        const relayData = await this.relayDevice.findOne({_id: relayId});

        const state = relayData.state === '0' ? '1' : '0';

        const actionUrl = `http://${relayData.ip}/control?cmd=GPIO,${relayData.gpio},${state}`;
        return this.ws.emit('action', {id: uuidv4(), url: actionUrl}).then((data: any) => {
            const response =  JSON.parse((data).response);
            this.logger.log(`Received response ${JSON.stringify(data)}`);

            return this.devicesService.updateRelayDevice(relayData, {state});
        });

    }
}
