export interface SensorData {
  sensorId: string;
  locationId: string;
  name: string;
  notifyAbove?: boolean;
  maxTemp?: number;
  notifyBelow?: boolean;
  minTemp?: number;
}

export interface TempSettings {
  sensors: SensorData[];
  readIntervalTime: string;
}

export interface NotificationSettings {
  enabled: boolean;
  email: string;
  inactiveThresholdMinutes: number;
  notifyContactOpen?: boolean;
  notifyContactClose?: boolean;
}

export interface ContactSensor {
  sensorId: string;
  name: string;
  gpio: number;
}

export interface ContactSettings {
  sensors: ContactSensor[];
}

export interface Location {
  readonly name: string;
  readonly description: string;
  readonly tempSettings: TempSettings;
  readonly notificationSettings?: NotificationSettings;
  readonly contactSettings?: ContactSettings;
}
