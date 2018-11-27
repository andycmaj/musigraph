import { apiMiddleware } from 'redux-api-middleware';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devTools ? devTools({}) : compose;

const initialState = window.initialData || {};

const RootStore =
  process.env.NODE_ENV === 'production'
    ? createStore(rootReducer, initialState, compose(applyMiddleware(apiMiddleware, thunk)))
    : createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(apiMiddleware, thunk, createLogger({ collapsed: true })))
      );

export default RootStore;
