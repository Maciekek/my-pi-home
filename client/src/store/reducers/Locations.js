import { createReducer } from './../helpers/reduxHelper';
import { locationActions } from './../actions/LocationsActions';

const locationDefaultState = {
  isLoading: false,
  locations: [],
  locationSensors: {},
};

const actionHandlers = {
  [locationActions.GET_ALL_LOCATIONS]: (state) => ({
    ...state,
    locations: 1,
  }),
  [locationActions.LOADING_LOCATIONS_START]: (state) => ({
    ...state,
    isLoading: true,
  }),
  [locationActions.LOADING_LOCATIONS_END]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    locations: payload,
  }),
  [locationActions.LOADED_LOCATION_SETTINGS]: (state, { payload }) => {
    console.log('payload!!', payload);

    const locations = { ...state.locations };
    locations[payload.locationId] = payload;
    return {
      ...state,
      isLoading: false,
      locations,
    };
  },
  [locationActions.STORE_LOCATION_RECENTLY_SENSORS]: (state, { payload }) => {
    const locationSensorsUpdated = { ...state.locationSensors };
    locationSensorsUpdated[payload.locationId] = payload.recentlySensors;
    console.log(payload);

    return {
      ...state,
      isLoading: false,
      locationSensors: { ...locationSensorsUpdated },
    };
  },
};

export const locationReducer = createReducer(locationDefaultState, actionHandlers);
