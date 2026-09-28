import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { EventsGateway } from '../../events/events.gateway';
import { LocationsService } from '../../locations/locations.service';
import { buildAlarmEmail } from '../../modules/notificator/emailTemplates';
import { NotificatorService } from '../../modules/notificator/notificator.service';
import { ContactEvent } from '../interfaces/contactEvent.interface';
import { DEFAULT_TIMEZONE, getArmedState, isInScheduleWindow, scheduleWindowEnd } from './alarmSchedule';

export const ALARM_STATE_CHANGED_EVENT = 'alarm_state_changed';

const DEFAULT_REMINDER_MINUTES = 30;
// The Pi re-sends its contact states every 10 minutes, so silence longer than this means it is offline.
const CONNECTION_TIMEOUT_MINUTES = Number(process.env.ALARM_CONNECTION_TIMEOUT_MINUTES || 20);
// Flapping contacts (e.g. while adjusting the magnet) must not flood the inbox.
const OPEN_ALERT_COOLDOWN_MS = 60 * 1000;

const escapeHtml = (value: string) =>
  String(value).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const formatDate = (date) => new Date(date).toLocaleString('pl-PL', { timeZone: DEFAULT_TIMEZONE });

export interface AlarmStatus {
  armed: boolean;
  source: 'schedule' | 'manual' | null;
  configured: boolean;
  scheduleEnabled: boolean;
  from?: string;
  to?: string;
  sensorIds: string[];
  override: 'armed' | 'disarmed' | null;
  until: Date | null;
  openSensorIds: string[];
  lastSeen: Date | null;
}

@Injectable()
export class AlarmService {
  private readonly logger = new Logger(AlarmService.name);
  private readonly startedAt = new Date();
  // In-memory runtime state; after a restart the first tick re-establishes it without alerting on arming.
  private lastArmed: Record<string, boolean> = {};
  private lastAlertAt: Record<string, Date> = {};
  private lastSeen: Record<string, Date> = {};
  private connectionAlerted: Record<string, boolean> = {};

