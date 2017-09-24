import React from 'react';
import Window from './Window';
import loadConditionally from './loadConditionally';
import { css } from 'glamor'
import store from '../store';

const styles = {
  columns: css({
    display: 'grid',
    gridTemplateColumns: '50% 50%'
  }),
  behaviourList: css({
    '& li': {
      listStyle: 'none'
    }
  })
}

export default loadConditionally(() => store.behaviours, props => (
  <Window heading='Behaviours'>
    <div className={styles.columns}>
      <ol className={styles.behaviourList}>
        {store.behaviours.map((behaviour, index) => (
          <li key={index}>
            <input type='checkbox' checked={behaviour.enabled} />
            {' '}
            {behaviour.name}
            {' '}
            {index === store.behaviourIndex && 'active'}
          </li>
        ))}
      </ol>
      <div>
        {
          !('behaviourIndex' in store) || store.behaviourIndex === null
          ? <span>No active behaviour</span>
          : (
            <ul>
              {store.behaviours[store.behaviourIndex].actions.map((action, index) => (
                <li key={index}>
                  {action.name}
                  {' '}
                  {index === store.actionIndex && 'active'}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  </Window>
));
