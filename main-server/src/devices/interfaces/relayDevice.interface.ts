import { Document } from 'mongoose';

export interface RelayDevice extends Document {
    readonly locationId: string;
    readonly ip: string;
    readonly gpio: string;
    readonly type: string;
    readonly name: string;

}
