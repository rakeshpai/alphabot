import React from 'react';
import { css } from 'glamor';
import store from '../store';

import HeaderInfo from './HeaderInfo';
import Behaviours from './Behaviours';
import TravelledPath from './TravelledPath';
import Motors from './Motors';
import MasterReset from './MasterReset';

css.global('*', { boxSizing: 'border-box', margin: 0, padding: 0 });
css.global('html, body', {
  width: '100%',
  height: '100%',
  fontFamily: `'Courier New', sans-serif`,
  background: '#111',
  color: '#eee'
});

const styles = {
  noConnection: css({
    width: '100%',
    textAlign: 'center',
    paddingTop: 100,
    lineHeight: '2em'
  }),
  heading: css({
    fontSize: '2.5em',
    padding: 10,
    alignSelf: 'center'
  }),
  columns: css({
    display: 'grid',
    gridTemplateColumns: '66.66% 33.33%',
  })
};

export default props => {
  if(!store.connected) return (
    <div className={styles.noConnection}>
      Disconnected<br />
      Attempting reconnection...
    </div>
  );

  return (
    <div>
      <div className={styles.columns}>
        <header className={styles.heading}>
          AlphaBot
        </header>
        <HeaderInfo />
      </div>

      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <TravelledPath />
          <Behaviours />
        </div>

        <div className={styles.rightColumn}>
          <MasterReset />
          <Motors />
        </div>
      </div>
    </div>
  )
};
