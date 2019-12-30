import {createReducer} from "./../helpers/reduxHelper";
import {SettingActions} from "../actions/SettingsActions";

const SettingsDefaultState = {
  websocketActive: false
};

const actionHandlers = {
  [SettingActions.WEBSOCKET_CONNECTED]: (state) => {
    return {
      ...state,
      websocketActive: true
    }
  },
  [SettingActions.WEBSOCKET_DISCONNECTED]: (state) => {
    return {
      ...state,
      websocketActive: false
    }
  }
};

export const settingsReducer = createReducer(SettingsDefaultState, actionHandlers);