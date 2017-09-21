import React from 'react';
import Window from './Window';
import { css } from 'glamor';
import { button } from '../styles';
import store from '../store';

export default props => (
  <Window heading='Master reset'>
    <div className={css({textAlign: 'center'})}>
      <button className={button} onClick={store.resetAll}>
        Reset everything
      </button>
    </div>
  </Window>
);
