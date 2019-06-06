import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photos } from './photo.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photos)
    private readonly photoRepository: Repository<Photos>,
  ) {}

  async findAll(): Promise<Photos[]> {
    return await this.photoRepository.find();
  }
}
