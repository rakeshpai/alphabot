const { bus, createBehavior } = require('../utils');
const driveStraight = require('../actions/driveStraight');
const stop = require('../actions/stop');
const turn = require('../actions/turn');
const { notify } = require('../ui-server');

const behaviours = [
  createBehavior({
    name: 'Behavior 1',
    actions: [
      // driveStraight({distance: 1000}),
      turn({ by: Math.PI }),
      stop(),
    ]
  })
];

notify('behaviours', behaviours);

let currentBehavior;
const setBehaviour = behaviour => {
  currentBehavior = behaviour;
  notify('behaviourIndex', behaviour ? behaviours.indexOf(behaviour) : null);
}

bus.on('resetAll', value => {
  bus.emit('resetOdo');
  setBehaviour(null);
});

module.exports = sensors => {
  const subsume = behaviours
                    .filter(b => b.enabled && b.needsControl)
                    .find(b => b.needsControl(sensors));

  if(subsume && currentBehavior !== subsume) {
    setBehaviour(subsume);
    currentBehavior.execute(() => {
      currentBehavior = null;
    });
  }

  if(!currentBehavior) {
    setBehaviour(behaviours[0]);
    currentBehavior.execute(() => {
      console.notify('Done executing behaviour');
      enabled = false;
      notify('enabled', false);
    });
  }

  return currentBehavior.tick(sensors);
};
