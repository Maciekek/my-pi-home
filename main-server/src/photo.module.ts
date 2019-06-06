import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photos } from './photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photos])],
  providers: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
