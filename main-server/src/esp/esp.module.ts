import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TempSchema } from '../temps/temp.schema';
import { TempsService } from '../temps/temps.service';
import { EspController } from './esp.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Temp', schema: TempSchema }])],
  controllers: [EspController],
  providers: [TempsService],
})
export class EspModule {}
