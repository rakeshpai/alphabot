// This is a duplex stream that pipes out data from the sensors
// every config.clock milliseconds.
// Motor commands can be piped into this stream, which then get sent
// to the motors.

const { Duplex } = require('stream');
const hal = require('alphabot-hal')();
const { clock } = require('../config');

const hardware = new Duplex({
  readableObjectMode: true,
  writableObjectMode: true,
  write(chunk, encoding, done) {
    hal.wheels.left((chunk.wheels && chunk.wheels.left) || 0);
    hal.wheels.right((chunk.wheels && chunk.wheels.right) || 0);

    done();
  },
  read() {}
});

// Buffer up tick counts
var ticks = { left: 0, right: 0 };
hal.on('leftTick', () => ticks.left++);
hal.on('rightTick', () => ticks.right++);

// Write to the stream every config.clock milliseconds
setInterval(() => {
  hardware.push({
    ticks,
    obstacleSensors: {
      left: hal.obstacleSensors.left(),
      right: hal.obstacleSensors.right()
    },
    batteryVoltage: hal.batteryVoltage(),
    ts: Date.now()
  });

  ticks.left = ticks.right = 0;
}, clock);

// Stop motors when exiting
process.on('exit', () => {
  hal.wheels.left(0);
  hal.wheels.right(0);
});

module.exports = hardware;
