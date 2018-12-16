import { concat, mergeWith, uniq } from 'ramda';
import { RSAA } from 'redux-api-middleware';

export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_FAILURE = 'API_FAILURE';

const mergePlan = (x, y) => {
  if (Array.isArray(x) && Array.isArray(y)) {
    return uniq(concat(x, y));
  }

  if (typeof x === 'object' && typeof y === 'object') {
    return mergeWith(mergePlan, x, y);
  }

  return y;
};

const deepMerge = mergeWith(mergePlan);

export const createApiActionTypes = (apiName, url, apiOptions = {}) => {
  if (!apiName) {
    return;
  }
  return {
    request: {
      type: `${API_REQUEST}_${apiName}`,
      meta: { apiName, url, type: API_REQUEST, apiOptions },
    },
    success: {
      type: `${API_SUCCESS}_${apiName}`,
      meta: { apiName, url, type: API_SUCCESS, apiOptions },
    },
    failure: {
      type: `${API_FAILURE}_${apiName}`,
      meta: { apiName, url, type: API_FAILURE, apiOptions },
    },
  };
};

const createApiActions = (
  apiName,
  {
    url,
    method = 'GET',
    body = undefined,
    actionTypeOverrides = {},
    apiOptions = {},
  }
) => {
  const actionTypes = deepMerge(
    createApiActionTypes(apiName, url, apiOptions),
    actionTypeOverrides
  );

  return {
    [RSAA]: {
      method,
      body,
      endpoint: url,
      options: {
        redirect: 'follow',
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      types: [actionTypes.request, actionTypes.success, actionTypes.failure],
    },
  };
};

export default createApiActions;
