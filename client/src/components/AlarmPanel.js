import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import C from 'classnames';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import { AlarmService } from '../services/alarm.services';
import { websocket, WEBSOCKET_MESSAGE_TYPES } from '../utils/Websocket';
import { Icon } from './uiComponents/Icon';

const describeStatus = (status) => {
  const schedule = status.scheduleEnabled ? `${status.from}–${status.to}` : null;

  if (status.armed) {
    return status.source === 'manual' ? 'Uzbrojony ręcznie' : `Uzbrojony wg harmonogramu (${schedule})`;
  }
  if (status.override === 'disarmed' && status.until) {
    return `Rozbrojony ręcznie do ${moment(status.until).format('HH:mm')}`;
  }
  return schedule ? `Uzbroi się automatycznie o ${status.from}` : 'Harmonogram wyłączony';
};

const AlarmPanel = ({ locationId, location }) => {
  const [status, setStatus] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const load = () =>
    AlarmService.getStatus(locationId)
      .then((response) => setStatus(response.data))
      .catch(() => setStatus(null));

  useEffect(() => {
    load();

    const onMessage = (message) => {
      const isAlarmChange =
        message.event_type === WEBSOCKET_MESSAGE_TYPES.ALARM_STATE_CHANGED && message.locationId === locationId;
      const isContactChange =
        message.event_type === WEBSOCKET_MESSAGE_TYPES.CONTACT_STATE_CHANGED &&
        message.contact.locationId === locationId;
      if (isAlarmChange || isContactChange) {
        load();
      }
    };

    websocket.socket.on('message', onMessage);
    return () => websocket.socket.off('message', onMessage);
  }, [locationId]);

  if (!status || !status.configured) {
    return null;
  }

  const run = (action) => {
    setIsBusy(true);
    action(locationId)
      .then((response) => setStatus(response.data))
      .catch(() => toast.error('Nie udało się zmienić stanu alarmu.'))
      .finally(() => setIsBusy(false));
  };

  const sensors = (location && location.contactSettings && location.contactSettings.sensors) || [];
  const sensorName = (sensorId) => {
    const sensor = sensors.find((candidate) => candidate.sensorId === sensorId);
    return (sensor && sensor.name) || sensorId;
  };
  const isViolated = status.armed && status.openSensorIds.length > 0;

  return (
    <div
      className={C('alarm-panel', 'location__card', {
        'alarm-panel--armed': status.armed,
        'alarm-panel--violated': isViolated,
      })}
    >
      <div className={'alarm-panel__info'}>
        <Icon type={status.armed ? 'lock' : 'lock_open'} size={28} />
        <div>
          <div className={'alarm-panel__title'}>{status.armed ? 'Alarm uzbrojony' : 'Alarm rozbrojony'}</div>
          <div className={'alarm-panel__subtitle'}>{describeStatus(status)}</div>
          {isViolated ? (
            <div className={'alarm-panel__violation'}>
              Otwarte: {status.openSensorIds.map(sensorName).join(', ')}
            </div>
          ) : status.openSensorIds.length > 0 ? (
            <div className={'alarm-panel__subtitle'}>
              Uwaga, otwarte: {status.openSensorIds.map(sensorName).join(', ')}
            </div>
          ) : null}
        </div>
      </div>

      <div className={'alarm-panel__actions'}>
        {status.override && status.scheduleEnabled ? (
          <Button variant="outline-secondary" size="sm" disabled={isBusy} onClick={() => run(AlarmService.resumeSchedule)}>
            Wróć do harmonogramu
          </Button>
        ) : null}
        {status.armed ? (
          <Button variant="outline-danger" size="sm" disabled={isBusy} onClick={() => run(AlarmService.disarm)}>
            Rozbrój
          </Button>
        ) : (
          <Button variant="danger" size="sm" disabled={isBusy} onClick={() => run(AlarmService.arm)}>
            Uzbrój teraz
          </Button>
        )}
      </div>
    </div>
  );
};

AlarmPanel.propTypes = {
  locationId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
};

export { AlarmPanel };
