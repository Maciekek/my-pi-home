import axios from 'axios';
import { LocationsService } from '../../services/locations.services';

const locationActions = {
  GET_ALL_LOCATIONS: 'GET_ALL_LOCATIONS',
  LOADING_LOCATIONS_START: 'LOADING_LOCATIONS_START',
  LOADING_LOCATIONS_END: 'LOADING_LOCATIONS_END',
  LOADED_LOCATION_SETTINGS: 'LOADED_LOCATION_SETTINGS',
  STORE_LOCATION_RECENTLY_SENSORS: 'STORE_LOCATION_RECENTLY_SENSORS',
};

const loadingLocationsStart = () => {
  console.log('loadingLocationsStart', locationActions.LOADING_LOCATIONS_START);
  return {
    type: locationActions.LOADING_LOCATIONS_START,
  };
};

const loadingLocationsEnd = (payload) => {
  return {
    type: locationActions.LOADING_LOCATIONS_END,
    payload,
  };
};

const loadedLocationSettings = (locationId, payload) => {
  return {
    type: locationActions.LOADED_LOCATION_SETTINGS,
    payload: {
      locationId: locationId,
      ...payload,
    },
  };
};

const getLocationSettings = (locationId) => {
  return (dispatch) => {
    LocationsService.getLocation(locationId).then((response) => {
      dispatch(loadedLocationSettings(locationId, response.data));
    });
  };
};

const getAllLocations = () => {
  return (dispatch) => {
    dispatch(loadingLocationsStart());
    return axios.get('/api/locations').then((response) => {
      dispatch(loadingLocationsEnd(response.data));
    });
  };
};

const storeLocationRecentlySensors = (locationId, recentlySensors) => {
  return {
    type: locationActions.STORE_LOCATION_RECENTLY_SENSORS,
    payload: {
      locationId: locationId,
      recentlySensors,
    },
  };
};

export { locationActions, getAllLocations, getLocationSettings, storeLocationRecentlySensors };
