import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as moment from 'moment';
import { LocationsService } from '../../locations/locations.service';
import { TempsService } from '../../temps/temps.service';
import { CronJob } from '../cron/interfaces/cronJob';
import { buildStartupTestEmail } from './emailTemplates';
import { processLocationInactivity } from './inactivityNotifier';
const nodemailer = require('nodemailer');

@Injectable()
export class NotificatorService implements CronJob, OnModuleInit {
  private readonly logger = new Logger(NotificatorService.name);
  private mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
  private inactiveCooldownMinutes = Number(process.env.INACTIVE_NOTIFICATION_COOLDOWN_MINUTES || 30);
  private lastInactiveNotification: Record<string, Date> = {};
  private startupTestSent = false;

  constructor(private readonly locations: LocationsService, private readonly tempService: TempsService) {}

  onModuleInit = async () => {
    if (this.startupTestSent) {
      return;
    }
    const testTo = process.env.SMTP_TEST_TO;
    if (!testTo) {
      return;
    }
    try {
      const email = buildStartupTestEmail();
      await this.sendEmail(testTo, email.subject, email);
      this.startupTestSent = true;
      this.logger.log('[Notificator service] Startup SMTP test email sent.');
    } catch (e) {
      this.logger.log(`[Notificator service] Startup SMTP test email failed: ${e}`);
    }
  };

  sendEmail = async (to, subject, message) => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
      this.logger.log('[Notificator service] SMTP not configured, skipping email.');
      return;
    }

    await this.mailer.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: message.text,
      html: message.html,
    });
  };

  checkInactiveNotifications = async () => {
    const locations = await this.locations.findAllRaw();
    const now = moment();

    this.logger.log(`[Notificator service] Checking inactivity for ${locations.length} locations`);

    for (const location of locations) {
      try {
        await processLocationInactivity({
          location,
          tempService: this.tempService,
          now,
          cooldownMinutes: this.inactiveCooldownMinutes,
          lastSentMap: this.lastInactiveNotification,
          sendEmail: this.sendEmail,
          logger: this.logger,
        });
      } catch (e) {
        this.logger.log(`[Notificator service] Email send failed: ${e}`);
      }
    }
  };

  run = () => {
    this.checkInactiveNotifications().catch((e) =>
      this.logger.log(`[Notificator service] Inactivity check failed: ${e}`),
    );
  };
}
