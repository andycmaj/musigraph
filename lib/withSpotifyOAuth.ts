// import microAuthSpotify from 'microauth-spotify';
import microAuthSpotify from 'lib/microAuthSpotify';
import appConfig from 'lib/appConfig';

const spotifyAuth = microAuthSpotify({
  ...appConfig.spotify,
  path: '/api/auth/login',
});

export default spotifyAuth;
