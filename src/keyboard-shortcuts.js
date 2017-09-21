import store from './store';
import mousetrap from 'mousetrap';

const debounce = (time, fn) => {
  let lastCallTime;

  return () => {
    if(!lastCallTime || Date.now() - lastCallTime > time) {
      lastCallTime = Date.now();
      fn();
    }
  }
}

// Bind keyboard shortcuts
const directionKeys = {
  w: 'forward',
  a: 'left',
  s: 'reverse',
  d: 'right',
  up: 'forward',
  down: 'reverse',
  left: 'left',
  right: 'right'
};

Object.keys(directionKeys).forEach((key, i, obj) => {
  mousetrap.bind(key, debounce( 50, () => {
    store.motorCommand(directionKeys[key]);
  }));
});

mousetrap.bind('r', debounce(500, store.resetAll));
mousetrap.bind('m', debounce(500, () => store.setMode(store.mode==='manual'?'auto':'manual')));
