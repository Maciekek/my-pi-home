import { IsNotEmpty } from 'class-validator';
import { Location, TempSettings } from '../interfaces/location.interface';

export class AddLocationDto implements Location {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  tempSettings: TempSettings;
}
