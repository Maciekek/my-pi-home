import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'node-config-ts';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { DevicesModule } from './devices/devices.module';
import { EspModule } from './esp/esp.module';
import { EventsModule } from './events/events.module';
import { LocationsModule } from './locations/locations.module';
import { CronModule } from './modules/cron/cron.module';
import { TempsModule } from './temps/temps.module';
import { UsersModule } from './users/users.module';

console.log(config.dbConfig);
console.log(config.dbConfig.url);
const dbConnectionString = config.dbConfig.url.replace('__auth__', process.env.DB_AUTH);

console.log(21, 'TO DZIAL!!');
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://maciekekAdmin:alibaba123)(*aaaqqq@77.55.217.143:27017/?authMechanism=DEFAULT'),
    ScheduleModule.forRoot(),
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
