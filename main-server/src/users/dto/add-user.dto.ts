import {IsNotEmpty} from 'class-validator';
import {User} from "../interfaces/user.interface";

export class AddUserDto implements User {

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly password: string;
}
