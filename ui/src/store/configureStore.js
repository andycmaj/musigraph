import { apiMiddleware } from 'redux-api-middleware';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { load, save } from 'redux-localstorage-simple';
import rootReducer from '../reducers';

const browserPersistedState = load({ states: ['user'] });
const localStorageSaver = save({ states: ['user'] });

export default () =>
  createStore(
    rootReducer,
    browserPersistedState,
    composeWithDevTools(
      applyMiddleware(localStorageSaver, apiMiddleware, thunk)
    )
  );
