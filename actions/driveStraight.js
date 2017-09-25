const { createAction } = require('../utils');
const config = require('../config');
const PID = require('../utils/pid');

const square = num => Math.pow(num, 2);

module.exports = createAction({
  name: 'Drive straight',
  action: ({ distance, time, direction } = {}, done) => {
    const dir = ['reverse', 'back', -1, 'backwards'].some(x => x==direction) ? -1 : 1;

    let startTime;
    const startLocation = {};

    const phiDesiredPID = new PID(...config.steeringPid);
    phiDesiredPID.angle = true;

    let isGoalSet = false;

    const speed = ({ x, y }, done) => {
      if(distance) {
        // console.log('driving with distance');
        const distanceTravelled = Math.sqrt(square(x - startLocation.x) + square(y - startLocation.y));
        const distanceToGoal = Math.abs(distance - distanceTravelled);

        //console.log(distanceTravelled);

        if(distanceToGoal < 30) { done(); return 0; }
        else if(distanceToGoal < 400) dir * config.topSpeed * 0.7;
        return dir * config.topSpeed;
      } else if(time) {
        const elapsedTime = Date.now() - startTime;
        const timeRemaining = time - elapsedTime;

        console.log('time based travel', timeRemaining, elapsedTime, dir);
        if(timeRemaining < 20) { done(); return 0; }
        if(timeRemaining > 1000) return dir * config.topSpeed;
        return dir * config.topSpeed * timeRemaining / 100;
      } else {
        console.log('Driving without arguments');
        return dir * config.topSpeed;
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
})
