import { IsNotEmpty } from 'class-validator';
import { AlarmSettings, ContactSettings, Location, NotificationSettings, TempSettings } from '../interfaces/location.interface';

export class AddLocationDto implements Location {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  tempSettings: TempSettings;

  notificationSettings?: NotificationSettings;

  contactSettings?: ContactSettings;

  alarmSettings?: AlarmSettings;
}
