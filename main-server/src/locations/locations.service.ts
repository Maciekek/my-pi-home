import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { AddLocationDto } from './dto/add-location.dto';
import { Location } from './interfaces/location.interface';

@Injectable()
export class LocationsService {
  constructor(@InjectModel('Location') private readonly locationModel: Model<Location>) {}

  async addLocation(addTempDto: AddLocationDto): Promise<Location> {
    const addedLocation = new this.locationModel(addTempDto);
    return await addedLocation.save();
  }

  async updateLocation(id: string, addTempDto: AddLocationDto): Promise<Location> {
    const addedLocation = new this.locationModel(addTempDto);

    return this.locationModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: addedLocation.name,
          description: addedLocation.description,
          tempSettings: addedLocation.tempSettings,
          notificationSettings: addedLocation.notificationSettings,
        },
      },
    );
  }

  async findAll(): Promise<Location[]> {
    return await this.locationModel.find().exec();
  }

  async findById(id: string): Promise<Location> {
    return this.locationModel.findOne({ _id: id });
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.locationModel.deleteOne({ _id: id });
  }
}
