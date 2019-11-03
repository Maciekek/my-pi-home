import {DashboardsService} from "../../services/dashboards.services";

const DashboardActions = {
  GET_DASHBOARD_BY_LOCATION_ID: "GET_DASHBOARD_BY_LOCATION_ID",
  DASHBOARD_BY_ID_LOADED: "DASHBOARD_BY_ID_LOADED",
  UPDATE_DASHBOARD_BY_ID_LOADED: "UPDATE_DASHBOARD_BY_ID_LOADED",
  REMOVE_WIDGET_BY_INDEX: "REMOVE_WIDGET_BY_INDEX",
};

const createDashboardByLocationId= (locationId, payload) => {
  return (dispatch) => {
    DashboardsService.createDashboardByLocationId(locationId, payload).then(response =>{
      dispatch(dashboardByIdLoaded(response.data))
    }).catch(() => {
    })
  }
};

const updateDashboardByLocationId= (locationId, payload) => {
  return (dispatch) => {
    DashboardsService.updateDashboardByLocationId(locationId, payload).then(response =>{
      dispatch(dashboardByIdLoaded(response.data))
    }).catch(() => {
    })

  }
};

const removeWidgetByIndex = (locationId, widgetIndex) => {
  return (dispatch) => {
    DashboardsService.removeWidgetById(locationId, widgetIndex).then(response =>{
      dispatch(dashboardByIdLoaded(response.data))
    }).catch(() => {
    })

  }
};

const dashboardByIdLoaded = (payload) => {
  return {
    payload,
    type: DashboardActions.DASHBOARD_BY_ID_LOADED
  }
};

const getDashboardByLocationIdFront = (locationId) => {
    return (dispatch) => {
      DashboardsService.getDashboardByLocationId(locationId).then(response =>{
        dispatch(dashboardByIdLoaded(response.data))
      })
    }
};


export {
  DashboardActions,
  getDashboardByLocationIdFront,
  updateDashboardByLocationId,
  createDashboardByLocationId,
  removeWidgetByIndex
}