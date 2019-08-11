import { NodeType } from 'lib/node';
import discogsClient from 'lib/discogsClient';
import { getReleaseInfoUrl, getArtistInfoUrl } from './nodeUtils';
import { Spotify } from 'lib/spotifyClient';
import { DiscogsFullRelease, DiscogsArtist } from './discogsNodeVisitor';

enum NodeActionType {
  Audio = 'audio',
  ExternalLink = 'externalLink',
}

export interface NodeAction {
  type: NodeActionType;
  label: string;
  url: string;
}

export type ActionBuilder = (
  spotify: Spotify,
  nodeId: number
) => Promise<NodeAction[]>;

const getRandomTrack = (tracks: any[]) =>
  tracks[Math.floor(Math.random() * tracks.length)];

const getReleaseActions: ActionBuilder = async (spotify, nodeId) => {
  const discogsRelease: DiscogsFullRelease = await discogsClient.getRelease(
    nodeId
  );

  const actions: NodeAction[] = [
    {
      label: 'Info',
      type: NodeActionType.ExternalLink,
      url: getReleaseInfoUrl(discogsRelease),
    },
  ];

  const results = await spotify.findAlbums(
    discogsRelease.title,
    discogsRelease.artists[0].name
  );

  const release = results.length ? results[0] : null;
  if (release) {
    const tracks = await spotify.getAlbumTracks(release.id, 1);
    if (tracks && tracks.length) {
      const track = getRandomTrack(tracks);
      if (track.preview_url) {
        actions.push({
          label: track.name,
          type: NodeActionType.Audio,
          url: track.preview_url,
        });
      }
    }
  }

  return actions;
};

const sanitizeArtistName = (name: string) => name.replace(/\(\d+\)/, '').trim();

const getArtistActions: ActionBuilder = async (spotify, nodeId) => {
  const discogsArtist: DiscogsArtist = await discogsClient.getArtist(nodeId);

  const actions: NodeAction[] = [
    {
      label: 'Info',
      type: NodeActionType.ExternalLink,
      url: getArtistInfoUrl(discogsArtist),
    },
  ];

  const results = await spotify.findArtists(
    sanitizeArtistName(discogsArtist.name)
  );

  const artist = results[0];
  if (artist) {
    const tracks = await spotify.getArtistTopTracks(artist.id);
    if (tracks && tracks.length) {
      const track = getRandomTrack(tracks);
      if (track.preview_url) {
        actions.push({
          label: track.name,
          type: NodeActionType.Audio,
          url: track.preview_url,
        });
      }
    }
  }

  return actions;
};

export default async (
  nodeId: number,
  nodeType: NodeType,
  spotify: any
): Promise<NodeAction[]> => {
  if (nodeType === NodeType.Artist) {
    return getArtistActions(spotify, nodeId);
  } else {
    return getReleaseActions(spotify, nodeId);
  }
};
