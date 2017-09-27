const { createAction } = require('../utils/behaviour-engine');

module.exports = createAction({
  name: 'Stop',
  action: ({ emergency=false }, done) => {
    const startTime = Date.now();

    return sensors => {
      if(emergency) {
        return { speed: 0, steering: 0, { emergency: true } }
      } else if (
        Date.now() - startTime > 500
        && sensors.raw.left === 0 && sensors.raw.right === 0
      ) {
        done();
        return { speed: 0, steering: 0 }
      }

    };
  }
});
