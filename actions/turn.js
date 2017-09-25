const PID = require('../utils/pid');
const { createAction } = require('../utils/behaviour-engine');
const { steeringSpeed, steeringPid } = require('../config');

const turnForTime = (time, direction, done) => {
  const dir = ['right', 'clockwise', -1].some(d => d === direction) ? -1 : 1;
  let startTime;

  return sensors => {
    if(!startTime) startTime = Date.now();

    if(Date.now() - startTime > time) {
      done();
      return { speed: 0, steering: 0 };
    }

    return { speed: 0, steering: dir * steeringSpeed };
  }
}

const turnByAngle = (by, done) => {
  const phiDesiredPID = new PID(...steeringPid);
  phiDesiredPID.angle = true;

  let isGoalSet = false;
  let target;

  return sensors => {
    if(!isGoalSet) {
      target = sensors.odometry.phi + by;
      phiDesiredPID.setTarget(target);
      isGoalSet = true;
    }

    if(
      Math.abs(target - sensors.odometry.phi) < 0.05
      && sensors.raw.left === 0 && sensors.raw.right === 0
    ) done();

    return {speed: 0, steering: phiDesiredPID.update(sensors.odometry.phi)};
  }
}

module.exports = createAction({
  name: 'Turn',
  action: ({by, time, direction}, done) => {
    if(time) {
      return turnForTime(time, direction, done);
    } else {
      return turnByAngle(by, done);
    }
  }
});
