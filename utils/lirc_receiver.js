const EE = require('events');
const split = require('split2');
const { existsSync } = require('fs');
const { createConnection } = require('net');

const lircdPath = '/var/run/lirc/lircd';

const ee = new EE;

module.exports = ee;

if(existsSync(lircdPath)) {
  createConnection(lircdPath).pipe(split()).on('data', chunk => {
    const [ code, repeat, key, remote ] = chunk.split(' ');
    ee.emit('keypress', { code, repeat, key, remote });
  });
} else {
  console.log('LIRC not installed. Remote control won\'t work.');
}
