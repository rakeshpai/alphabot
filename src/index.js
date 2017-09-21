import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import store from './store';
import './keyboard-shortcuts';

// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker();

const renderApp = () => render(<App />, document.getElementById('root'));

renderApp();
store.onChange = renderApp;
