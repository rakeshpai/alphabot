const { obj: map } = require('through2-map');
const odometry = require('./odometry');
// const virtualBumpers = require('./virtual-bumpers');
const { notify } = require('../ui-server');
const { bus } = require("../utils");

let lastMotorCommand = { left: 0, right: 0 };
bus.on('motors', mc => lastMotorCommand = mc);

module.exports = map(sensors => {
  const processed = {
    raw: sensors,
    odometry: odometry({ ticks: sensors.ticks, lastMotorCommand }),
    lastMotorCommand,
    ts: sensors.ts
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
});
