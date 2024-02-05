console.log('----', process.argv.slice(2)[0], '------');

if (process.argv.slice(2)[0] === '-pi') {
  const piReader = require('./piReader.js');

  module.exports = piReader;
  return;
} else {
  const mockReader = require('./mockReader.js');
  module.exports = mockReader;
}
