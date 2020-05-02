import {createReducer} from "./../helpers/reduxHelper";
import {DashboardActions} from "../actions/DashboardActions";

const DashboardDefaultState = {
  dashboards: {}
};

const actionHandlers = {
  [DashboardActions.DASHBOARD_BY_ID_LOADED]: (state, a) => {
    const dashboardConfig = {};
    dashboardConfig[a.payload.locationId] = a.payload;


    return {
      ...state,
      ...dashboardConfig
  }},


};


export const dashboardsReducer = createReducer(DashboardDefaultState, actionHandlers);
