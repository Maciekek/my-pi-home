import * as mongoose from 'mongoose';

export const SensorDataSchema = new mongoose.Schema({
    sensorId: String,
    locationId: String,
    name: String,
    notifyAbove: Boolean,
    maxTemp: Number,
    notifyBelow: Boolean,
    minTemp: Number,
});

export const TempSettingsSchema = new mongoose.Schema({
    sensors: [SensorDataSchema],
    readIntervalTime: String,
});

export const NotificationSettingsSchema = new mongoose.Schema({
    enabled: Boolean,
    email: String,
    inactiveThresholdMinutes: Number,
});

export const LocationSchema = new mongoose.Schema({
    name: String,
    description: String,
    tempSettings: TempSettingsSchema,
    notificationSettings: NotificationSettingsSchema,
});
