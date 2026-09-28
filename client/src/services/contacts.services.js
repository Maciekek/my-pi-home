import axios from 'axios';

const ContactsService = {
  getCurrentStates: (locationId) => {
    return axios.get(`/api/contacts/${locationId}/state`);
  },

  getHistory: (locationId, n) => {
    return axios.get(`/api/contacts/${locationId}/history/${n}`);
  },
};

export { ContactsService };
