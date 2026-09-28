export interface AlarmSettings {
  enabled?: boolean;
  from?: string;
  to?: string;
  sensorIds?: string[];
  reminderMinutes?: number;
}

export type AlarmOverride = 'armed' | 'disarmed';

export interface AlarmState {
  override?: AlarmOverride | null;
  until?: Date | string | null;
}

export type ArmedSource = 'schedule' | 'manual' | null;

export const DEFAULT_TIMEZONE = process.env.NOTIFICATION_TIMEZONE || 'Europe/Warsaw';
const MINUTES_PER_DAY = 24 * 60;

// "22:00" -> 1320
export const parseTime = (value?: string): number | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || '');
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }
  return hours * 60 + minutes;
};

// Minutes since local midnight in the given timezone.
export const localMinutes = (date: Date, timeZone = DEFAULT_TIMEZONE): number => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour').value);
  const minute = Number(parts.find((part) => part.type === 'minute').value);
  return hour * 60 + minute;
};

const getWindow = (settings: AlarmSettings) => {
  const from = parseTime(settings && settings.from);
  const to = parseTime(settings && settings.to);
  if (!settings || !settings.enabled || from === null || to === null || from === to) {
    return null;
  }
  return { from, to };
};

// Window may cross midnight (22:00-06:00).
export const isInScheduleWindow = (settings: AlarmSettings, now: Date, timeZone = DEFAULT_TIMEZONE): boolean => {
  const window = getWindow(settings);
  if (!window) {
    return false;
  }
  const minutes = localMinutes(now, timeZone);
  return window.from < window.to
    ? minutes >= window.from && minutes < window.to
    : minutes >= window.from || minutes < window.to;
};

// End of the schedule window that contains `now` (only meaningful while inside it).
export const scheduleWindowEnd = (settings: AlarmSettings, now: Date, timeZone = DEFAULT_TIMEZONE): Date | null => {
  const window = getWindow(settings);
  if (!window) {
    return null;
  }
  const minutesLeft = (window.to - localMinutes(now, timeZone) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const end = new Date(now.valueOf() + minutesLeft * 60000);
  end.setSeconds(0, 0);
  return end;
};

export const getArmedState = (
  settings: AlarmSettings,
  state: AlarmState,
  now: Date,
  timeZone = DEFAULT_TIMEZONE,
): { armed: boolean; source: ArmedSource } => {
  const override = state && state.override;

  if (override === 'armed') {
    return { armed: true, source: 'manual' };
  }

  const disarmedUntil = state && state.until ? new Date(state.until) : null;
  if (override === 'disarmed' && disarmedUntil && now < disarmedUntil) {
    return { armed: false, source: 'manual' };
  }

  if (isInScheduleWindow(settings, now, timeZone)) {
    return { armed: true, source: 'schedule' };
  }

  return { armed: false, source: null };
};
