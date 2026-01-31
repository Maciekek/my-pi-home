import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { AddLocationDto } from './dto/add-location.dto';
import { Location } from './interfaces/location.interface';

@Injectable()
export class LocationsService {
  constructor(@InjectModel('Location') private readonly locationModel: Model<Location>) {}

  private maskEmail = (email?: string): string | undefined => {
    if (!email || email.indexOf('@') === -1) {
      return email;
    }
    const [local, domain] = email.split('@');
    if (local.length <= 1) {
      return `*@${domain}`;
    }
    const visible = local.slice(0, 1);
    return `${visible}${'*'.repeat(Math.max(1, local.length - 1))}@${domain}`;
  };

  private maskLocationEmail = (location: any) => {
    if (!location) {
      return location;
    }
    const obj = location.toObject ? location.toObject() : location;
    if (obj.notificationSettings && obj.notificationSettings.email) {
      obj.notificationSettings.email = this.maskEmail(obj.notificationSettings.email);
    }
    return obj;
  };

  async addLocation(addTempDto: AddLocationDto): Promise<Location> {
    const addedLocation = new this.locationModel(addTempDto);
    return await addedLocation.save();
  }

  async updateLocation(id: string, addTempDto: AddLocationDto): Promise<Location> {
    const addedLocation = new this.locationModel(addTempDto);
    const existingLocation = await this.locationModel.findOne({ _id: id });
    const incomingSettings: any = addedLocation.notificationSettings || {};
    const existingSettings: any = existingLocation ? (existingLocation as any).notificationSettings : {};
    const incomingEmail = incomingSettings.email;

    if (typeof incomingEmail === 'string' && incomingEmail.indexOf('*') !== -1) {
      incomingSettings.email = existingSettings ? existingSettings.email : incomingEmail;
    } else if (typeof incomingEmail === 'undefined' && existingSettings && existingSettings.email) {
      incomingSettings.email = existingSettings.email;
    }

    return this.locationModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: addedLocation.name,
          description: addedLocation.description,
          tempSettings: addedLocation.tempSettings,
          notificationSettings: incomingSettings,
        },
      },
    );
  }

  async findAll(): Promise<Location[]> {
    const locations = await this.locationModel.find().exec();
    return locations.map((location) => this.maskLocationEmail(location));
  }

  async findAllRaw(): Promise<Location[]> {
    return this.locationModel.find().exec();
  }

  async findById(id: string): Promise<Location> {
    const location = await this.locationModel.findOne({ _id: id });
    return this.maskLocationEmail(location);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.locationModel.deleteOne({ _id: id });
  }
}