  constructor(
    @InjectModel('ContactEvent') private readonly contactEventModel: Model<ContactEvent>,
    private readonly locations: LocationsService,
    private readonly notificator: NotificatorService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // Called for every report from the Pi, including unchanged heartbeats.
  recordReport(locationId: string) {
    this.lastSeen[locationId] = new Date();

    if (this.connectionAlerted[locationId]) {
      this.connectionAlerted[locationId] = false;
      this.withLocation(locationId, (location) =>
        this.sendAlarmEmail(location, 'Łączność z Raspberry Pi przywrócona', [
          `Raspberry Pi w lokacji <strong>${escapeHtml(location.name)}</strong> znowu wysyła dane.`,
        ]),
      );
    }
  }

  async onContactChange(contact: ContactEvent) {
    if (!contact.isOpen) {
      return;
    }

    const location: any = await this.locations.findByIdRaw(contact.locationId);
    if (!location || !this.isWatched(location, contact.sensorId)) {
      return;
    }

    const { armed } = getArmedState(location.alarmSettings, location.alarmState, new Date());
    if (!armed) {
      return;
    }

    const key = `${contact.locationId}:${contact.sensorId}`;
    const lastAlert = this.lastAlertAt[key];
    if (lastAlert && Date.now() - lastAlert.valueOf() < OPEN_ALERT_COOLDOWN_MS) {
      return;
    }
    this.lastAlertAt[key] = new Date();

    await this.sendAlarmEmail(location, `Otwarto: ${this.sensorName(location, contact.sensorId)}`, [
      `Czujnik <strong>${escapeHtml(this.sensorName(location, contact.sensorId))}</strong> w lokacji <strong>${escapeHtml(
        location.name,
      )}</strong> został otwarty, gdy alarm był uzbrojony.`,
      `Czas zdarzenia: <strong>${formatDate(contact.date)}</strong>.`,
    ]);
  }

  @Interval(60000)
  async tick() {
    try {
      const locations: any[] = await this.locations.findAllRaw();
      for (const location of locations) {
        if (this.isConfigured(location)) {
          await this.evaluate(location).catch((e) => this.logger.log(`Alarm check failed for ${location._id}: ${e}`));
        }
      }
    } catch (e) {
      this.logger.log(`Alarm tick failed: ${e}`);
    }
  }

  async getStatus(locationId: string): Promise<AlarmStatus> {
    const location: any = await this.locations.findByIdRaw(locationId);
    const settings = (location && location.alarmSettings) || {};
    const state = (location && location.alarmState) || {};
    const { armed, source } = getArmedState(settings, state, new Date());
    const sensorIds = this.watchedSensorIds(location);
    const openStates = await this.findOpenStates(locationId, sensorIds);

    return {
      armed,
      source,
      configured: sensorIds.length > 0,
      scheduleEnabled: !!settings.enabled,
      from: settings.from,
      to: settings.to,
      sensorIds,
      override: state.override || null,
      until: state.until || null,
      openSensorIds: openStates.map((openState) => openState.sensorId),
      lastSeen: this.lastSeen[locationId] || null,
    };
  }

  async arm(locationId: string): Promise<AlarmStatus> {
    await this.rememberArmedState(locationId);
    await this.locations.setAlarmState(locationId, { override: 'armed', until: null });
    return this.afterManualChange(locationId);
  }

  // Disarm for the rest of the current schedule window; outside of it just clear a manual arm.
  async disarm(locationId: string): Promise<AlarmStatus> {
    await this.rememberArmedState(locationId);
    const location: any = await this.locations.findByIdRaw(locationId);
    const settings = location && location.alarmSettings;
    const now = new Date();
    const alarmState = isInScheduleWindow(settings, now)
      ? { override: 'disarmed' as const, until: scheduleWindowEnd(settings, now) }
      : { override: null, until: null };

    await this.locations.setAlarmState(locationId, alarmState);
    return this.afterManualChange(locationId);
  }

  async resumeSchedule(locationId: string): Promise<AlarmStatus> {
    await this.rememberArmedState(locationId);
    await this.locations.setAlarmState(locationId, { override: null, until: null });
    return this.afterManualChange(locationId);
  }

  // A manual change right after a restart must still be detected as an arming transition.
  private async rememberArmedState(locationId: string) {
    if (this.lastArmed[locationId] !== undefined) {
      return;
    }
    const location: any = await this.locations.findByIdRaw(locationId);
    if (location) {
      this.lastArmed[locationId] = getArmedState(location.alarmSettings, location.alarmState, new Date()).armed;
    }
  }

  private async afterManualChange(locationId: string): Promise<AlarmStatus> {
    const location: any = await this.locations.findByIdRaw(locationId);
    if (location && this.isConfigured(location)) {
      await this.evaluate(location);
    }
    this.broadcast(locationId);
    return this.getStatus(locationId);
  }

  private async evaluate(location: any) {
    const locationId = String(location._id);
    const now = new Date();
    const { armed } = getArmedState(location.alarmSettings, location.alarmState, now);
    const wasArmed = this.lastArmed[locationId];
    this.lastArmed[locationId] = armed;

    const state = location.alarmState || {};
    if (state.override === 'disarmed' && state.until && now >= new Date(state.until)) {
      await this.locations.setAlarmState(locationId, { override: null, until: null });
    }

    if (wasArmed !== undefined && wasArmed !== armed) {
      this.logger.log(`Alarm ${armed ? 'armed' : 'disarmed'} for location ${locationId}`);
      this.broadcast(locationId);
    }

    if (!armed) {
      return;
    }

    const sensorIds = this.watchedSensorIds(location);
    const openStates = await this.findOpenStates(locationId, sensorIds);

    if (wasArmed === false && openStates.length) {
      openStates.forEach((openState) => (this.lastAlertAt[`${locationId}:${openState.sensorId}`] = now));
      await this.sendAlarmEmail(location, 'Czujniki otwarte w chwili uzbrojenia', [
        `Alarm w lokacji <strong>${escapeHtml(location.name)}</strong> został uzbrojony, ale te czujniki są otwarte:`,
        `<strong>${openStates.map((openState) => escapeHtml(this.sensorName(location, openState.sensorId))).join(', ')}</strong>`,
      ]);
    }

    const reminderMs = (Number(location.alarmSettings && location.alarmSettings.reminderMinutes) || DEFAULT_REMINDER_MINUTES) * 60000;
    for (const openState of openStates) {
      const key = `${locationId}:${openState.sensorId}`;
      const lastAlert = this.lastAlertAt[key];
      if (lastAlert && now.valueOf() - lastAlert.valueOf() < reminderMs) {
        continue;
      }
      this.lastAlertAt[key] = now;
      await this.sendAlarmEmail(location, `Nadal otwarte: ${this.sensorName(location, openState.sensorId)}`, [
        `Czujnik <strong>${escapeHtml(this.sensorName(location, openState.sensorId))}</strong> w lokacji <strong>${escapeHtml(
          location.name,
        )}</strong> jest otwarty od <strong>${formatDate(openState.date)}</strong>, a alarm jest uzbrojony.`,
      ]);
    }

    const lastSeen = this.lastSeen[locationId] || this.startedAt;
    const silentMinutes = (now.valueOf() - lastSeen.valueOf()) / 60000;
    if (silentMinutes > CONNECTION_TIMEOUT_MINUTES && !this.connectionAlerted[locationId]) {
      this.connectionAlerted[locationId] = true;
      await this.sendAlarmEmail(location, 'Brak łączności z Raspberry Pi', [
        `Raspberry Pi w lokacji <strong>${escapeHtml(location.name)}</strong> nie wysłało danych od <strong>${Math.round(
          silentMinutes,
        )} min</strong>, a alarm jest uzbrojony.`,
        this.lastSeen[locationId]
          ? `Ostatni kontakt: <strong>${formatDate(this.lastSeen[locationId])}</strong>.`
          : 'Od restartu serwera nie było żadnego kontaktu.',
        'Możliwy brak prądu lub internetu.',
      ]);
    }
  }

  private async findOpenStates(locationId: string, sensorIds: string[]): Promise<ContactEvent[]> {
    if (!sensorIds.length) {
      return [];
    }
    const states: ContactEvent[] = await this.contactEventModel
      .aggregate([
        { $match: { locationId, sensorId: { $in: sensorIds } } },
        { $sort: { date: -1, _id: -1 } },
        { $group: { _id: '$sensorId', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
      ])
      .exec();
    return states.filter((state) => state.isOpen);
  }

  // Only sensors that are both selected for the alarm and still configured on the location.
  private watchedSensorIds(location: any): string[] {
    const selected = (location && location.alarmSettings && location.alarmSettings.sensorIds) || [];
    const configured = ((location && location.contactSettings && location.contactSettings.sensors) || []).map(
      (sensor) => sensor.sensorId,
    );
    return selected.filter((sensorId) => configured.includes(sensorId));
  }

  private isConfigured(location: any): boolean {
    return this.watchedSensorIds(location).length > 0;
  }

  private isWatched(location: any, sensorId: string): boolean {
    return this.watchedSensorIds(location).includes(sensorId);
  }

  private sensorName(location: any, sensorId: string): string {
    const sensors = (location.contactSettings && location.contactSettings.sensors) || [];
    const sensor = sensors.find((candidate) => candidate.sensorId === sensorId);
    return (sensor && sensor.name) || sensorId;
  }

  private async sendAlarmEmail(location: any, title: string, lines: string[]) {
    const email = location.notificationSettings && location.notificationSettings.email;
    this.logger.log(`[Alarm] ${title} (location ${location._id})${email ? '' : ' - no email configured'}`);
    if (!email) {
      return;
    }
    const mail = buildAlarmEmail(title, lines);
    await this.notificator.sendEmail(email, mail.subject, mail);
  }

  private withLocation(locationId: string, fn: (location: any) => Promise<void>) {
    this.locations
      .findByIdRaw(locationId)
      .then((location) => (location ? fn(location) : undefined))
      .catch((e) => this.logger.log(`Alarm email failed: ${e}`));
  }

  private broadcast(locationId: string) {
    this.eventsGateway.broadcast('message', { event_type: ALARM_STATE_CHANGED_EVENT, locationId });
  }
}
