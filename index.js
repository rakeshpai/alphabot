const hardware = require('./hardware');
const interpretSensors = require('./sensors');
const brains = require('./brains');
const setMotorSpeeds = require('./motor-command');
require('./ui-server'); // Not strictly needed, as it's automatically init'd.

hardware
  .pipe(interpretSensors)
  .pipe(brains)
  .pipe(setMotorSpeeds)
  .pipe(hardware);
