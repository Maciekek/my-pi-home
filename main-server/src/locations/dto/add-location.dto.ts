import { IsNotEmpty } from 'class-validator';
import { Location, NotificationSettings, TempSettings } from '../interfaces/location.interface';

export class AddLocationDto implements Location {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  tempSettings: TempSettings;

  notificationSettings?: NotificationSettings;
}
