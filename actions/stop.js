const { createAction } = require('../utils/behaviour-engine');

module.exports = createAction({
  name: 'Stop',
  action: done => {
    const startTime = Date.now();

    return sensors => {
      if(
        Date.now() - startTime > 500
        && sensors.raw.left === 0 && sensors.raw.right === 0
      ) done();

      return { speed: 0, steering: 0 }
    };
  }
});
