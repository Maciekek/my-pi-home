const axios = require('axios');
const debug = require('debug')('temps-service');

const tempServices = {

    addNewTemps: (body) => {
        debug('addNewTemps - start');
        axios.post('http://77.55.217.143:8888/api/temps', body)
            .then(function (response) {
                console.log('addNewTemps success saved new temps values', body)
            })
            .catch(function (error) {
                console.log('addNewTemps error', error.errno || error.response.data)
                // console.log(error);
            });
    }

};

module.exports = tempServices