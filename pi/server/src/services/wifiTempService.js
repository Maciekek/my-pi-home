const axios = require('axios');

const wifiTempService = {
  getTempsByIp(ip) {
    return axios
      .get(`http://${ip}`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log('addNewTemps error', error.errno || error.response.data);
      });
  },
};

module.exports = wifiTempService;
