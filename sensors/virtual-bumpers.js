module.exports = (odometry, polygonPoints) => {
  const distances = polygonPoints.map((currentPoint, index) => {
    const previousPoint = index === 0 ? polygonPoints[polygonPoints.length - 1] : polygonPoints[index - 1];

    if(previousPoint.x === currentPoint.x) {
      // Vertical line. Distance is difference between x values.
      return Math.abs(odometry.x - currentPoint.x);
    } else {
      // y = mx + c => m = slope, c = y-intercept
      const slope = (currentPoint.y - previousPoint.y) / (currentPoint.x - previousPoint.x);
      const yIntercept = currentPoint.y - (slope * currentPoint.x);

      // d = |Ax + By  + C\ / sqrt(A^2 + B^2) where line = Ax + By + C = 0
      // Converting line from y=mx+c, A = slope, B = -1, C = yIntercept
      return Math.abs((slope * odometry.x) - odometry.y + yIntercept) / Math.sqrt(Math.pow(slope, 2) + 1);
    }
  });

  return distances.some(x => x < 50);
}
