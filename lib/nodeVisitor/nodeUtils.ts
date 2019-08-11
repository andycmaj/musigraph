/* eslint-disable @typescript-eslint/camelcase */
export const getReleaseId = ({ type, id, main_release }) =>
  type === 'master' ? main_release : id;

export const getReleaseInfoUrl = discogsRelease =>
  `https://www.discogs.com/release/${getReleaseId(discogsRelease)}`;

export const getArtistInfoUrl = discogsArtist =>
  `https://www.discogs.com/artist/${discogsArtist.id}`;
