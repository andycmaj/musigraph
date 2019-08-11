import withSpotifyOAuth from 'lib/withSpotifyOAuth';

const handler = async () => {
  console.log('auth handler');
};

export default withSpotifyOAuth(handler);
