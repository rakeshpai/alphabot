const { bus } = require('../utils');
const { createBehavior, arbitrate, reset } = require('../utils/behaviour-engine');
const { avoidLeftObstacle, avoidRightObstacle } = require('./avoidObstacle');
const driveStraight = require('../actions/driveStraight');
const goToGoal = require('../actions/go-to-goal');
const stop = require('../actions/stop');
const turn = require('../actions/turn');
const { notify } = require('../ui-server');

const behaviours = [
  avoidLeftObstacle,
  avoidRightObstacle,
  createBehavior({
    name: 'Behavior 1',
    actions: [
      // goToGoal({ x: 1000, y: 0 }),
      // turn({ by: Math.PI }),
      driveStraight({ distance: 1000 }),
      stop()
    ]
  })
];

notify('behaviours', behaviours);

bus.on('resetAll', value => {
  bus.emit('resetOdo');
  reset();
});

module.exports = arbitrate(behaviours);
