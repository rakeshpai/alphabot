import React from 'react';
import Window from './Window';
import loadConditionally from './loadConditionally';
import store from '../store';

export default loadConditionally(() => store.sensed, props => (
  <Window heading='Other sensors'>
    Left obstacle: {store.sensed.obstacleSensors.left}<br />
    Right obstacle: {store.sensed.obstacleSensors.right}
  </Window>
));
