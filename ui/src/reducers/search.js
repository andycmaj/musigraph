import reduceReducers from 'reduce-reducers';
import fetchReducer from './fetchReducer';
import { createApiActionTypes } from '../actions/createApiActions';
import { RESET_PATH, CLEAR_PATH } from '../actions/path';
import { SEARCH } from '../actions/search';

const defaultState = {
  loading: false,
  data: [],
  selectedResult: null,
};

const resetPathActions = createApiActionTypes(RESET_PATH);

const searchReducer = (state = defaultState, { type, payload, error }) => {
  switch (type) {
    case CLEAR_PATH:
      return {
        ...state,
        selectedResult: null,
        data: []
      };
    case resetPathActions.request.type:
      return {
        ...state,
        selectedResult: payload.initialNode,
      };
    default:
      return state;
  }
};

export default reduceReducers(searchReducer, fetchReducer(SEARCH));
