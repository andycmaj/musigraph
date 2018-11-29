import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const SEARCH = 'SEARCH';

export const doSearch = name =>
  createApiActions(SEARCH, {
    url: `${API_URL}/search?artistName=${name}`,
  });
