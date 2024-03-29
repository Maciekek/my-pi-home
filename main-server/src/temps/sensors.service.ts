import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Temp } from './interfaces/temp.interface';
import { AddTempDto } from './dto/add-temp.dto';

@Injectable()
export class SensorsService {
  constructor(@InjectModel('Temp') private readonly tempModel: Model<Temp>) {}

  async findSensors(locationId, body: any): Promise<Temp[]> {
    return await this.tempModel
      .find({ locationId, sensorId: { $in: body.sensorIds }, date: { $gte: body.from, $lte: body.to } })
      .sort({ date: 1 })
      .exec();
  }

  async findAllSensorsYoungerthan(locationId, body: any): Promise<Temp[]> {
    return await this.tempModel
      .find({ locationId })
      .sort({ date: -1 })
      .limit(5)
      .exec();
  }
}
