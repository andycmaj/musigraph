import { combineReducers } from 'redux';
import path from './path';
import search from './search';
import user from './user';

export default combineReducers({
  search,
  path,
  user,
});
