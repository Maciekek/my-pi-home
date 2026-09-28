import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import C from 'classnames';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { ContactsService } from '../services/contacts.services';
import { LoadingIndicator } from './loadingIndicator';

const PAGE_SIZE = 50;

const formatStateDuration = (ms) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  if (seconds < 60) {
    return `${seconds} s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} godz. ${minutes % 60} min`;
  }

  return `${Math.floor(hours / 24)} dni ${hours % 24} godz.`;
};

const ContactHistoryModal = ({ show, onHide, locationId, sensor, latestState }) => {
  const [events, setEvents] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadPage = (before) =>
    ContactsService.getHistory(locationId, PAGE_SIZE, { sensorId: sensor.sensorId, before }).then((response) => {
      setHasMore(response.data.length === PAGE_SIZE);
      return response.data;
    });

  useEffect(() => {
    if (!show) {
      return;
    }

    setEvents(null);
    loadPage().then(setEvents);
  }, [show, locationId, sensor.sensorId]);

  // Prepend live changes that arrive over the websocket while the modal is open.
  useEffect(() => {
    if (!latestState || !events) {
      return;
    }
    if (!events.length || new Date(latestState.date) > new Date(events[0].date)) {
      setEvents([latestState, ...events]);
    }
  }, [latestState]);

  const loadMore = () => {
    setIsLoadingMore(true);
    loadPage(events[events.length - 1].date)
      .then((older) => setEvents([...events, ...older]))
      .finally(() => setIsLoadingMore(false));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Historia: {sensor.name || sensor.sensorId}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={'contact-history'}>
        {!events ? (
          <LoadingIndicator />
        ) : events.length === 0 ? (
          <p className={'contact-history__empty'}>Brak zdarzeń.</p>
        ) : (
          <table className={'contact-history__table'}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Stan</th>
                <th>Czas trwania</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => {
                const until = index === 0 ? Date.now() : new Date(events[index - 1].date).valueOf();
                const duration = formatStateDuration(until - new Date(event.date).valueOf());

                return (
                  <tr key={event._id || event.date}>
                    <td className={'contact-history__date'}>{moment(event.date).format('DD.MM.YYYY HH:mm:ss')}</td>
                    <td
                      className={C('contact-history__state', { 'contact-history__state--open': event.isOpen })}
                    >
                      {event.isOpen ? 'Otwarte' : 'Zamknięte'}
                    </td>
                    <td className={'contact-history__duration'}>{index === 0 ? `trwa ${duration}` : duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Modal.Body>
      <Modal.Footer>
        {hasMore ? (
          <Button variant="outline-secondary" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Ładuję…' : 'Załaduj starsze'}
          </Button>
        ) : null}
        <Button variant="primary" onClick={onHide}>
          Zamknij
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ContactHistoryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  locationId: PropTypes.string.isRequired,
  sensor: PropTypes.object.isRequired,
  latestState: PropTypes.object,
};

export { ContactHistoryModal };
