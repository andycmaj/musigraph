import Discojs from 'discojs';
import appConfig from './appConfig';

const client = new Discojs({
  ...appConfig.discogs,
});

export default client;
