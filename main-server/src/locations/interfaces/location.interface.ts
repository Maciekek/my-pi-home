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

export interface AlarmSettings {
  enabled: boolean;
  from: string;
  to: string;
  sensorIds: string[];
  reminderMinutes: number;
}

export interface AlarmState {
  override: 'armed' | 'disarmed' | null;
  until: Date | null;
}

export interface Location {
  readonly name: string;
  readonly description: string;
  readonly tempSettings: TempSettings;
  readonly notificationSettings?: NotificationSettings;
  readonly contactSettings?: ContactSettings;
  readonly alarmSettings?: AlarmSettings;
  readonly alarmState?: AlarmState;
}
