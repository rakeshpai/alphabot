const { createAction } = require('../utils/behaviour-engine');

module.exports = createAction({
  name: 'Stop',
  action: ({ emergency }, done) => {
    const startTime = Date.now();

    return ({ ticks: { left, right }}) => {
      if(Date.now() - startTime > 500 && left === 0 && right === 0) done();

      return { velocity: 0, rotation: 0, emergency };
    };
  }
});
