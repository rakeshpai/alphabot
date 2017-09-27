const { bus } = require('../utils');
const { createBehavior, arbitrate, reset } = require('../utils/behaviour-engine');
const { avoidLeftObstacle, avoidRightObstacle } = require('./avoidObstacle');
const driveStraight = require('../actions/driveStraight');
const followSquarePerimeter = require('./follow-square-perimeter');
const goToGoal = require('../actions/go-to-goal');
const stop = require('../actions/stop');
const turn = require('../actions/turn');
const { notify } = require('../ui-server');

const behaviours = [
  avoidLeftObstacle,
  avoidRightObstacle,
  // followSquarePerimeter,
  createBehavior({
    name: 'Behavior 1',
    actions: [
      // goToGoal({ x: 3000, y: 0 }),
      // turn({ by: Math.PI/9 }),
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
