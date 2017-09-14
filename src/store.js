import WebSocket from 'reconnecting-websocket';

const wss = new WebSocket(`ws://${document.location.hostname}:8080/`, "protocolOne");

const sendCommand = (type, data) => {
  wss.send(JSON.stringify({type, data}));
}

const store = {
  connected: false,
  sensed: null,
  motors: null,

  resetOdometry: () => sendCommand("resetOdo")
};

const render = () => { if(store.onChange) store.onChange() };

wss.addEventListener("open", () => { store.connected = true; render(); });
wss.addEventListener("close", () => { store.connected = false; render(); });

wss.onmessage = evt => {
  const event = JSON.parse(evt.data);

  if(event.type === 'log') {
    if(event.logType === 'sensed') {
      store.sensed = event.data;
    } else if(event.logType === 'motors') {
      store.motors = event.data;
    }
  }

  render();
}

export default store;
