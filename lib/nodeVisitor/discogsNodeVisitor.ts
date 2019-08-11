/* eslint-disable @typescript-eslint/camelcase */
import discogsClient from 'lib/discogsClient';
import { NodeVisitor, AdjacentNodesResult } from '.';
import { Node, NodeType } from 'lib/node';
import { DataSource } from 'lib/appConfig';
import { uniqBy, prop, sortBy } from 'ramda';
import { getReleaseId } from './nodeUtils';

// TODO: use year
/*
{ status: 'Accepted',
    stats: { user: [Object], community: [Object] },
    thumb:
     'https://img.discogs.com/iPXbeJ1BTYpFtwZeOb_eCDLCRIs=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-5964521-1407560195-3319.jpeg.jpg',
    format: 'CD, Album',
    title: 'Million To One',
    label: 'Palmetto Records',
    role: 'Appearance',
    year: 1995,
    resource_url: 'https://api.discogs.com/releases/5964521',
    artist: 'Steve Million',
    type: 'release',
    id: 5964521 }
*/
export interface DiscogsRelease {
  id: number;
  title: string;
  thumb: string;
  artist: string;
  type: 'release' | 'master';
  main_release: number;
}

export interface DiscogsFullRelease extends DiscogsRelease {
  artists: DiscogsArtist[];
}

/*
{ styles: [ 'Post Bop', 'Contemporary Jazz' ],
  series: [],
  labels:
   [ { name: 'Criss Cross Jazz',
       entity_type: '1',
       thumbnail_url:
        'https://img.discogs.com/qjrnUn0_e9Daw-Y6V0XkPkf1jtg=/fit-in/170x169/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/L-105846-1248331523.gif.jpg',
       catno: 'Criss 1107 CD',
       resource_url: 'https://api.discogs.com/labels/105846',
       id: 105846,
       entity_type_name: 'Label' } ],
  year: 1995,
  community:
   { status: 'Accepted',
     rating: { count: 1, average: 5 },
     have: 24,
     contributors: [ [Object], [Object] ],
     want: 4,
     submitter:
      { username: 'blissfulscribbler',
        resource_url: 'https://api.discogs.com/users/blissfulscribbler' },
     data_quality: 'Needs Vote' },
  artists:
   [ { join: '',
       name: 'The Chris Potter Quartet',
       anv: 'Chris Potter Quartet',
       tracks: '',
       thumbnail_url: '',
       role: '',
       resource_url: 'https://api.discogs.com/artists/2146717',
       id: 2146717 } ],
  images:
   [ { uri:
        'https://img.discogs.com/dQ-MqpgikI8UzuNqaKjdXXCgxMA=/fit-in/600x598/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-6000574-1408475403-6514.jpeg.jpg',
       height: 598,
       width: 600,
       resource_url:
        'https://img.discogs.com/dQ-MqpgikI8UzuNqaKjdXXCgxMA=/fit-in/600x598/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-6000574-1408475403-6514.jpeg.jpg',
       type: 'primary',
       uri150:
        'https://img.discogs.com/Kgh7Nh2yBbHp55i64tTEcu_BHNo=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-6000574-1408475403-6514.jpeg.jpg' } ],
  format_quantity: 1,
  id: 6000574,
  artists_sort: 'Chris Potter Quartet, The',
  genres: [ 'Jazz' ],
  thumb:
   'https://img.discogs.com/Kgh7Nh2yBbHp55i64tTEcu_BHNo=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-6000574-1408475403-6514.jpeg.jpg',
  num_for_sale: 7,
  title: 'Sundiata',
  date_changed: '2014-08-19T12:17:57-07:00',
  lowest_price: 12.5,
  status: 'Accepted',
  released_formatted: '1995',
  estimated_weight: 85,
  released: '1995',
  date_added: '2014-08-19T12:10:02-07:00',
  tracklist:
   [ { duration: '8:42',
       position: '1',
       type_: 'track',
       extraartists: [Array],
       title: 'Fear Of Flying' },
       ...
     { duration: '5:42',
       position: '8',
       type_: 'track',
       extraartists: [Array],
       title: 'C.P.\'s Blues' } ],
  extraartists:
   [ { join: '',
       name: 'Doug Weiss',
       anv: '',
       tracks: '',
       thumbnail_url:
        'https://img.discogs.com/7ZQECywHKD0lnoU37TDjvlPgz1M=/335x500/smart/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/A-360634-1312913411.jpeg.jpg',
       role: 'Bass',
       resource_url: 'https://api.discogs.com/artists/360634',
       id: 360634 },
    ...
     { join: '',
       name: 'Chris Potter (2)',
       anv: '',
       tracks: '',
       thumbnail_url:
        'https://img.discogs.com/Zb9B6fMeXwYbPmi5QRrx50l4SWc=/600x351/smart/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/A-256512-1476369446-4401.jpeg.jpg',
       role: 'Tenor Saxophone, Alto Saxophone, Soprano Saxophone',
       resource_url: 'https://api.discogs.com/artists/256512',
       id: 256512 } ],
  country: 'Netherlands',
  notes: 'Recorded December 13, 1993',
  identifiers: [ { type: 'Barcode', value: '8 712474 110728' } ],
  companies:
   [ { name: 'RPM Studios',
       entity_type: '23',
       thumbnail_url: '',
       catno: '',
       resource_url: 'https://api.discogs.com/labels/264220',
       id: 264220,
       entity_type_name: 'Recorded At' } ],
  uri:
   'https://www.discogs.com/Chris-Potter-Quartet-Sundiata/release/6000574',
  formats: [ { descriptions: [Array], name: 'CD', qty: '1' } ],
  resource_url: 'https://api.discogs.com/releases/6000574',
  data_quality: 'Needs Vote' }
*/
export interface DiscogsArtist {
  id: number;
  name: string;
  role?: string;
  thumbnail_url?: string;
}

