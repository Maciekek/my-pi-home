import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as process from 'process';
import { LocationsService } from '../../locations/locations.service';
import { SensorsService } from '../../temps/sensors.service';
import { TempsService } from '../../temps/temps.service';
import { CronJob } from '../cron/interfaces/cronJob';
const twilio = require('twilio');

@Injectable()
export class NotificatorService implements CronJob {
  private readonly logger = new Logger(NotificatorService.name);
  private client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  constructor(
    private readonly locations: LocationsService,
    private readonly tempService: TempsService,
    private readonly sensorsService: SensorsService,
  ) {}

  sendSms = (to, message) => {
    // this.logger.log(`sending sms to ${to}, message: ${message}`);
    //
    // this.client.messages
    //   .create({
    //     body: message,
    //     to,
    //     from: '+16692192842',
    //   })
    //   .then((response) => this.logger.log(response.sid));
  };

  sendActiveNotification = () => {
    this.logger.log('Send Active Notification cron job');
    this.sendSms('+48515585510', 'Działam i czekam na zadania...');
  };

  run = () => {
    this.logger.log('Notification cron job - started');
    const pMax = 65;
    const pMin = 39;

    const sMax = 40;
    const sMin = 20;

    const roomMax = 31;

    const pID = '28-000006bee1fc';
    const sensors = {
      kal: '10-000802cbe042',
      pod: '10-000802d6d148',
      kot: '10-000802cbe825',
    };

    const trabkiLoction = this.locations
      .findById('5d83477c1d15b82553f8932f')
      .then((data) => {
        this.logger.log(`[Notificator service] Aktualnie pobrane dane: ${data}`);
        return this.sensorsService.findAllSensorsYoungerthan(
          (data as any)._id,
          moment().subtract(20, 'minutes').toDate(),
        );
      })
      .then((temps) => {
        const pData = _.find(temps, ['sensorId', pID]);
        const kalData = _.find(temps, ['sensorId', sensors.kal]);
        const podData = _.find(temps, ['sensorId', sensors.pod]);
        const kotData = _.find(temps, ['sensorId', sensors.kot]);
        this.logger.log(`Sprawdzam trabki location, czy jakas temp wymaga powiadomienia`);
        this.logger.log(`piec temp ${pData.value}`);
        this.logger.log(`kaloryfery temp ${kalData.value}`);
        this.logger.log(`podlogowka temp ${podData.value}`);
        this.logger.log(`podlogowka temp ${podData.value}`);
        this.logger.log(`kotlownia temp ${kotData.value}`);

        if (pData.value > pMax) {
          const message = `\n\n TEMPERATURA PIECA JEST ZA WYSOKA! \n\n AKTUALNA TEMPERATURA PIECA: ${pData.value} \n\n\n\n
                    \n\n Pozostałe odczyty: \n
                    KALORYFERY: ${kalData.value} \n
                    PODŁOGÓWKA: ${podData.value} \n
                    KOTŁOWNIA: ${kotData.value}`;

          this.sendSms('+48515585510', message);
          this.sendSms('+48519812933', message);
        }

        if (pData.value < pMin) {
          const message = `\n\n TEMPERATURA JEST ZA NISKA! \n\n AKTUALNA TEMPERATURA PIECA: ${pData.value}. \n\n\n\n
                    \n\n Pozostałe odczyty: \n
                    KALORYFERY: ${kalData.value} \n.
                    PODŁOGÓWKA: ${podData.value} \n.
                    KOTŁOWNIA: ${kotData.value}.`;

          this.sendSms('+48519812933', message);
          this.sendSms('+48515585510', message);

          this.client.calls
            .create({
              twiml: `<Response><Say language="pl-PL">${message}. to tyle, cześć</Say></Response>`,
              to: '+48519812933', // Text this number
              from: '+16692192842', // From a valid Twilio number
            })
            .then((call) => this.logger.log(`[dzwonie +48519812933] ${call.sid}`))
            .catch((e) => this.logger.log(23, e));

          this.client.calls
            .create({
              twiml: `<Response><Say language="pl-PL">${message}. to tyle, cześć</Say></Response>`,
              to: '+48515585510', // Text this number
              from: '+16692192842', // From a valid Twilio number
            })
            .then((call) => this.logger.log(`[dzwonie +48515585510] ${call.sid}`))
            .catch((e) => this.logger.log(23, e));
        }
      });
  };
}
