const { wheels, encoderTicksPerRotation, wheelbase } = require("../config");
const { bus, restrictAngle } = require("../utils");

const previous = {
  x: 0, y: 0, phi: 0
};

const distanceTurnedByWheel = (wheel, ticks, lastMotorCommand) => {
  // D = 2 pi R * delta-ticks / ticks per rotation
  return Math.PI *
    wheels[wheel].diameter *
    ticks *
    Math.sign(lastMotorCommand[wheel]) / encoderTicksPerRotation;
};

module.exports = ({ ticks, lastMotorCommand }) => {
  const leftWheelDistance = distanceTurnedByWheel("left", ticks.left, lastMotorCommand);
  const rightWheelDistance = distanceTurnedByWheel("right", ticks.right, lastMotorCommand);

  // Dc = (Dl + Dr) / 2
  const distanceOfCenter = (leftWheelDistance + rightWheelDistance) / 2;

  // x' = x + Dc cos(phi)
  // y' = y + Dc sin(phi)
  // phi' = phi + (Dr - Dl) / L

  previous.x += distanceOfCenter * Math.cos(previous.phi);
  previous.y += distanceOfCenter * Math.sin(previous.phi);
  previous.phi += (rightWheelDistance - leftWheelDistance) / wheelbase;
  previous.phi = restrictAngle(previous.phi);

  return previous;
};

module.exports.reset = () => {
  previous.x = 0;
  previous.y = 0;
  previous.phi = 0;
};

bus.on("resetOdo", module.exports.reset);
