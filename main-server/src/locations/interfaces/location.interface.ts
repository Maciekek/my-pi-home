import { Document } from 'mongoose';

export interface SensorData   {
    sensorId: string;
    locationId: string;
    name: string;
}

export interface TempSettings {
    sensors: SensorData[];
    readIntervalTime: string;
}

export interface Location extends Document {
    readonly name: string;
    readonly description: string;
    readonly tempSettings: TempSettings;
}
