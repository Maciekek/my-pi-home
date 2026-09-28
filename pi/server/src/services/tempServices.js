const { apiClient } = require('./apiClient');

const config = require('config');
const apiUrl = config.get('api.url');
console.log(apiUrl);

const tempServices = {
  addNewTemps: (body) => {
    console.log('addNewTemps - start');
    apiClient
      .post(`${apiUrl}/temps`, body)
      .then(function (response) {
        console.log('addNewTemps success saved new temps values', body);
      })
      .catch(function (error) {
        console.log('addNewTemps error', error.errno || error.response.data);
      });
  },

  getLocationSettings: (locationId) => {
    return apiClient.get(`${apiUrl}/locations/${locationId}`);
  },
};

module.exports = tempServices;
