const { obj: map } = require('through2-map');
const odometry = require('./odometry');
// const virtualBumpers = require('./virtual-bumpers');
const { notify } = require('../ui-server');

module.exports = map(sensors => {
  const processed = {
    raw: sensors,
    odometry: odometry({ticks: sensors.ticks}),
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
