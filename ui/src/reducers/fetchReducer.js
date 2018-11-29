import { createApiActionTypes } from '../actions/createApiActions';

export const fetchReducerDefaultState = {
  loading: false,
};

const fetchReducer = (apiName, defaultState = fetchReducerDefaultState) => {
  const actionTypes = createApiActionTypes(apiName);
  return (state = defaultState, { type, payload, meta, error }) => {
    switch (type) {
      case actionTypes.request.type:
        return { ...state, data: payload, error, loading: !error };

      case actionTypes.success.type:
        return { ...state, data: payload, loading: false };

      case actionTypes.failure.type:
        return { ...state, error: payload, loading: false };

      default:
        return state;
    }
  };
};

export default fetchReducer;
