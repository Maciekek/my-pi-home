console.log('----', process.argv.slice(2)[0], '------');

if (process.argv.slice(2)[0] === '-pi') {
  const piReader = require('./prodDs18b20Reader.js');

  module.exports = piReader;
  return;
} else {
  const mockReader = require('./mockds18b20Reader.js');
  module.exports = mockReader;
}
