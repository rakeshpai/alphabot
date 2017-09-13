const { obj: map } = require("through2-map");
const config = require("./config");
const { log } = require('./ui-server');

const previous = { left: 0, right: 0 };

// Caps the maximum change in motor speed to config.slewRate
const slewedSpeed = (oldSpeed, newSpeed) => {
  if(!config.enableSlew) return newSpeed;

  const deltaSpeed = newSpeed - oldSpeed;
  if(Math.abs(deltaSpeed) <= config.slewRate) return newSpeed;

  return oldSpeed + (Math.sign(deltaSpeed) * config.slewRate);
}

module.exports = map(({speed, steering, ts}) => {
  // vl = (2v - wL) / 2R where v = speed, w = steering
  // vr = (2v + wL) / 2R
  const leftSpeed = ((2 * speed) - (steering * config.wheelbase)) / config.wheels.left.diameter;
  const rightSpeed = ((2 * speed) + (steering * config.wheelbase)) / config.wheels.right.diameter;

  previous.left = Math.round(slewedSpeed(previous.left, leftSpeed));
  previous.right = Math.round(slewedSpeed(previous.right, rightSpeed));

  log('motors', previous);

  return { wheels: previous, ts };
});
