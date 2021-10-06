import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Temp } from './interfaces/temp.interface';
import { AddTempDto } from './dto/add-temp.dto';

@Injectable()
export class TempsService {
  constructor(@InjectModel('Temp') private readonly tempModel: Model<Temp>) {}

  async addTemp(addTempDto: AddTempDto): Promise<Temp> {
    console.log(addTempDto);
    const addedTemp = new this.tempModel(addTempDto);
    return await addedTemp.save();
  }

  async findAll(): Promise<Temp[]> {
    return await this.tempModel.find().exec();
  }

  async findLastN(locationId, n): Promise<Temp[]> {
    return await this.tempModel
      .find({ locationId })
      .sort({ date: -1 })
      .limit(Number(n))
      .exec();
  }
}
