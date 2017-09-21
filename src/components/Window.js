import React from 'react';
import { css } from 'glamor';

const styles = {
  container: css({
    margin: 10,
    border: '1px solid #ccc'
  }),
  header: css({
    '& h1': {
      fontWeight: 'normal',
      fontSize: '1em',
      textAlign: 'center',
      borderBottom: '1px solid #ccc',
      background: 'green'
    }
  }),
  children: css({
    padding: 10
  })
}

export default ({ heading, children }) => (
  <div className={styles.container}>
    <div className={styles.header}>
      <h1>{heading}</h1>
    </div>
    <div className={styles.children}>
      {children}
    </div>
  </div>
);