type ReleaseConverter = (
  artistName: string
) => (discogsRelease: DiscogsRelease) => Node;

const convertReleaseToNode: ReleaseConverter = artistName => ({
  id,
  title,
  thumb,
  artist,
  type,
  main_release,
}) => {
  const releaseId = getReleaseId({ type, id, main_release });
  return {
    dataSource: DataSource.Discogs,
    type: NodeType.Release,
    id: releaseId.toString(),
    name: title,
    thumbnailUrl: thumb,
    subTitle: artist != artistName ? artist : null,
    // TODO: infoUrl
  };
};

type ArtistConverter = (discogsArtist: DiscogsArtist) => Node;

const convertArtistToNode: ArtistConverter = ({
  id,
  name,
  thumbnail_url,
  role,
}) => ({
  dataSource: DataSource.Discogs,
  type: NodeType.Artist,
  id: id.toString(),
  name,
  subTitle: role,
  thumbnailUrl: thumbnail_url,
  // TODO: infoUrl
});

const getReleases = async (artistId: number): Promise<AdjacentNodesResult> => {
  const [artist, discogsResponse] = await Promise.all([
    discogsClient.getArtist(artistId),
    discogsClient.getReleasesForArtist(artistId),
  ]);

  // TODO: types for artist/discogsResponse

  return {
    source: {
      dataSource: DataSource.Discogs,
      type: NodeType.Artist,
      id: artistId.toString(),
      name: artist.name as string,
    },
    nodes: discogsResponse.releases.map(convertReleaseToNode(artist.name)),
  };
};

const getArtists = async (releaseId: number): Promise<AdjacentNodesResult> => {
  const release = await discogsClient.getRelease(releaseId);

  // TODO: types for artist/discogsResponse

  const artists = sortBy(
    prop('name'),
    uniqBy(prop('id'), [
      ...(release.artists || []),
      ...release.extraartists,
    ]).map(convertArtistToNode)
  );

  return {
    source: {
      dataSource: DataSource.Discogs,
      type: NodeType.Release,
      id: releaseId.toString(),
      name: release.title,
    },
    nodes: artists,
  };
};

const discogsVisitor: NodeVisitor = {
  getAdjacentNodes: async (nodeId: string, nodeType: NodeType) => {
    if (nodeType === NodeType.Artist) {
      return await getReleases(parseInt(nodeId, 10));
    } else {
      return await getArtists(parseInt(nodeId, 10));
    }
  },
};

export default discogsVisitor;
