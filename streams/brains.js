const { bus } = require('../utils');
const { obj: map } = require('through2-map');
const powerOff = require('power-off');
const behave = require('../behaviours');
const { drivingSpeeds, steeringSpeed } = require('../config');
const createLeakyIntegrator = require('../utils/leaky-integrator');
const { notify } = require('../ui-server');

// Mode selection
let mode;
const setMode = m => { mode = m; notify('mode', mode); };

bus.on('setMode', setMode);
setMode('manual');

// Shutdown if needed
let shutdownInitiated = false;
const li = createLeakyIntegrator();
const shutdownIfNeeded = batteryVoltage => {
  if(shutdownInitiated) return;

  li.leak(1);
  if(batteryVoltage < 6) li.add(2);
  if(li.level() > 20) {
    powerOff(() => {});
    shutdownInitiated = true;
  }
};

// Manual control
const manualControl = ({ remoteCommand }) => {
  let command = { velocity: 0, rotation: 0 };

  if(!remoteCommand) return command;

  switch(remoteCommand) {
    case 'forward': command.velocity = drivingSpeeds.medium; break;
    case 'left': command.rotation = steeringSpeed; break;
    case 'right': command.rotation = -steeringSpeed; break;
    case 'reverse': command.velocity = -drivingSpeeds.medium; break;
  }

  return command;
};

module.exports = map(sensors => {
  shutdownIfNeeded(sensors.batteryVoltage);

  if(mode === 'manual') return manualControl(sensors);

  return behave(sensors);
});
