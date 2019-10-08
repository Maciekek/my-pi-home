import {createReducer} from "./../helpers/reduxHelper";
import {locationActions} from "./../actions/LocationsActions";



const locationDefaultState = {
  isLoading: false,
  locations: []
};

const actionHandlers = {
  [locationActions.GET_ALL_LOCATIONS]: (state) => ({
    ...state,
    locations: 1,
  }),
  [locationActions.LOADING_LOCATIONS_START]: (state) => ({
    ...state,
    isLoading: true
  }),
  [locationActions.LOADING_LOCATIONS_END]: (state, {payload}) => ({
    ...state,
    isLoading: false,
    locations: payload
  }),

};


export const locationReducer = createReducer(locationDefaultState, actionHandlers);