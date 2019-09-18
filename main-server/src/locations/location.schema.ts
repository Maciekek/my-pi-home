import * as mongoose from 'mongoose';

export const SensorDataSchema = new mongoose.Schema({
    sensorId: String,
    locationId: String,
    name: String,
});

export const TempSettingsSchema = new mongoose.Schema({
    sensors: [SensorDataSchema],
    readIntervalTime: String,
});

export const LocationSchema = new mongoose.Schema({
    name: String,
    description: String,
    tempSettings: TempSettingsSchema,
});
