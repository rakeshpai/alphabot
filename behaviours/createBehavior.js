module.exports = ({name, actions}) => {
  let actionsList;
  let currentAction;
  let tickHandler;

  const executeNextAction = done => {
    if(!actionsList.length) return done();

    currentAction = actionsList.shift();
    tickHandler = currentAction(() => executeNextAction(done));
  }

  return {
    name,
    execute: done => {
      actionsList = [...actions];
      executeNextAction(done);
    },
    currentAction: () => currentAction,
    tick: sensors => tickHandler(sensors)
  }
}
