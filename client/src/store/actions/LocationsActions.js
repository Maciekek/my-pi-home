import axios from "axios";

const locationActions = {
  GET_ALL_LOCATIONS: "GET_ALL_LOCATIONS",
  LOADING_LOCATIONS_START: "LOADING_LOCATIONS_START",
  LOADING_LOCATIONS_END: "LOADING_LOCATIONS_END"
};

const loadingLocationsStart = () => {
  console.log('loadingLocationsStart', locationActions.LOADING_LOCATIONS_START);
  return {
    type: locationActions.LOADING_LOCATIONS_START,
  }
};


const loadingLocationsEnd = (payload) => {
  return {
    type: locationActions.LOADING_LOCATIONS_END,
    payload
  }
};


const getAllLocations = () => {
  return dispatch => {
  console.log("getAllLocations 2", dispatch)
    dispatch(loadingLocationsStart());
    return axios.get('/api/locations').then((response) => {
      console.log("END END END ", response);
      dispatch(loadingLocationsEnd(response.data));

    })
  }
}

export {
  locationActions,
  getAllLocations
}