import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ContactEvent } from '../interfaces/contactEvent.interface';

export class AddContactEventDto implements ContactEvent {
  @IsNotEmpty()
  locationId: string;

  @IsNotEmpty()
  sensorId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsBoolean()
  isOpen: boolean;

  @IsNotEmpty()
  date: string;
}
