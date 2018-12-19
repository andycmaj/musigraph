import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const SEARCH = 'SEARCH';
export const SET_SEARCH_TYPE = 'SET_SEARCH_TYPE';

export const doSearch = (type, query) =>
  createApiActions(SEARCH, {
    url: `${API_URL}/search?type=${type}&query=${query}`,
  });

export const setSearchType = searchType => ({
  type: SET_SEARCH_TYPE,
  payload: {
    searchType,
  },
});
