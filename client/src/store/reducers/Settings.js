import {createReducer} from "./../helpers/reduxHelper";
import {SettingActions} from "../actions/SettingsActions";

const SettingsDefaultState = {
  websocketActive: false,
  activeWebsocketConnections: {}
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
  },
  [SettingActions.ACTIVE_WEBSOCKET_CONNECTIONS]: (state, action) => {
    console.log('acrive connections', state, action.payload);
    return {
      ...state,
      activeWebsocketConnections: action.payload
    }
  }
};

export const settingsReducer = createReducer(SettingsDefaultState, actionHandlers);