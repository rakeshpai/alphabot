const { notify } = require('../ui-server');

module.exports.createAction = ({ name, action }) => (options = {}) => ({
  name, options,
  execute: done => action(options, done),
});

module.exports.createBehavior = ({ name, actions, needsControl, enabled = true }) => {
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

let currentBehaviourIndex = -1;

const setBehaviour = behaviourIndex => {
  currentBehaviourIndex = behaviourIndex;
  notify('behaviourIndex', behaviourIndex);
}

module.exports.arbitrate = behaviours => sensors => {
  const currentBehaviour = () => currentBehaviourIndex === -1 ? null : behaviours[currentBehaviourIndex];

  const subsume = behaviours.find(b => b.enabled && b.needsControl && b.needsControl(sensors));

  if(subsume && currentBehaviour() !== subsume) {
    setBehaviour(behaviours.indexOf(subsume));
    currentBehaviour().execute(() => {
      setBehaviour(-1);
    });
  } else if(!currentBehaviour()) {
    setBehaviour(behaviours.findIndex(b => b.enabled && !b.needsControl));
    if(currentBehaviour()) {
      currentBehaviour().execute(() => {
        //console.log('Done executing behaviour');
      });
    }
  }

  return currentBehaviour().tick(sensors);
};

module.exports.reset = () => setBehaviour(-1);
