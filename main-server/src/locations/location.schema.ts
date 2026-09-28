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
    notifyContactOpen: Boolean,
    notifyContactClose: Boolean,
});

export const ContactSensorSchema = new mongoose.Schema({
    sensorId: String,
    name: String,
    gpio: Number,
});

export const ContactSettingsSchema = new mongoose.Schema({
    sensors: [ContactSensorSchema],
});

export const LocationSchema = new mongoose.Schema({
    name: String,
    description: String,
    tempSettings: TempSettingsSchema,
    notificationSettings: NotificationSettingsSchema,
    contactSettings: ContactSettingsSchema,
});
