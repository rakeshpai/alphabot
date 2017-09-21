import React from 'react';
import Window from './Window';
import store from '../store';
import { css } from 'glamor';

const styles = {
  odometry: css({
    display: 'grid',
    gridTemplateColumns: '5px 80px',
    gridGap: '2px 20px',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '5px 10px',
    border: '1px solid #666'
  }),
  odometryHeading: css({
    gridColumn: '1 / span 2',
    textAlign: 'center',
    paddingBottom: 3
  }),
  num: css({ textAlign: 'right' }),
  svg: css({
    border: '1px solid #666',
    height: 30,
    width: '100%',
    height: 300
  })
};

const Odometry = () => (
  store.sensed ? (
    <div className={styles.odometry}>
      <div className={styles.odometryHeading}>Odometry</div>
      <span>x:</span> <span className={styles.num}>{store.sensed.odometry.x.toFixed(1)}mm</span>
      <span>y:</span> <span className={styles.num}>{store.sensed.odometry.y.toFixed(1)}mm</span>
      <span>Φ:</span> <span className={styles.num}>{(store.sensed.odometry.phi * 180 / Math.PI).toFixed(1)}°</span>
    </div>
  ) : <div>Loading...</div>
)

const displayLength = 300;
const padding = 10;

const viewBox = () => {
  const sliceOfTimeSeries = store.timeSeriesData.odometry.slice(0, displayLength).map(({ data }) => data);
  const xCoords = sliceOfTimeSeries.map(({ x }) => x);
  const yCoords = sliceOfTimeSeries.map(({ y }) => y);

  const minX = Math.min.apply(null, xCoords);
  const maxX = Math.max.apply(null, xCoords);
  const minY = Math.min.apply(null, yCoords);
  const maxY = Math.max.apply(null, yCoords);

  return `${minX-padding} ${minY-padding} ${maxX-minX+2*padding} ${maxY-minY+2*padding}`;
}

const color = index => `#${
  Math.round(255*(displayLength-index)/displayLength)
    .toString(16)
    .padStart(2, '0')
    .repeat(3)
}`;

export default props => {
  if(!store.timeSeriesData.odometry) return <div>Loading...</div>;

  return (
    <Window heading='Travelled Path'>
      <div className={css({position: 'relative'})}>
        <svg className={styles.svg} viewBox={viewBox()} transform='scale(1, -1)'>
          {
            store.timeSeriesData.odometry
              .slice(0, displayLength)
              .map(({ data, ts }, index, odometry) => {
                if(index === odometry.length - 1) return null;  // last datapoint

                const { x: nextX, y: nextY } = odometry[index+1].data;

                return (
                  <line x1={data.x} y1={data.y} x2={nextX} y2={nextY} strokeWidth='.5%'
                    key={ts} stroke={color(index)} />
                )
              })
              .reverse()  // Put oldest point first so that it goes behind.
          }
        </svg>
        <Odometry />
      </div>
    </Window>
  )
};
