import {IsNotEmpty} from 'class-validator';
import {Dashboard} from "../interfaces/dashboard.interface";

export class AddDashboardDto implements Dashboard {
    @IsNotEmpty()
    readonly locationId: string;

    @IsNotEmpty()
    readonly config: string;
}
