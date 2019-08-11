export enum DataSource {
  Discogs = 'Discogs',
  Spotify = 'Spotify',
}

export interface AppConfig {
  dataSource: DataSource;
  discogs: {
    userToken: string;
  };
  spotify: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
}

const appConfig: AppConfig = {
  dataSource: process.env.DATA_SOURCE as DataSource,
  discogs: {
    userToken: process.env.DISCOGS_APITOKEN,
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENTID,
    clientSecret: process.env.SPOTIFY_CLIENTSECRET,
    callbackUrl:
      process.env.SPOTIFY_CALLBACK || 'http://localhost:3000/api/auth/callback',
  },
};

export default appConfig;
