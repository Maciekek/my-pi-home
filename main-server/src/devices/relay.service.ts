import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {RelayDevice} from "./interfaces/relayDevice.interface";
import { Model } from 'mongoose';
import {EventsGateway} from "../events/events.gateway";

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
    constructor(@InjectModel('Devices') private readonly relayDevice: Model<RelayDevice>, private readonly ws: EventsGateway) {}

    private readonly logger = new Logger(RelayService.name);

    async relayToggleCall(relayId: string): Promise<void> {
        this.logger.log(`Relay toggle: ${relayId}`);
        // return await this.relayDevice.find({locationId});
        const relayData = await this.relayDevice.findOne({_id: relayId});
        console.log(relayData);

        const actionUrl = `http://${relayData.ip}/control?cmd=GPIO,${relayData.gpio},0`;
        this.ws.emit('action', {id: uuidv4(), url: actionUrl}).then((a) => {
            console.log('uga buga koniec !!!', a);
        });

    }
}
