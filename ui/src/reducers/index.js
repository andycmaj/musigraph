import { combineReducers } from 'redux';

import path from './path';
import search from './search';

export default combineReducers({
  search,
  path
});
