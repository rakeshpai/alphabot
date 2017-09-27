const { createAction } = require('../utils/behaviour-engine');
const { steeringPid, drivingSpeeds } = require('../config');
const { distance: euclideanDistance } = require('../utils');
const PID = require('../utils/pid');

module.exports = createAction({
  name: 'Drive straight',
  action: ({ distance, time, direction } = {}, done) => {
    const dir = ['reverse', 'back', -1, 'backwards'].some(x => x==direction) ? -1 : 1;

    let startTime;
    const startLocation = {};

    const phiDesiredPID = new PID(...steeringPid);
    phiDesiredPID.angle = true;

    let isGoalSet = false;

    const speed = ({ x, y }, done) => {
      if(distance) {
        // console.log('driving with distance');
        const distanceTravelled = euclideanDistance({x,y}, startLocation);
        const distanceToGoal = Math.abs(distance - distanceTravelled);

        // console.log(distanceTravelled);

        if(distanceToGoal < 50) { done(); return 0; }
        else if(distanceToGoal < 400) dir * drivingSpeeds.slow;
        return dir * drivingSpeeds.fast;
      } else if(time) {
        const elapsedTime = Date.now() - startTime;
        const timeRemaining = time - elapsedTime;

        console.log('time based travel', timeRemaining, elapsedTime, dir);
        if(timeRemaining < 30) { done(); return 0; }
        if(timeRemaining > 400) return dir * drivingSpeeds.fast;
        return dir * drivingSpeeds.slow;
      } else {
        console.log('Driving without arguments');
        return dir * drivingSpeeds.fast;
      }
    }

    return sensors => {
      if(!isGoalSet) {
        phiDesiredPID.setTarget(sensors.odometry.phi);
        startTime = Date.now();
        startLocation.x = sensors.odometry.x;
        startLocation.y = sensors.odometry.y;
        isGoalSet = true;
      }

      return {
        speed: speed(sensors.odometry, done),
        steering: phiDesiredPID.update(sensors.odometry.phi)
      };
    }
  }
});
