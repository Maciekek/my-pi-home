import { Module } from '@nestjs/common';
import { LocationsModule } from '../../locations/locations.module';
import { TempsModule } from '../../temps/temps.module';
import { NotificatorService } from './notificator.service';

@Module({
  imports: [LocationsModule, TempsModule],
  providers: [NotificatorService],
  exports: [NotificatorService],
})
export class NotificatorModule {}
