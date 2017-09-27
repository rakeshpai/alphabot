const { obj: map } = require('through2-map');
const { enableSlew, slewRate, wheelbase, wheels } = require('../config');
const { notify } = require('../ui-server');
const { bus } = require('../utils');

const previous = { left: 0, right: 0 };

// Caps the maximum change in motor speed to config.slewRate
const slewedSpeed = (oldSpeed, newSpeed) => {
  if(!enableSlew) return newSpeed;

  const deltaSpeed = newSpeed - oldSpeed;
  if(Math.abs(deltaSpeed) <= slewRate) return newSpeed;

  return oldSpeed + (Math.sign(deltaSpeed) * slewRate);
}

module.exports = map(({ speed, steering, emergency = false }) => {
  // vl = (2v - wL) / 2R where v = speed, w = steering
  // vr = (2v + wL) / 2R
  const leftSpeed = ((2 * speed) - (steering * wheelbase)) / wheels.left.diameter;
  const rightSpeed = ((2 * speed) + (steering * wheelbase)) / wheels.right.diameter;

  if(emergency) {
    previous.left = leftSpeed;
    previous.right = rightSpeed;
  } else {
    previous.left = Math.round(slewedSpeed(previous.left, leftSpeed));
    previous.right = Math.round(slewedSpeed(previous.right, rightSpeed));
  }

  notify('motors', previous);
  bus.emit('motors', previous);

  return { wheels: previous };
});
