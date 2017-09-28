const { createBehavior } = require("../utils/behaviour-engine");
const driveStraight = require("../actions/driveStraight");
const stop = require("../actions/stop");
const turn = require("../actions/turn");

module.exports = createBehavior({
  name: "Follow a square perimeter",
  actions: [
    driveStraight({distance: 500}),
    stop(),
    turn({by: -Math.PI/2}),
    driveStraight({distance: 500}),
    stop(),
    turn({by: -Math.PI/2}),
    driveStraight({distance: 500}),
    stop(),
    turn({by: -Math.PI/2}),
    driveStraight({distance: 500}),
    stop(),
    turn({by: -Math.PI/2}),
    stop()
  ]
});
