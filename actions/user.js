export const CONNECT_SPOTIFY = 'CONNECT_SPOTIFY';
export const SET_USER_CONFIG = 'SET_USER_CONFIG';

export const connectSpotify = () => dispatch => {
  // TODO: don't dispatch this until we RETURN from oauth flow
  // with ?linked=spotify (set it on store init)
  dispatch({
    type: SET_USER_CONFIG,
    payload: {
      isUsingSpotify: true,
    },
  });

  // window.location.href = `${API_URL}/authentication/signin/spotify`;
  window.location.href = `/api/auth/login`;
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
