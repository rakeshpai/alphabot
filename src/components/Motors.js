import React from 'react';
import Window from './Window';
import store from '../store';
import { css } from 'glamor';

const styles = {
  legend: css({
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    marginTop: 10
  }),
  trace: css({
    display: 'grid',
    gridTemplateColumns: '10px 110px 1fr',
    gridColumnGap: 10,
    marginBottom: 5,

    '&:nth-child(2n+1)': {
      paddingRight: 5
    },

    '&:nth-child(2n)': {
      paddingLeft: 5
    }
  }),
  num: css({
    textAlign: 'right',
  })
};

const width = 200;
const height = 150;

const traces = [
  { key: 'motorLeft', color: 'green', max: 120, name: 'Left PWM' },
  { key: 'motorRight', color: 'aquamarine', max: 120, name: 'Right PWM' },
  { key: 'ticksLeft', color: 'orange', max: 25, name: 'Left ticks' },
  { key: 'ticksRight', color: 'yellow', max: 25, name: 'Right ticks' }
];

const scale = (value, key) => {
  const coordinate = value * height / traces.find(t => t.key === key).max;
  return coordinate < 0 ? -coordinate : coordinate;
}

export default props => {
  if(!store.motors || !store.sensed) return <div>Loading...</div>;

  return (
    <Window heading='Wheels'>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        className={css({width: '100%'})} preserveAspectRatio='none'
        transform='scale(1, -1)'>
        {traces.map(({ key, color }) => (
          <polyline stroke={color} strokeWidth='0.5%' fill='none' key={key}
            points={store.timeSeriesData[key]
              .slice(0, width)
              .map(({ data }, index) => `${index},${scale(data, key)}`)
              .join(' ')
            } />
        ))}
      </svg>
      <div className={styles.legend}>
        {traces.map(trace => (
          <div className={styles.trace} key={trace.key}>
            <span className={css({background: trace.color})}> </span>
            <span>{trace.name}</span>
            <span className={styles.num}>{store.timeSeriesData[trace.key][0].data}</span>
          </div>
        ))}
      </div>
    </Window>
  );
};
