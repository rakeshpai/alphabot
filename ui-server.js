const { Server, OPEN } = require('ws');

const wss = new Server({ port: 8080 });

const state = {};
const notifsToStoreInState = ['behaviours', 'behaviourIndex', 'actionIndex', 'mode'];

const broadcast = data => {
  Array.from(wss.clients).filter(c => c.readyState === OPEN).forEach(c => c.send(data));
};

const createNotification = (logType, data) => {
  return JSON.stringify({ type: 'notification', logType, data });
}

wss.on('connection', ws => {
  const { bus } = require('./utils');   // Delayed require to avoid circular dependency issues

  // Send state
  Object.keys(state).forEach(type => ws.send(createNotification(type, state[type])));

  ws.on('message', data => {
    data = JSON.parse(data);

    if(data.type !== 'command') return;

    switch(data.command) {
      case 'setMode': bus.emit('setMode', data.args === 'manual' ? 'manual' : 'auto'); break;
      case 'resetAll': bus.emit('resetAll'); break;
      case 'motorCommand':
        if(['forward', 'left', 'right', 'reverse'].includes(data.args)) {
          bus.emit('motorCommand', data.args);
        }
        break;
    }
  });
});

module.exports = {
  notify: (type, data) => {
    broadcast(createNotification(type, data));
    if(notifsToStoreInState.includes(type)) state[type] = data;
  }
};
