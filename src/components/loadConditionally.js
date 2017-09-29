import React from 'react';

export default (condition, Component) => props => (
  condition() ? <Component {...props} /> : <div>Loading...</div>
);
