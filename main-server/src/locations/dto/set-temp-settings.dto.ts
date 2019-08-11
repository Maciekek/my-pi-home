import {IsNotEmpty} from 'class-validator';
import {TempSettings} from "../interfaces/location.interface";

export class SetTempSettingsDto implements TempSettings {
   @IsNotEmpty()
   readonly tempSettings: string;
}
