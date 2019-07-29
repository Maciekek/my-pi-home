import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {CatsModule} from './cats/cats.module';
import { TempsModule } from './temps/temps.module';
import {config} from 'node-config-ts';

console.log(config.dbConfig);


@Module({
  imports:
      [MongooseModule.forRoot(config.dbConfig.url),
        CatsModule,
        TempsModule,
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
