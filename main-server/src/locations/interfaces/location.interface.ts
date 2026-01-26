export interface SensorData {
  sensorId: string;
  locationId: string;
  name: string;
}

export interface TempSettings {
  sensors: SensorData[];
  readIntervalTime: string;
}

export interface NotificationSettings {
  enabled: boolean;
  email: string;
  inactiveThresholdMinutes: number;
}

export interface Location {
  readonly name: string;
  readonly description: string;
  readonly tempSettings: TempSettings;
  readonly notificationSettings?: NotificationSettings;
}
