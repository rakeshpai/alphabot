const EE = require('events');

const square = num => Math.pow(num, 2);

const utils = {
  bus: new EE,
  restrictAngle: angle => Math.atan2(Math.sin(angle), Math.cos(angle)),

  distance: (p1, p2) => Math.sqrt(Math.abs(square(p1.x - p2.x) - square(p1.y - p2.y))),
  isWithin: (range, a) => b => utils.distance(a, b) < range
};

module.exports = utils;
