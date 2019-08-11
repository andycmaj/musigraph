import { SET_USER_CONFIG } from '../actions/user';

const defaultState = {
  isUsingSpotify: false,
  shouldShowSplash: true,
};

const userReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case SET_USER_CONFIG:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default userReducer;
