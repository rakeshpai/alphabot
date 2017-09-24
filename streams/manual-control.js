const { bus } = require('../utils');
const { topSpeed } = require('../config');
const lirc = require('../utils/lirc_receiver');

const remoteKeysToInput = {
  'KEY_CHANNEL': 'forward',
  'KEY_PREVIOUS': 'left',
  'KEY_PLAYPAUSE': 'right',
  'KEY_NEXT': 'reverse'
}

let input = null;
let inputTimer = null;

const setInput = newInput => {
  if(inputTimer) clearTimeout(inputTimer);

  input = newInput;
  inputTimer = setTimeout(() => input = null, 150);
}

lirc.on('keypress', ({ key }) => {
  if(key in remoteKeysToInput) setInput(remoteKeysToInput[key]);
});

bus.on('motorCommand', setInput);

module.exports = sensors => {
  let command = { speed: 0, steering: 0 };

  if(input) {
    switch(input) {
      case 'forward': command.speed = topSpeed; break;
      case 'left': command.steering = 15; break;
      case 'right': command.steering = -15; break;
      case 'reverse': command.speed = -1 * topSpeed; break;
    }
  }

  return command;
}
