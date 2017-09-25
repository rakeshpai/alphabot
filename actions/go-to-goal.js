const { createAction } = require("../utils");
const config = require("../config");
const PID = require("../utils/pid");

const isWithin = (range, a) => b => ((a.x - b.x) ^ 2) + ((a.y - b.y) ^ 2) < (range ^ 2);

const halt = { speed: 0, steering: 0 };

module.exports = createAction({
  name: "Go to goal",
  action: (goal = ({x:0, y:0}), done) => {
    const startTime = Date.now();

    const isCloseBy = isWithin(300, goal);
    const hasReached = isWithin(30, goal);

    const phiDesiredPID = new PID(0.5);
    phiDesiredPID.angle = true;

    let isGoalSet = false;

    return ({ odometry }) => {
      if(!isGoalSet) {
        phiDesiredPID.setTarget(Math.atan2(goal.y - odometry.y, goal.x - odometry.x));
        isGoalSet = true;
      }

      if(hasReached(odometry)) {
        done();
        return halt;
      }

      const speed = isCloseBy(odometry) ? (config.topSpeed * 0.8) : config.topSpeed;
      const steering = phiDesiredPID.update(odometry.phi);

      if(Date.now() - startTime < 5000) {
        return { speed, steering };
      } else {
        return halt;
      }
    });
  }
});
