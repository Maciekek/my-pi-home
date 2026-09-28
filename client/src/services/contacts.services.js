import axios from 'axios';

const ContactsService = {
  getCurrentStates: (locationId) => {
    return axios.get(`/api/contacts/${locationId}/state`);
  },

  getHistory: (locationId, n, { sensorId, before } = {}) => {
    return axios.get(`/api/contacts/${locationId}/history/${n}`, { params: { sensorId, before } });
  },
};

export { ContactsService };
