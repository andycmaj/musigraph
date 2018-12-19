import { API_URL } from '../constants';

export const CONNECT_SPOTIFY = 'CONNECT_SPOTIFY';
export const SET_USER_CONFIG = 'SET_USER_CONFIG';

export const connectSpotify = () => dispatch => {
  dispatch({
    type: SET_USER_CONFIG,
    payload: {
      isUsingSpotify: true,
    },
  });

  window.location.href = `${API_URL}/authentication/signin/spotify`;
};

export const dismissSplash = () => ({
  type: SET_USER_CONFIG,
  payload: {
    shouldShowSplash: false,
  },
});

export const showSplash = () => ({
  type: SET_USER_CONFIG,
  payload: {
    shouldShowSplash: true,
  },
});
