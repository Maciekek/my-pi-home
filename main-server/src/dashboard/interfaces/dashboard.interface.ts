import { Document } from 'mongoose';

export interface Dashboard extends Document {
    readonly locationId: string;
    readonly config: string;
}
