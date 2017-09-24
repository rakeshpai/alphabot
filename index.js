const hardware = require('./streams/hardware');
const interpretSensors = require('./sensors');
const brains = require('./streams/brains');
const setMotorSpeeds = require('./streams/motor-command');
require('./ui-server'); // Not strictly needed, as it's automatically init'd.

hardware
  .pipe(interpretSensors)
  .pipe(brains)
  .pipe(setMotorSpeeds)
  .pipe(hardware);
