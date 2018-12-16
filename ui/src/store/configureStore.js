import { apiMiddleware } from 'redux-api-middleware';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';

import rootReducer from '../reducers';

const devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devTools ? devTools({}) : compose;

// const initialState = window.initialData || {};
const initialState = load({ states: ['user'] });

const localStorageSaver = save({ states: ['user'] });

const RootStore =
  process.env.NODE_ENV === 'production'
    ? createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(localStorageSaver, apiMiddleware, thunk))
      )
    : createStore(
        rootReducer,
        initialState,
        composeEnhancers(
          applyMiddleware(
            localStorageSaver,
            apiMiddleware,
            thunk,
            createLogger({ collapsed: true })
          )
        )
      );

export default RootStore;
