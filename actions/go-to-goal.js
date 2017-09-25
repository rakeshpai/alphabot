const { createAction } = require('../utils/behaviour-engine');
const { drivingSpeeds, steeringPid } = require('../config');
const { distance } = require('../utils')
const PID = require('../utils/pid');

const isWithin = (range, a) => b => distance(a, b) < range;

module.exports = createAction({
  name: 'Go to goal',
  action: (goal = ({x:0, y:0}), done) => {
    const isCloseBy = isWithin(200, goal);
    const hasReached = isWithin(30, goal);

    const phiDesiredPID = new PID(...steeringPid);
    phiDesiredPID.angle = true;

    let isGoalSet = false;

    return ({ odometry }) => {
      if(!isGoalSet) {
        phiDesiredPID.setTarget(Math.atan2(goal.y - odometry.y, goal.x - odometry.x));
        isGoalSet = true;
      }

      if(hasReached(odometry)) {
        done();
        return { speed: 0, steering: 0 };
      }

      return {
        speed: isCloseBy(odometry) ? drivingSpeeds.slow : drivingSpeeds.fast,
        steering: phiDesiredPID.update(odometry.phi)
      }
    };
  }
});
