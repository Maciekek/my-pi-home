import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(6, 'a');
    return 'Hello World with ❤️ from NestJS ️';
  }
}
