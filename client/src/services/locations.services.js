import axios from 'axios';

const LocationsService = {
  getAllLocations: () => {
    return axios.get('/api/locations');
  },

  getLocation: (locationId) => {
    return axios.get(`/api/locations/${locationId}`);
  },

  getLocationSettings: (locationId) => {
    return axios.get(`/api/locations/${locationId}`);
  },

  updateLocation: (locationId, data) => {
    return axios.put(`/api/locations/${locationId}`, data);
  },

  createNewLocation: (form) => {
    return axios.post(`/api/locations`, form);
  },

  deleteLocation: (locationId) => {
    return axios.delete(`/api/locations/${locationId}`);
  },
};

export { LocationsService };
