const fs = require('fs');
let rawdata = fs.readFileSync('./CONFIG.json');
let config = JSON.parse(rawdata);

module.exports = config;

