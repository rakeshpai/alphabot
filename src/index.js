import React from 'react';
import { render } from 'react-dom';
import App from './App';
import store from './store';
// import registerServiceWorker from './registerServiceWorker';

const renderApp = () => render(<App />, document.getElementById('root'));

renderApp();
store.onChange = renderApp;

// registerServiceWorker();
