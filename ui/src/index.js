import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import configureStore from './store/configureStore';
import AppContainer from './AppContainer';

const rootEl = document.getElementById('root');

render(
  <Provider store={configureStore()}>
    <AppContainer />
  </Provider>,
  rootEl
);
