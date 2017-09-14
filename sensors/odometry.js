const config = require("../config");
const { bus, restrictAngle } = require("../utils");

const distanceTurnedByWheel = (wheel, ticks) => {
  // D = 2 pi R * delta-ticks / ticks per rotation
  return Math.PI * config.wheels[wheel].diameter * ticks / config.encoderTicksPerRotation;
};

const previous = {
  x: 0, y: 0, phi: 0
};

module.exports = sensors => {
  const leftWheelDistance = distanceTurnedByWheel("left", sensors.ticks.left);
  const rightWheelDistance = distanceTurnedByWheel("right", sensors.ticks.right);

  // Dc = (Dl + Dr) / 2
  const distanceOfCenter = (leftWheelDistance + rightWheelDistance) / 2;

  // x' = x + Dc cos(phi)
  // y' = y + Dc sin(phi)
  // phi' = phi + (Dr - Dl) / L

  previous.x += distanceOfCenter * Math.cos(previous.phi);
  previous.y += distanceOfCenter * Math.sin(previous.phi);
  previous.phi += (rightWheelDistance - leftWheelDistance) / config.wheelbase;
  previous.phi = restrictAngle(previous.phi);

  return previous;
};

module.exports.reset = () => {
  previous.x = 0;
  previous.y = 0;
  previous.phi = 0;
};

bus.on("resetOdo", module.exports.reset);
