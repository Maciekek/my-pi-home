import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { TempsService } from '../services/temps.services';
import { storeLocationRecentlySensors } from '../store/actions/LocationsActions';
import { LoadingIndicator } from './loadingIndicator';

const RecentlyUsedSensors = ({ locationId, onSensorClick }) => {
  const dispatch = useDispatch();
  const recentlyUsed = useSelector((state) => {
    return state.locationStore.locationSensors;
  });
  const sensors = recentlyUsed[locationId] || [];

  if (_.isEmpty(sensors)) {
    console.log('should load data');
    TempsService.getNLastTemps(locationId, 100).then((temps) => {
      dispatch(storeLocationRecentlySensors(locationId, _.map(_.uniqBy(temps.data, 'sensorId'), 'sensorId')));
    });

    return <LoadingIndicator />;
  }

  return (
    <div className={'recently-used-sensors'}>
      Ostanio używane czujki (klikając dodasz czujke do listy):
      <span>
        {sensors.map((sensor) => {
          return (
            <span onClick={(e) => onSensorClick(e, sensor)} className={'recently-used-sensors__item'}>
              {' '}
              {sensor}{' '}
            </span>
          );
        })}
      </span>
    </div>
  );
};

RecentlyUsedSensors.propTypes = {
  locationId: PropTypes.string,
  onSensorClick: PropTypes.func,
};

export { RecentlyUsedSensors };
