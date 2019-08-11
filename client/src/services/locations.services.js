import axios from "axios";

const LocationsService = {
    getAllLocations: () => {
        return axios.get('/api/locations')
    },

    getLocation: (locationId) => {
      return axios.get(`/api/locations/${locationId}`)
    }
};

export {LocationsService}