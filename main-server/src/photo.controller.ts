import { Controller, Get } from '@nestjs/common';
import {PhotoService} from './photo.service';
import {Photos} from './photo.entity';

@Controller()
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get('/photo')
  getHello(): Promise<Photos[]> {
    return this.photoService.findAll();
  }
}
