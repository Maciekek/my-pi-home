import { Document } from 'mongoose';

export interface Location extends Document {
    readonly name: string;
    readonly description: string;
}
