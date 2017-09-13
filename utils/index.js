const EE = require('events');

module.exports = {
  bus: new EE,
  restrictAngle: angle => Math.atan2(Math.sin(angle), Math.cos(angle))
};
