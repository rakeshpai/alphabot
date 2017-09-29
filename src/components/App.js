import React from 'react';
import { css } from 'glamor';
import store from '../store';

import HeaderInfo from './HeaderInfo';
import Behaviours from './Behaviours';
import TravelledPath from './TravelledPath';
import Motors from './Motors';
import Sensors from './Sensors';
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
    padding: 10,
    alignSelf: 'center'
  }),
  columns: css({
    display: 'grid',
    gridTemplateColumns: '66.66% 33.33%',
  })
};

const Header = () => (
  <header className={styles.heading}>
    <pre>{
`  __   __    ____  _  _   __   ____   __  ____
 / _\\ (  )  (  _ \\/ )( \\ / _\\ (  _ \\ /  \\(_  _)
/    \\/ (_/\\ ) __/) __ (/    \\ ) _ ((  O ) )(
\\_/\\_/\\____/(__)  \\_)(_/\\_/\\_/(____/ \\__/ (__)
`}</pre>
  </header>
);

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
        <Header />
        <HeaderInfo />
      </div>

      <div className={styles.columns}>
        <div>
          <TravelledPath />
          <Behaviours />
        </div>

        <div>
          <MasterReset />
          <Motors />
          <Sensors />
        </div>
      </div>
    </div>
  )
};
