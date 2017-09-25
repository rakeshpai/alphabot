const { bus } = require('../utils');
const { createBehavior, arbitrate, reset } = require('../utils/behaviour-engine');
const driveStraight = require('../actions/driveStraight');
const goToGoal = require('../actions/go-to-goal');
const stop = require('../actions/stop');
const turn = require('../actions/turn');
const { notify } = require('../ui-server');

const behaviours = [
  createBehavior({
    name: 'Behavior 1',
    actions: [
      goToGoal({ x: 1000, y: 0 }),
      // driveStraight({ distance: 500 }),
      // turn({ by: Math.PI }),
      stop(),
    ]
  })
];

notify('behaviours', behaviours);

bus.on('resetAll', value => {
  bus.emit('resetOdo');
  reset();
});

module.exports = arbitrate(behaviours);
