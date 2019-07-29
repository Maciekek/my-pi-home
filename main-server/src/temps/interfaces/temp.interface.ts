import { Document } from 'mongoose';

export interface Temp extends Document {
    readonly value: number;
    readonly date: string;
    readonly locationId: string;
}