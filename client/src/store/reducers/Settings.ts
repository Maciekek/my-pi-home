import { createReducer } from './../helpers/reduxHelper';
import { SettingActions } from '../actions/SettingsActions';
import {FixMeLater, IAppStore} from 'models/common';


interface ISettingsDefaultState {
  websocketActive: boolean,
  activeWebsocketConnections: object,
}

const SettingsDefaultState = {
  websocketActive: false,
  activeWebsocketConnections: {},
};

const actionHandlers = {
  [SettingActions.WEBSOCKET_CONNECTED]: (state: IAppStore) => {
    return {
      ...state,
      websocketActive: true,
    };
  },
  [SettingActions.WEBSOCKET_DISCONNECTED]: (state: IAppStore) => {
    return {
      ...state,
      websocketActive: false,
    };
  },
  [SettingActions.ACTIVE_WEBSOCKET_CONNECTIONS]: (state: IAppStore, action: FixMeLater) => {
    console.log('acrive connections', state, action.payload);
    return {
      ...state,
      activeWebsocketConnections: action.payload,
    };
  },
};

export const settingsReducer = createReducer(SettingsDefaultState, actionHandlers);
export type { ISettingsDefaultState };
