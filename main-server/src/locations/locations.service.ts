import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Location} from './interfaces/location.interface';
import {AddLocationDto} from "./dto/add-location.dto";

@Injectable()
export class LocationsService {
    constructor(@InjectModel('Location') private readonly locationModel: Model<Location>) {}

    async addLocation(addTempDto: AddLocationDto): Promise<Location> {
        const addedLocation = new this.locationModel(addTempDto);
        return await addedLocation.save();
    }

    async updateLocation(id: string, addTempDto: AddLocationDto): Promise<Location> {
        const addedLocation = new this.locationModel(addTempDto);

        return await this.locationModel.findOneAndUpdate({_id: id},
            {$set: {name: addedLocation.name, description: addedLocation.description, tempSettings: addedLocation.tempSettings}});
    }

// {name: addedLocation.name, description: addedLocation.description, tempSettings: addedLocation.tempSettings}

    async findAll(): Promise<Location[]> {
        return await this.locationModel.find().exec();
    }

    async findById(id: string): Promise<Location> {
        return await this.locationModel.findOne({_id: id});
    }
    //
    // async setTempSettings(id: string, tempSettingsDto: SetTempSettingsDto): Promise<Location> {
    //     const tempSettings = new this.locationModel(tempSettingsDto);
    //     console.log(tempSettings);
    //     return await this.locationModel.findOneAndUpdate({_id: id}, {tempSettings: tempSettings.tempSettings});
    // }
    //
    // async setSensorSettings(id: string, sensorSettingsDto: SetSensorSettingsDto): Promise<Location> {
    //     const sensorSettings = new this.locationModel(sensorSettingsDto);
    //
    //     console.log("sensorSetting 123 s", sensorSettings);
    //     console.log(id);
    //     return await this.locationModel.findOneAndUpdate({_id: id}, {sensorSettings: sensorSettings.sensorSettings});
    // }
}
