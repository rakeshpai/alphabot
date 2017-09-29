const odometry = require('./odometry');
const virtualBumpers = require('./virtual-bumpers');
const { bus } = require('../utils');
const remoteCommand = require('./remote-command');
const { notify } = require('../ui-server');

let lastMotorCommand = { left: 0, right: 0 };
bus.on('motors', mc => lastMotorCommand = mc);

module.exports = sensors => {
  const odo = odometry({ ticks: sensors.ticks, lastMotorCommand });

  const sensed = {
    ...sensors,
    odometry: odo,
    virtualBump: virtualBumpers(odo, [
      {x: -600, y: 600},
      {x: -600, y: -600},
      {x: 600, y: -600},
      {x: 600, y: 600}
    ]),
    remoteCommand: remoteCommand(),
    lastMotorCommand
  };

  notify('sensed', sensed);

  return sensed;
};
