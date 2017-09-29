const odometry = require('./odometry');
const { notify } = require('../ui-server');
const { bus } = require("../utils");
// const virtualBumpers = require('./virtual-bumpers');

let lastMotorCommand = { left: 0, right: 0 };
bus.on('motors', mc => lastMotorCommand = mc);

module.exports = sensors => {
  const processed = {
    raw: sensors,
    odometry: odometry({ ticks: sensors.ticks, lastMotorCommand }),
    lastMotorCommand
  };

  // processed.virtualBump = virtualBumpers(processed.odometry, [
  //   {x: -600, y: 600},
  //   {x: -600, y: -600},
  //   {x: 600, y: -600},
  //   {x: 600, y: 600}
  // ]);
  //
  // if(processed.virtualBump === true) console.log('VIRTUAL BUMP');

  notify('sensed', processed);

  return processed;
};
