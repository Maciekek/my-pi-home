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
import { ScheduleModule } from '@nestjs/schedule';
import {CronModule} from "./modules/cron/cron.module";
import {DevicesModule} from "./devices/devices.module";

console.log(config.dbConfig);
console.log(config.dbConfig.url);
const dbConnectionString = config.dbConfig.url.replace("__auth__", process.env.DB_AUTH);

@Module({
  imports:
      [
          MongooseModule.forRoot(dbConnectionString),
          ScheduleModule.forRoot(),
          CatsModule,
          TempsModule,
          UsersModule,
          LocationsModule,
          EspModule,
          DashboardModule,
          EventsModule,
          CronModule,
          DevicesModule,
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
