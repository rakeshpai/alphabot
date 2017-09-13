const { Server, OPEN } = require('ws');

const wss = new Server({ port: 8080 });

const broadcast = data => {
  wss.clients.forEach(client => {
    if(client.readyState === OPEN) {
      client.send(data);
    }
  })
};

wss.on('connection', ws => {
  ws.on('message', data => {
    // New connection
  });
});

module.exports = {
  log: (type, data) => {
    broadcast(JSON.stringify({ type: 'log', logType: type, data, ts: Date.now() }));
  }
}
