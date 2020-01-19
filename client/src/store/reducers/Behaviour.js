import {createReducer} from "./../helpers/reduxHelper";
import {SettingActions} from "../actions/SettingsActions";
import {BehaviourActions} from "../actions/BehaviourActions";

const BehaviourDefaultState = {
  confirmationModalParams: {},
  confirmationModalVisible: false

};

const actionHandlers = {
  [BehaviourActions.CONFIRM_OPERATION]: (state, {payload}) => {
    return {
      ...state,
      confirmationModalVisible: payload.visible,
      confirmationModalParams: payload
    }
  },

  [BehaviourActions.CLOSE_MODAL]: (state) => {
    return {
      ...state,
      confirmationModalVisible: false,
      confirmationModalParams: {}
    }
  },

};

export const behaviourReducer = createReducer(BehaviourDefaultState, actionHandlers);