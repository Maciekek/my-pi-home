import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from '../events/events.module';
import { NotificatorModule } from '../modules/notificator/notificator.module';
import { ContactEventSchema } from './contact.schema';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ContactEvent', schema: ContactEventSchema }]), EventsModule, NotificatorModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
