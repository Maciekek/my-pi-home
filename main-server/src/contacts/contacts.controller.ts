import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { AddContactEventDto } from './dto/add-contact-event.dto';
import { ContactEvent } from './interfaces/contactEvent.interface';

@Controller('/contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async addEvent(@Body() dto: AddContactEventDto): Promise<ContactEvent> {
    this.logger.log('POST [addContactEvent]');
    return this.contactsService.addEvent(dto);
  }

  @Get(':locationId/state')
  async findCurrentStates(@Param('locationId') locationId: string): Promise<ContactEvent[]> {
    return this.contactsService.findCurrentStates(locationId);
  }

  @Get(':locationId/history/:n')
  async findLastN(@Param('locationId') locationId: string, @Param('n') n: string): Promise<ContactEvent[]> {
    return this.contactsService.findLastN(locationId, n);
  }
}
