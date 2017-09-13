const hardware = require('./hardware');
const { obj: map } = require('through2-map');
const interpretSensors = require('./sensors');
const setMotorSpeeds = require('./motor-command');
require('./ui-server');

const brains = map(sensors => {
  return { speed: 0, steering: 0 };
});

hardware
  .pipe(interpretSensors)
  .pipe(brains)
  .pipe(setMotorSpeeds)
  .pipe(hardware);
