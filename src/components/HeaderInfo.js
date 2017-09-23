import React from 'react';
import store from '../store';
import loadConditionally from './loadConditionally';
import { button, blinker } from '../styles';
import { css } from 'glamor';

const styles = {
  columns: css({
    display: 'grid',
    gridTemplateColumns: '50% 50%'
  }),
  battery: css({
    padding: 10,
    textAlign: 'center',
    alignSelf: 'center'
  }),
  enable: css({
    textAlign: 'center',
    padding: 10,
    alignSelf: 'center',

    '& .enabled': { color: 'green' },
    '& .disabled': { color: 'red', animation: `${blinker} 1s linear infinite` }
  })
};

export default loadConditionally(() => store.sensed, props => (
  <div className={styles.columns}>
    <div className={styles.battery}>
      Battery:
      {' '}
      <span className={css({
          color: store.sensed && (
            store.sensed.raw.batteryVoltage > 7 ? 'green' :
              store.sensed.raw.batteryVoltage < 6.2 ? 'red' : 'orange'
          )
        })}>
        {store.sensed && store.sensed.raw.batteryVoltage.toFixed(2)}v
      </span>
      <br />
      {store.sensed && store.sensed.raw.batteryVoltage < 6.1 && 'Shutdown imminent'}
    </div>
    <div className={styles.enable}>
      Mode: {store.mode === 'manual' ? 'Manual' : 'Auto'}
      <br />
      <button className={button} onClick={() => store.setMode(store.mode === 'manual' ? 'auto' : 'manual')}>
        Change to {store.mode === 'manual' ? 'auto' : 'manual'}
      </button>
    </div>
  </div>
));
