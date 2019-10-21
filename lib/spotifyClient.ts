import SpotifyWebApi from 'spotify-web-api-node';
import appConfig from './appConfig';

interface Response<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

export interface Spotify {
  findAlbums: (
    title: string,
    artist: string
  ) => Promise<SpotifyApi.AlbumObjectSimplified[]>;

  findArtists: (name: string) => Promise<SpotifyApi.ArtistObjectFull[]>;

  getAlbumTracks: (
    albumId: string,
    limit: number
  ) => Promise<SpotifyApi.TrackObjectSimplified[]>;

  getArtistTopTracks: (
    artistId: string
  ) => Promise<SpotifyApi.TrackObjectFull[]>;
}

export default (accessToken: string, refreshToken?: string): Spotify => {
  const client = new SpotifyWebApi({
    ...appConfig.spotify,
    accessToken,
    refreshToken,
  });

  async function withTokenRefresh<T>(
    apiCall: () => Promise<Response<T>>,
    remainingTries = 2
  ): Promise<Response<T>> {
    if (remainingTries <= 0) {
      throw new Error('maximum retries reached');
    }

    try {
      const response = await apiCall();

      if (response.statusCode === 401) {
        // Refresh token
        console.log('refreshing accesstoken');
        const response = await client.refreshAccessToken();
        if (response.statusCode !== 200) {
          throw new Error('error refreshing access code: ' + response.body);
        }

        // TODO: reset access token in cookie.
        client.setAccessToken(response.body.access_token);
        return withTokenRefresh(apiCall, remainingTries - 1);
      }

      return response;
    } catch (e) {
      console.log('error making spotify call', JSON.stringify(e));
      throw e;
    }
  }

  return {
    findAlbums: async (
      title: string,
      artist: string
    ): Promise<SpotifyApi.AlbumObjectSimplified[]> => {
      const exactAlbumQuery = `album: "${title}" artist: "${artist}"`;
      const response = await withTokenRefresh(() =>
        client.searchAlbums(exactAlbumQuery, {
          market: 'US',
        })
      );
      return response.body.albums.items;
    },

    findArtists: async (
      name: string
    ): Promise<SpotifyApi.ArtistObjectFull[]> => {
      const exactArtistQuery = `artist: "${name}"`;
      const response = await withTokenRefresh(() =>
        client.searchArtists(exactArtistQuery, {
          market: 'US',
        })
      );
      return response.body.artists.items;
    },

    getAlbumTracks: async (
      albumId: string,
      limit = 10
    ): Promise<SpotifyApi.TrackObjectSimplified[]> => {
      const response = await withTokenRefresh(() =>
        client.getAlbumTracks(albumId.toString(), { limit })
      );
      return response.body.items;
    },

    getArtistTopTracks: async (
      artistId: string
    ): Promise<SpotifyApi.TrackObjectFull[]> => {
      const response = await withTokenRefresh(() =>
        client.getArtistTopTracks(artistId.toString(), 'US')
      );
      return response.body.tracks;
    },
  };
};
