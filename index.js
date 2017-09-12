const hardware = require('./hardware');
const { obj: map } = require('through2-map');

// Give the robot a placeholder brain.
// Act braindead, ignore sensors, don't move
const brains = map(sensors => ({
  wheels: { left: 0, right: 0 }
}))

hardware.pipe(brains).pipe(hardware);
