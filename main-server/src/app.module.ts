import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {CatsModule} from './cats/cats.module';
import { TempsModule } from './temps/temps.module';
import {config} from 'node-config-ts';
import {UsersModule} from "./users/users.module";
import {LocationsModule} from "./locations/locations.module";
import {EspModule} from "./esp/esp.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {EventsModule} from './events/events.module';

console.log(config.dbConfig);

@Module({
  imports:
      [MongooseModule.forRoot(config.dbConfig.url),
        CatsModule,
        TempsModule,
        UsersModule,
        LocationsModule,
          EspModule,
          DashboardModule,
        EventsModule,
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
