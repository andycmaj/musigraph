import { combineReducers } from 'redux';
import fetchReducer from './fetchReducer';
import { SEARCH } from '../actions/search';

import graph from './graph';

export default combineReducers({
  search: fetchReducer(SEARCH, { loading: false, data: [] }),
  graph
});
