import React from 'react';
import Window from './Window';
import loadConditionally from './loadConditionally';
import { css } from 'glamor'
import store from '../store';

const styles = {
  columns: css({
    display: 'grid',
    gridTemplateColumns: '30% 1fr'
  }),
  behaviourList: css({
    border: '1px solid green',

    '& li': {
      listStyle: 'none',
      padding: 3,
      borderBottom: '1px solid green'
    }
  }),
  behaviourHeading: css({
    fontSize: '1.1em',
    fontWeight: 'normal',
    textAlign: 'center',
    padding: 5
  }),
  disabledBehaviour: css({
    fontStyle: 'italic',
    color: '#666'
  }),
  active: css({
    background: 'green',
    color: 'white',

    '&:before': {
      content: '‣ '
    }
  }),
  actions: css({
    padding: '0 10px'
  }),
  actionList: css({
    '& li': {
      listStyle: 'none',
      padding: 3
    }
  })
};

const currentBehaviour = () => store.behaviourIndex === -1 ? null : store.behaviours[store.behaviourIndex];

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

const actionOptions = options => {
  if(Object.keys(options).length === 0) return '()';

  return `({ ${Object.keys(options).map(key => {
    let value = options[key];
    if(isNumeric(options[key]) && !Number.isInteger(options[key])) {
      value = options[key].toFixed(2);
    }

    return `${key}: ${value}`
  }).join(', ')} })`;
}

export default loadConditionally(() => store.behaviours, props => (
  <Window heading='Behaviours'>
    <div className={styles.columns}>
      <div>
        <h2 className={styles.behaviourHeading}>List of behaviours</h2>
        <ol className={styles.behaviourList}>
          {store.behaviours.map((behaviour, index) => (
            <li key={index} className={css(
                !behaviour.enabled && styles.disabledBehaviour,
                behaviour === currentBehaviour() && styles.active
              )}>
              {behaviour.name}
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.actions}>
        {
          !currentBehaviour()
          ? <span>No active behaviour</span>
          : (
            <div>
              <h2 className={styles.behaviourHeading}>Actions for '{currentBehaviour().name}'</h2>
              <ul className={styles.actionList}>
                {currentBehaviour().actions.map((action, index) => (
                  <li key={`${store.behaviourIndex}_${index}`} className={index === store.actionIndex ? styles.active : ''}>
                    {action.name}
                    {' '}
                    {actionOptions(action.options)}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </div>
    </div>
  </Window>
));
