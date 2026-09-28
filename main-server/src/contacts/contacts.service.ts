import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsGateway } from '../events/events.gateway';
import { NotificatorService } from '../modules/notificator/notificator.service';
import { AddContactEventDto } from './dto/add-contact-event.dto';
import { ContactEvent } from './interfaces/contactEvent.interface';

export const CONTACT_STATE_CHANGED_EVENT = 'contact_state_changed';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectModel('ContactEvent') private readonly contactEventModel: Model<ContactEvent>,
    private readonly eventsGateway: EventsGateway,
    private readonly notificatorService: NotificatorService,
  ) {}

  async addEvent(dto: AddContactEventDto): Promise<ContactEvent> {
    const last = await this.findLastBySensor(dto.locationId, dto.sensorId);

    // Pi reports its state on every start; skip duplicates so history holds only real changes.
    if (last && last.isOpen === dto.isOpen) {
      return last;
    }

    this.logger.log(`Contact ${dto.sensorId} @ ${dto.locationId}: ${dto.isOpen ? 'open' : 'closed'}`);
    const saved = await new this.contactEventModel(dto).save();

    this.eventsGateway.broadcast('message', {
      event_type: CONTACT_STATE_CHANGED_EVENT,
      contact: saved,
    });

    // Don't make the Pi wait for SMTP; a failed email must not fail the state report.
    this.notificatorService
      .notifyContactChange(saved)
      .catch((e) => this.logger.log(`Contact email send failed: ${e}`));

    return saved;
  }

  async findLastBySensor(locationId: string, sensorId: string): Promise<ContactEvent | null> {
    return this.contactEventModel.findOne({ locationId, sensorId }).sort({ date: -1 }).exec();
  }

  async findCurrentStates(locationId: string): Promise<ContactEvent[]> {
    return this.contactEventModel
      .aggregate([
        { $match: { locationId } },
        { $sort: { date: -1 } },
        { $group: { _id: '$sensorId', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: { sensorId: 1 } },
      ])
      .exec();
  }

  async findLastN(locationId: string, n: string, sensorId?: string, before?: string): Promise<ContactEvent[]> {
    const filter: any = { locationId };
    if (sensorId) {
      filter.sensorId = sensorId;
    }
    if (before && !isNaN(Date.parse(before))) {
      filter.date = { $lt: new Date(before) };
    }

    return this.contactEventModel
      .find(filter)
      .sort({ date: -1 })
      .limit(Math.min(Number(n) || 20, 500))
      .exec();
  }
}
