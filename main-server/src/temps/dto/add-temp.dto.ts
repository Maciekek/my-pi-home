import {IsNotEmpty, IsNumber} from 'class-validator';
import {Temp} from "../interfaces/temp.interface";

export class AddTempDto implements Temp {

    @IsNotEmpty()
    @IsNumber()
    readonly value: number;

    @IsNotEmpty()
    readonly date: string;

    @IsNotEmpty()
    readonly locationId: string;

    @IsNotEmpty()
    readonly sensorId: string;
}
