import {IsNotEmpty} from 'class-validator';
import {RelayDevice} from "../interfaces/relayDevice.interface";

export class AddRelayDto implements RelayDevice {
    @IsNotEmpty()
    readonly locationId: string;

    @IsNotEmpty()
    readonly ip: string;

    @IsNotEmpty()
    readonly gpio: string;

    @IsNotEmpty()
    readonly type: string;

    @IsNotEmpty()
    readonly name: string;
}
