const EE = require('events');
const { notify } = require('../ui-server');

module.exports = {
  bus: new EE,
  restrictAngle: angle => Math.atan2(Math.sin(angle), Math.cos(angle)),

  createAction: ({ name, action }) => (...args) => ({
    name, args,
    execute: done => action(...args, done),
  }),

  createBehavior: ({ name, actions, condition, needsControl, enabled = true }) => {
    let currentActionIndex, tickHandler;

    const executeNextAction = done => {
      currentActionIndex++;

      if(currentActionIndex > actions.length - 1) return done();
      tickHandler = actions[currentActionIndex].execute(() => executeNextAction(done));
      notify('actionIndex', currentActionIndex);
    }

    return {
      name, needsControl, enabled, actions,
      execute: done => {
        currentActionIndex = -1;
        executeNextAction(done);
      },
      currentAction: () => actions[currentActionIndex],
      tick: sensors => tickHandler(sensors)
    };
  }
};
