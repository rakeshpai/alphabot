import React from 'react';
import store from './store';

export default props => {
  return (
    <pre>
      {JSON.stringify(store, null, 2)}
    </pre>
  )
};
