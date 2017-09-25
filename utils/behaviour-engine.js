const { notify } = require('../ui-server');

module.exports.createAction = ({ name, action }) => (...args) => ({
  name, args,
  execute: done => action(...args, done),
});

module.exports.createBehavior = ({ name, actions, condition, needsControl, enabled = true }) => {
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
};

let currentBehaviourIndex;

const setBehaviour = behaviourIndex => {
  currentBehaviourIndex = behaviourIndex;
  notify('behaviourIndex', behaviourIndex);
}

// TODO: FIXME
module.exports.arbitrate = behaviours => sensors => {
  const currentBehaviour = () => currentBehaviourIndex === -1 ? null : behaviours[currentBehaviourIndex];
  
  const subsume = behaviours.find(b => b.enabled && b.needsControl && b.needsControl(sensors));

  if(subsume && currentBehaviour() !== subsume) {
    setBehaviour(behaviours.indexOf(subsume));
    currentBehaviour().execute(() => {
      setBehaviour(-1);
    });
  }

  if(!currentBehaviour()) {
    setBehaviour(0);
    currentBehaviour().execute(() => {
      console.notify('Done executing behaviour');
      enabled = false;
      notify('enabled', false);
    });
  }

  return behaviours[currentBehaviourIndex].tick(sensors);
};

module.exports.reset = () => setBehaviour(null);
