const { createAction } = require("../utils");
const { topSpeed, steeringPid } = require("../config");
const PID = require("../utils/pid");

const square = num => Math.pow(num, 2);

const isWithin = (range, a) => b => (square(a.x - b.x) + square(a.y - b.y)) < square(range);

module.exports = createAction({
  name: "Go to goal",
  action: (goal = ({x:0, y:0}), done) => {
    const isCloseBy = isWithin(300, goal);
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
        speed: isCloseBy(odometry) ? (topSpeed * 0.8) : topSpeed,
        steering: phiDesiredPID.update(odometry.phi)
      }
    });
  }
});
