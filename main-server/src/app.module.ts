import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
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
