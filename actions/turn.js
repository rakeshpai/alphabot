const PID = require('../utils/pid');
const { restrictAngle } = require('../utils');
const { createAction } = require('../utils/behaviour-engine');
const createLeakyIntegrator = require('../utils/leaky-integrator');
const { steeringSpeed, steeringPid } = require('../config');

const turnForTime = (time, direction, done) => {
  const dir = ['right', 'clockwise', -1].some(d => d === direction) ? -1 : 1;
  let startTime;

  return sensors => {
    if(!startTime) startTime = Date.now();

    if(Date.now() - startTime > time) {
      done();
      return { velocity: 0, rotation: 0 };
    }

    return { velocity: 0, rotation: dir * steeringSpeed };
  }
}

const turnByAngle = (by, done) => {
  const li = createLeakyIntegrator();
  let phiDesiredPID;

  let isGoalSet = false;
  let target;

  return ({ odometry, ticks }) => {
    if(!isGoalSet) {
      target = odometry.phi + by;
      const error = Math.abs(target - odometry.phi);

      phiDesiredPID = new PID(23/error, 0, 0);
      phiDesiredPID.angle = true;
      phiDesiredPID.setTarget(target);

      isGoalSet = true;
    }

    if(
      Math.abs(restrictAngle(target - odometry.phi)) < 0.1
      && ticks.left === 0 && ticks.right === 0
    ) done();

    // Leaky integrator checks if we're making progress
    li.leak(1);
    if(ticks.left === 0 && ticks.right === 0) li.add(2);
    if(li.level() > 30) {
      console.log(`TURN: We aren't making progress. Bailing out.`);
      done();
    }

    return {
      velocity: 0,
      rotation: phiDesiredPID.update(odometry.phi)
    };
  }
}

module.exports = createAction({
  name: 'Turn',
  action: ({ by, time, direction }, done) => (
    time ? turnForTime(time, direction, done) : turnByAngle(by, done)
  )
});
