import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const SEARCH = 'SEARCH';

export const doSearch = (type, query) =>
  createApiActions(SEARCH, {
    url: `${API_URL}/search?type=${type}&query=${query}`,
  });
