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

    async findAll(): Promise<Location[]> {
        return await this.locationModel.find().exec();
    }

    async findById(id: string): Promise<Location> {
        return await this.locationModel.findOne({_id: id});
    }
}
