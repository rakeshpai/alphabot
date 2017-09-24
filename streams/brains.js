const { bus } = require('../utils');
const { obj: map } = require('through2-map');
const { notify } = require('../ui-server');
const powerOff = require('power-off');
const manualControl = require('./manual-control');

let mode = 'manual';
notify('mode', mode);

bus.on('setMode', value => {
  mode = value;
  notify('mode', value);
});

let shutdownInitiated = false;
const shutdown = () => {
  if(shutdownInitiated) return;

  powerOff(() => {});
  shutdownInitiated = true;
}

module.exports = map(sensors => {
  if(sensors.raw.batteryVoltage < 6) shutdown();

  if(mode === 'manual') return manualControl(sensors);

  return { speed: 0, steering: 0 };
});
