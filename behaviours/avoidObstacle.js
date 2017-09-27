const { createBehavior } = require('../utils/behaviour-engine');
const { obstacleThreshold } = require('../config');
const stop = require('../actions/stop');
const turn = require('../actions/turn');
const driveStraight = require('../actions/driveStraight');

const behaviourKey = direction => `avoid${direction == 'left' ? 'Left' : 'Right'}Obstacle`;

module.exports = ['left', 'right'].reduce((obj, direction) => ({
  ...obj,
  [behaviourKey(direction)]: createBehavior({
    name: `Avoid ${direction} obstacle`,
    needsControl: sensors => sensors.raw.obstacleSensors[direction] < obstacleThreshold,
    actions: [
      stop({ emergency: true }),
      driveStraight({ direction: 'reverse', distance: 300 }),
      stop(),
      turn({ by: (direction === 'left' ? -1 : 1) * Math.PI/18 }),
      driveStraight({ distance: 100 })
    ]
  })
}), {});
