import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const SEARCH = 'SEARCH';

export const doSearch = name => {
  console.log(name);
  return createApiActions(SEARCH, {
    url: `${API_URL}/search?artistName=${name}`,
    actionTypeOverrides: {
      success: {
        payload: (action, state, response) =>
          response.json().then(json => ({ data: json })),
      },
    },
  });
};
