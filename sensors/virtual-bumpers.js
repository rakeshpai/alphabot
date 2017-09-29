const inside = require('point-in-polygon'); // Isn't npm just awesome?

module.exports = ({ x, y }, polygonPoints) => {
  return !inside([x,y], polygonPoints.map(({x,y}) => [x,y]));
}
