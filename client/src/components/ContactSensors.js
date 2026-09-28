import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import C from 'classnames';
import Card from 'react-bootstrap/Card';

import { ContactsService } from '../services/contacts.services';
import { websocket, WEBSOCKET_MESSAGE_TYPES } from '../utils/Websocket';
import { Icon } from './uiComponents/Icon';

const HISTORY_SIZE = 10;
const TICK_INTERVAL_MS = 30000;

const formatDuration = (date, now) => {
  const minutes = Math.floor((now - new Date(date).valueOf()) / 60000);

  if (minutes < 1) {
    return 'przed chwilą';
  }
  if (minutes < 60) {
    return `${minutes} min temu`;
  }
  if (minutes < 60 * 24) {
    return `${Math.floor(minutes / 60)} godz. ${minutes % 60} min temu`;
  }

  return `${Math.floor(minutes / (60 * 24))} dni temu`;
};

const stateLabel = (isOpen) => (isOpen ? 'Otwarte' : 'Zamknięte');

const ContactSensors = ({ locationId, location }) => {
  const [states, setStates] = useState(null);
  const [history, setHistory] = useState([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    Promise.all([ContactsService.getCurrentStates(locationId), ContactsService.getHistory(locationId, HISTORY_SIZE)])
      .then(([statesResponse, historyResponse]) => {
        setStates(statesResponse.data);
        setHistory(historyResponse.data);
      })
      .catch(() => setStates([]));

    const onMessage = (message) => {
      if (message.event_type !== WEBSOCKET_MESSAGE_TYPES.CONTACT_STATE_CHANGED || message.contact.locationId !== locationId) {
        return;
      }

      const contact = message.contact;
      setStates((current) => [...(current || []).filter((state) => state.sensorId !== contact.sensorId), contact]);
      setHistory((current) => [contact, ...current].slice(0, HISTORY_SIZE));
    };

    websocket.socket.on('message', onMessage);
    const ticker = setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);

    return () => {
      websocket.socket.off('message', onMessage);
      clearInterval(ticker);
    };
  }, [locationId]);

  const configuredSensors = (location && location.contactSettings && location.contactSettings.sensors) || [];
  const configuredById = _.keyBy(configuredSensors, 'sensorId');
  const sensorName = (event) =>
    (configuredById[event.sensorId] && configuredById[event.sensorId].name) || event.name || event.sensorId;

  if (!states || configuredSensors.length === 0) {
    return null;
  }

  const statesById = _.keyBy(states, 'sensorId');
  const rows = configuredSensors.map((sensor) => ({ sensor, state: statesById[sensor.sensorId] }));
  const visibleHistory = history.filter((event) => configuredById[event.sensorId]);

  return (
    <div className={'contact-sensors'}>
      <span className={'contact-sensors__title'}>Czujniki otwarcia:</span>

      {rows.map(({ sensor, state }) => (
        <Card
          className={C('contact-sensors__row', {
            'contact-sensors__row--open': state && state.isOpen,
            'contact-sensors__row--unknown': !state,
          })}
          key={sensor.sensorId}
        >
          <Card.Body>
            <div className={'contact-sensors__info'}>
              <Icon type={state && state.isOpen ? 'door_open' : 'door_front'} size={28} />
              <div>
                <div>{sensor.name || sensor.sensorId}</div>
                <div className={'contact-sensors__row--secondary'}>
                  {state
                    ? `od ${moment(state.date).format('DD.MM HH:mm')} (${formatDuration(state.date, now)})`
                    : `GPIO${sensor.gpio}, czekam na pierwszy odczyt z Raspberry Pi`}
                </div>
              </div>
            </div>

            <span className={'contact-sensors__badge'}>{state ? stateLabel(state.isOpen) : 'Brak danych'}</span>
          </Card.Body>
        </Card>
      ))}

      {visibleHistory.length > 0 ? (
        <div className={'contact-sensors__history location__card'}>
          <div className={'contact-sensors__history-title'}>Ostatnie zdarzenia</div>
          <ul>
            {visibleHistory.map((event) => (
              <li key={event._id || `${event.sensorId}-${event.date}`}>
                <span className={'contact-sensors__history-date'}>{moment(event.date).format('DD.MM HH:mm:ss')}</span>
                <span>{sensorName(event)}</span>
                <span className={C('contact-sensors__history-state', { 'contact-sensors__history-state--open': event.isOpen })}>
                  {stateLabel(event.isOpen)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

ContactSensors.propTypes = {
  locationId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
};

export { ContactSensors };
