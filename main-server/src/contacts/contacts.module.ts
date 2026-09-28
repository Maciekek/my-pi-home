import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from '../events/events.module';
import { LocationsModule } from '../locations/locations.module';
import { NotificatorModule } from '../modules/notificator/notificator.module';
import { AlarmController } from './alarm/alarm.controller';
import { AlarmService } from './alarm/alarm.service';
import { ContactEventSchema } from './contact.schema';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ContactEvent', schema: ContactEventSchema }]), EventsModule, NotificatorModule, LocationsModule],
  controllers: [ContactsController, AlarmController],
  providers: [ContactsService, AlarmService],
  exports: [ContactsService],
})
export class ContactsModule {}
