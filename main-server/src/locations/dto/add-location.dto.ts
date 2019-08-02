import {IsNotEmpty} from 'class-validator';
import {Location} from "../interfaces/location.interface";

export class AddLocationDto implements Location {

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly description: string;
}
