import { Model } from 'mongoose';
import {Injectable, Logger} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {RelayDevice} from "./interfaces/relayDevice.interface";
import {Dashboard} from "../dashboard/interfaces/dashboard.interface";

@Injectable()
export class DevicesService {
    constructor(@InjectModel('Devices') private readonly relayDevice: Model<RelayDevice>) {}
    private readonly logger = new Logger(DevicesService.name);

    async addRelayDevice(locationId: string, ip: string, gpio: string, type: string, name: string): Promise<RelayDevice> {
        this.logger.log("Add relay device " + locationId + ' ' + ip + ' ' + gpio + ' ' + type + ' ' + name);

        const newRelay = new this.relayDevice({locationId, ip, gpio, type, name, state: 0});
        return await newRelay.save();
    }

    async updateRelayDevice(relayDeviceData, newValue): Promise<any> {
        this.logger.log("Add relay device " + relayDeviceData);

        console.log('1', relayDeviceData);

        const updatedValue = {
            ...relayDeviceData,
            ...newValue,
        };
        const updateDashboard = new this.relayDevice(updatedValue);
        console.log('a', updateDashboard);
        //
        await this.relayDevice.findOneAndUpdate({_id: relayDeviceData._id},
          {$set: {state: newValue.state}});

        // return await this.relayDevice.findOne({_id: id});
        //
        // return await newRelay.save();
    }

    async getDevicesByLocationId(locationId: string): Promise<any> {
        return await this.relayDevice.find({locationId});
    }
}
