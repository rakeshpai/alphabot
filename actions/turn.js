const { createAction } = require('../utils');
const PID = require('../utils/pid');
const { topSpeed, steeringPid: steeringPidConfig } = require('../config');

const turnForTime = (time, direction, done) => {
  const dir = ['right', 'clockwise', -1].some(d => d === direction) ? -1 : 1;
  let startTime;

  return sensors => {
    if(!startTime) startTime = Date.now();

    if(Date.now() - startTime > time) {
      done();
      return {speed: 0, steering: 0};
    }

    return {speed: 0, steering: dir * config.topSpeed * 0.1};
  }
}

const turnByAngle = (by, done) => {
  const steeringPid = new PID(...steeringPidConfig);
  steeringPid.angle = true;

  let isGoalSet = false;
  let target;

  return sensors => {
    if(!isGoalSet) {
      target = sensors.odometry.phi + by;
      steeringPid.setTarget(target);
      isGoalSet = true;
    }

    if(
      Math.abs(target - sensors.odometry.phi) < 0.05
      && sensors.raw.left === 0 && sensors.raw.right === 0
    ) done();

    return {speed: 0, steering: steeringPid.update(sensors.odometry.phi)};
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
