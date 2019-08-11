import fetch from 'isomorphic-unfetch';
import { createMiddleware } from 'isomorphic-redux-api-middleware';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { load, save } from 'redux-localstorage-simple';
import rootReducer from '../reducers';
import { MakeStore } from 'lib/withRedux';

const apiMiddleware = ({ getState }) =>
  createMiddleware({ fetch })({ getState });

const makeStore: MakeStore = (initialState, { query, isServer }) => {
  let state = initialState;
  const middleware = [apiMiddleware, thunk];
  if (isServer && query) {
    const { linked } = query;

    if (linked === 'spotify') {
      state = {
        ...state,
        user: {
          isUsingSpotify: true,
          shouldShowSplash: false,
        },
      };
    }
  } else if (!isServer) {
    const localStorageSaver = save({ states: ['user'] });
    middleware.unshift(localStorageSaver);
    // state = load({ states: ['user'], preloadedState: initialState });
    state = load({ states: ['user'] });
  }

  return createStore(
    rootReducer,
    state,
    composeWithDevTools(applyMiddleware(...middleware))
  );
};

export default makeStore;
