import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';

import configureStore from './store/configureStore';
import AppContainer from './AppContainer';

const rootEl = document.getElementById('root');

render(
  <Provider store={configureStore}>
    <AppContainer />
  </Provider>,
  rootEl
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
