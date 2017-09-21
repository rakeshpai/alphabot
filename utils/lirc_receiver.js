const EE = require('events');
const split = require('split2');
const { createConnection } = require('net');

const ee = new EE;

module.exports = ee;

createConnection('/var/run/lirc/lircd').pipe(split()).on('data', chunk => {
  const [ code, repeat, key, remote ] = chunk.split(' ');
  ee.emit('keypress', { code, repeat, key, remote });
});
