import {createReducer} from "./../helpers/reduxHelper";
import {DevicesActions} from "../actions/DevicesActions";

const DevicesDefaultState = {
  devices: {}
};

const actionHandlers = {
  [DevicesActions.DEVICES_BY_ID_LOADED]: (state, {payload}) => {
    const data = {};

    if (payload.length === 0) {
      return {...state}
    }

    data[payload[0].locationId] = payload;

    return {
      ...state,
      devices: data
  }},

};


export const devicesReducer = createReducer(DevicesDefaultState, actionHandlers);
