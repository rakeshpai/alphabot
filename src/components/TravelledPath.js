import React from 'react';
import Window from './Window';
import store from '../store';
import loadConditionally from './loadConditionally';
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
    width: '100%',
    height: 300
  })
};

const Odometry = loadConditionally(() => store.sensed, () => (
  <div className={styles.odometry}>
    <div className={styles.odometryHeading}>Odometry</div>
    <span>x:</span> <span className={styles.num}>{store.sensed.odometry.x.toFixed(1)}mm</span>
    <span>y:</span> <span className={styles.num}>{store.sensed.odometry.y.toFixed(1)}mm</span>
    <span>Φ:</span> <span className={styles.num}>{(store.sensed.odometry.phi * 180 / Math.PI).toFixed(1)}°</span>
  </div>
));

const Bot = ({ x, y, phi }) => (
  <polygon
    fill='#20D'
    points={`1.4,0 -1,-1 -0.3,0 -1,1`}
    transform={`translate(${x}, ${y}) rotate(${phi*180/Math.PI}) scale(10)`} />
)

const displayLength = 300;
const aspectRatio = 13/5; // Chosen by the scientific method of observing screen and checking if it looks pretty
const padding = 10;

const min = arr => Math.min.apply(null, arr);
const max = arr => Math.max.apply(null, arr);

const viewBox = () => {
  const sliceOfTimeSeries = store.timeSeriesData.odometry.slice(0, displayLength).map(({ data }) => data);
  const xCoords = sliceOfTimeSeries.map(({ x }) => x);
  const yCoords = sliceOfTimeSeries.map(({ y }) => y);

  const minX = min(xCoords);
  const maxX = max(xCoords);
  const minY = min(yCoords);
  const maxY = max(yCoords);

  let xCoord = minX;
  let yCoord = minY;
  let width = (maxX - minX);
  let height = (maxY - minY);

  if(width / height > aspectRatio) {
    // Too wide. Adjust height.
    height = width / aspectRatio;
    yCoord = ((maxY + minY) / 2) - (height / 2);
  } else if(width / height < aspectRatio) {
    // Too narrow. Adjust width.
    width = height * aspectRatio;
    xCoord = ((maxX + minX) / 2) - (width / 2);
  }

  return `${xCoord-padding} ${yCoord-padding} ${width+2*padding} ${height+2*padding}`;
}

const color = index => `#${
  Math.round(255*(displayLength-index)/displayLength)
    .toString(16)
    .padStart(2, '0')
    .repeat(3)
}`;

export default loadConditionally(() => store.timeSeriesData.odometry && store.timeSeriesData.odometry.length > 0, props => (
  <Window heading='Travelled Path'>
    <div className={css({position: 'relative'})}>
      <svg className={styles.svg} viewBox={viewBox()} transform='scale(1, -1)'
        preserveAspectRatio='xMidYMid meet'>
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
        <Bot {...store.timeSeriesData.odometry[0].data} />
      </svg>
      <Odometry />
    </div>
  </Window>
));
