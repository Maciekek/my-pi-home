import { getArmedState, isInScheduleWindow, parseTime, scheduleWindowEnd } from './alarmSchedule';

const TZ = 'Europe/Warsaw';
// 2026-09-28 is CEST (UTC+2): local 23:30 = 21:30Z
const at = (iso: string) => new Date(iso);
const night = { enabled: true, from: '22:00', to: '06:00', sensorIds: ['c1'] };
const day = { enabled: true, from: '08:00', to: '16:00', sensorIds: ['c1'] };

describe('alarmSchedule', () => {
  it('parses times', () => {
    expect(parseTime('22:00')).toBe(1320);
    expect(parseTime('6:05')).toBe(365);
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('')).toBeNull();
  });

  it('handles windows crossing midnight in local time', () => {
    expect(isInScheduleWindow(night, at('2026-09-28T19:59:00Z'), TZ)).toBe(false); // 21:59
    expect(isInScheduleWindow(night, at('2026-09-28T20:00:00Z'), TZ)).toBe(true); // 22:00
    expect(isInScheduleWindow(night, at('2026-09-29T01:00:00Z'), TZ)).toBe(true); // 03:00
    expect(isInScheduleWindow(night, at('2026-09-29T03:59:00Z'), TZ)).toBe(true); // 05:59
    expect(isInScheduleWindow(night, at('2026-09-29T04:00:00Z'), TZ)).toBe(false); // 06:00
  });

  it('handles same-day windows and disabled schedules', () => {
    expect(isInScheduleWindow(day, at('2026-09-28T08:00:00Z'), TZ)).toBe(true); // 10:00
    expect(isInScheduleWindow(day, at('2026-09-28T15:00:00Z'), TZ)).toBe(false); // 17:00
    expect(isInScheduleWindow({ ...night, enabled: false }, at('2026-09-28T21:00:00Z'), TZ)).toBe(false);
    expect(isInScheduleWindow({ ...night, to: '22:00' }, at('2026-09-28T21:00:00Z'), TZ)).toBe(false);
  });

  it('computes the end of the current window', () => {
    expect(scheduleWindowEnd(night, at('2026-09-28T21:30:00Z'), TZ).toISOString()).toBe('2026-09-29T04:00:00.000Z');
  });

  it('applies manual overrides before the schedule', () => {
    const inWindow = at('2026-09-28T21:30:00Z');
    const outside = at('2026-09-28T10:00:00Z');

    expect(getArmedState(night, {}, inWindow, TZ)).toEqual({ armed: true, source: 'schedule' });
    expect(getArmedState(night, {}, outside, TZ)).toEqual({ armed: false, source: null });
    expect(getArmedState(night, { override: 'armed' }, outside, TZ)).toEqual({ armed: true, source: 'manual' });
    expect(
      getArmedState(night, { override: 'disarmed', until: '2026-09-29T04:00:00Z' }, inWindow, TZ),
    ).toEqual({ armed: false, source: 'manual' });
    // expired disarm falls back to the schedule
    expect(
      getArmedState(night, { override: 'disarmed', until: '2026-09-28T04:00:00Z' }, inWindow, TZ),
    ).toEqual({ armed: true, source: 'schedule' });
  });
});
