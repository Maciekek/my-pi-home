import {IsNotEmpty, IsNumber} from 'class-validator';
import {Temp} from "../interfaces/temp.interface";

export class AddTempDto implements Temp {

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    locationId: string;

    @IsNotEmpty()
    sensorId: string;
}
