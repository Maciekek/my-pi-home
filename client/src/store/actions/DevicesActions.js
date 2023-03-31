import { DevicesService } from 'services/deviceServices/devices.service';

const DevicesActions = {
  GET_DEVICES_BY_LOCATION_ID: 'GET_DEVICES_BY_LOCATION_ID',
  DEVICES_BY_ID_LOADED: 'DEVICES_BY_ID_LOADED',
};

const devicesByIdLoaded = (payload) => {
  return {
    payload,
    type: DevicesActions.DEVICES_BY_ID_LOADED,
  };
};

const getDevicesByLocationId = (locationId) => {
  return (dispatch) => {
    DevicesService.getAllDevicesByLocationId(locationId).then((response) => {
      dispatch(devicesByIdLoaded(response.data));
    });
  };
};

const relayToggle = (relayId) => {
  return (dispatch) => {
    DevicesService.realyToggle(relayId).then((response) => {
      console.log('qweqwe', response);
    });
  };
};

export { DevicesActions, devicesByIdLoaded, getDevicesByLocationId };
