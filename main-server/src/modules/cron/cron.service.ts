import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { NotificatorService } from '../notificator/notificator.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly notificatorService: NotificatorService) {}

  @Interval(60000)
  handleCron() {
    this.notificatorService.run();
    this.logger.debug('Called cron task - notification service - interval 60000');
  }
}
