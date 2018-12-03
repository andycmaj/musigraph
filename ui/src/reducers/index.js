import { combineReducers } from 'redux';
import fetchReducer from './fetchReducer';
import { SEARCH } from '../actions/search';

import path from './path';

export default combineReducers({
  search: fetchReducer(SEARCH, { data: [] }),
  path
});
