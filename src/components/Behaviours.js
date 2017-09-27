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
    '& li': {
      listStyle: 'none',
      padding: 3
    }
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
  actionList: css({
    '& li': {
      listStyle: 'none',
      padding: 3
    }
  })
};

const currentBehaviour = () => store.behaviourIndex === -1 ? null : store.behaviours[store.behaviourIndex];

export default loadConditionally(() => store.behaviours, props => (
  <Window heading='Behaviours'>
    <div className={styles.columns}>
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
      <div>
        {
          !currentBehaviour()
          ? <span>No active behaviour</span>
          : (
            <ul className={styles.actionList}>
              {currentBehaviour().actions.map((action, index) => (
                <li key={`${store.behaviourIndex}_${index}`} className={index === store.actionIndex ? styles.active : ''}>
                  {action.name}
                  {' '}
                  ({JSON.stringify(action.options)})
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  </Window>
));
