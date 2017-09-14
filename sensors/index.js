const { obj: map } = require('through2-map');
const odometry = require('./odometry');
const { log } = require('../ui-server');

module.exports = map(sensors => {
  const processed = {
    raw: sensors,
    odometry: odometry({ticks: sensors.ticks}),
    ts: sensors.ts
  };

  log('sensed', processed);

  return processed;
});
