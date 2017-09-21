import WebSocket from 'reconnecting-websocket';

const ws = new WebSocket(`ws://${document.location.hostname}:8080/`, 'protocolOne');

const sendCommand = (command, args) => {
  ws.send(JSON.stringify({type: 'command', command, args}));
}

const store = {
  connected: false,

  timeSeriesData: {},

  motorCommand: command => sendCommand('motorCommand', command),
  resetAll: () => sendCommand('resetAll'),
  setMode: mode => sendCommand('setMode', mode)
};

const addTimeSeriesData = (key, data) => {
  if(!store.timeSeriesData[key]) store.timeSeriesData[key] = [];
  const length = store.timeSeriesData[key].unshift({ data, ts: Date.now() });
  if(length > 1000) store.timeSeriesData[key].pop();
}

const render = () => { if(store.onChange) store.onChange() };

ws.addEventListener('open', () => { store.connected = true; render(); });
ws.addEventListener('close', () => { store.connected = false; render(); });

const knownLogs = ['sensed', 'motors', 'behaviours', 'behaviourIndex', 'actionIndex', 'mode'];

ws.onmessage = evt => {
  const event = JSON.parse(evt.data);

  if(event.type === 'notification') {
    if(knownLogs.includes(event.logType)) store[event.logType] = event.data;
    if(event.logType === 'sensed') {
      addTimeSeriesData('ticksLeft', event.data.raw.ticks.left);
      addTimeSeriesData('ticksRight', event.data.raw.ticks.right);
      addTimeSeriesData('odometry', event.data.odometry);
    }
    if(event.logType === 'motors') {
      addTimeSeriesData('motorLeft', event.data.left);
      addTimeSeriesData('motorRight', event.data.right);
    }
  }

  render();
}

export default store;
